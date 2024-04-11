import {Construct} from 'constructs';
import {Function, Runtime} from 'aws-cdk-lib/aws-lambda';
import {ExecutorFunction, ExecutorFunctionProps} from './executor-function';
import * as path from 'path';
import {Vpc} from 'aws-cdk-lib/aws-ec2';

export class DatabaseManager extends Construct {
  constructor(scope: Construct, id: string, props: ExecutorFunctionProps) {
    super(scope, id);

    const executorFunctionProps: ExecutorFunctionProps = {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: path.join(
        __dirname,
        '..',
        '..',
        'handlers',
        'src',
        'database-manager.ts'
      ),
      environment: {
        // TAG_NAME: props.tagName,
      },
      vpcId: props.vpcId,
      availabilityZones: props.availabilityZones,
      privateSubnetIds: props.privateSubnetIds,
      vpcCidrBlock: props.vpcCidrBlock,
    };

    const executorFunction = new ExecutorFunction(
      this,
      'ExecutorFunction',
      executorFunctionProps
    );
  }
}
