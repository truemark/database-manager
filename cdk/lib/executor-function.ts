import {AssetHashType} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Architecture, Runtime} from 'aws-cdk-lib/aws-lambda';
import {Duration} from 'aws-cdk-lib';
import {RetentionDays} from 'aws-cdk-lib/aws-logs';
import * as path from 'path';
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';
// import {
//   ExtendedNodejsFunction,
//   ExtendedNodejsFunctionProps,
// } from 'truemark-cdk-lib/aws-lambda';
import {aws_lambda_nodejs as NodejsFunction} from 'aws-cdk-lib';

import {
  IInterfaceVpcEndpointService,
  InterfaceVpcEndpoint,
  InterfaceVpcEndpointService,
  Port,
  Peer,
  SecurityGroup,
  SecurityGroupProps,
  Subnet,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';

export interface ExecutorFunctionProps extends NodejsFunction {
  readonly vpcId: string;
  readonly availabilityZones: string[];
  readonly privateSubnetIds: string[];
  readonly vpcCidrBlock: string;
}

export class ExecutorFunction extends NodejsFunction {
  constructor(scope: Construct, id: string, props: ExecutorFunctionProps) {
    super(scope, id, {
      architecture: Architecture.ARM_64,
      entry: path.join(
        __dirname,
        '..',
        '..',
        'handlers',
        'src',
        'database-manager.ts'
      ),
      environment: {
        NODE_EXTRA_CA_CERTS: '/var/runtime/ca-cert.pem',
      },
      handler: 'handler',
      logRetention: RetentionDays.ONE_MONTH,
      memorySize: 512,
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      vpc: Vpc.fromVpcAttributes(scope, 'Vpc', {
        vpcId: props.vpcId,
        availabilityZones: props.availabilityZones,
        privateSubnetIds: props.privateSubnetIds,
        vpcCidrBlock: props.vpcCidrBlock,
      }),
      ...props,
    });
    this.addToRolePolicy(
      new PolicyStatement({
        actions: [
          'secretsmanager:GetSecretValue',
          'secretsmanager:DescribeSecret',
          'secretsmanager:ListSecrets',
          'kms:decrypt',
        ],
        resources: ['*'],
      })
    );

    // Create a reference to the VPC id passed in as a parameter.
    // This is used to create the VPC endpoint.
    const vpc = Vpc.fromVpcAttributes(this, 'Vpc', {
      vpcId: props.vpcId,
      availabilityZones: props.availabilityZones,
      privateSubnetIds: props.privateSubnetIds,
      vpcCidrBlock: props.vpcCidrBlock,
    });

    // TODO: change allowAllOutbound to false and add specific rules
    const vpcEndpointSecurityGroupProps: SecurityGroupProps = {
      vpc: vpc,
      securityGroupName: 'VpcEndpointForLambdaSecurityGroup',
      description:
        'Lambda VPC endpoint for database-manager function, so it can reach RDS.',
      allowAllOutbound: true,
    };

    const vpcEndpointSecurityGroup = new SecurityGroup(
      this,
      'VpcEndpointForLambdaSecurityGroup',
      vpcEndpointSecurityGroupProps
    );

    // Add an interface VPC endpoint for Lambda
    const currentRegion = process.env.AWS_REGION;
    const lambdaVpcEndpoint = new InterfaceVpcEndpoint(
      this,
      'LambdaVpcEndpoint',
      {
        securityGroups: [vpcEndpointSecurityGroup],
        service: new InterfaceVpcEndpointService(
          `com.amazonaws.${currentRegion}.lambda`,
          5432
        ),
        subnets: {
          subnets: props.privateSubnetIds.map(id =>
            Subnet.fromSubnetAttributes(this, `Subnet${id}`, {subnetId: id})
          ),
        },
        vpc: vpc,
      }
    );
  }
}
