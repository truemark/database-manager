import {
  ExtendedNodejsFunction,
  ExtendedNodejsFunctionProps,
} from 'truemark-cdk-lib/aws-lambda';
import {Construct} from 'constructs';
import {Architecture, Runtime} from 'aws-cdk-lib/aws-lambda';
import {Duration} from 'aws-cdk-lib';
import {RetentionDays} from 'aws-cdk-lib/aws-logs';
import * as path from 'path';
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';

export interface DatabaseManagerFunctionProps
  extends ExtendedNodejsFunctionProps {}

export class DatabaseManagerFunction extends ExtendedNodejsFunction {
  constructor(
    scope: Construct,
    id: string,
    props: DatabaseManagerFunctionProps
  ) {
    super(scope, id, {
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.ARM_64,
      handler: 'handler', // TODO: don't hardcode this
      memorySize: 512,
      timeout: Duration.seconds(900),
      logRetention: RetentionDays.ONE_MONTH,
      entry: path.join(__dirname, '..', '..', 'handlers', 'src', 'executor.ts'),
    });

    this.addToRolePolicy(
      new PolicyStatement({
        actions: [
          'secretsmanager:GetSecretValue',
          'secretsmanager:DescribeSecret',
          'secretsmanager:ListSecrets',
          'kms:decrypt',
        ],
        // TODO: Narrow  down to autodump secrets, by tag or prefix, and the KMS key used to encrypt them.
        resources: ['*'],
      })
    );
  }
}
