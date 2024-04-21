import {Construct} from 'constructs';
import {ExecutorFunction, ExecutorFunctionProps} from './executor-function';

export class DatabaseManager extends Construct {
  constructor(scope: Construct, id: string, props: ExecutorFunctionProps) {
    super(scope, id);

    new ExecutorFunction(this, 'ExecutorFunction', {
      vpcId: props.vpcId,
      availabilityZones: props.availabilityZones,
      privateSubnetIds: props.privateSubnetIds,
      vpcCidrBlock: props.vpcCidrBlock,
    });
  }
}
