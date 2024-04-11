import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {ExtendedStack, ExtendedStackProps} from 'truemark-cdk-lib/aws-cdk';
import * as p from '../package.json';
import {DatabaseManager} from './database-manager-construct';

export interface DatabaseManagerStackProps extends ExtendedStackProps {
  readonly vpcId: string;
  readonly privateSubnetIds: string[];
  readonly availabilityZones: string[];
  readonly account?: string;
  readonly region?: string;
  readonly vpcCidrBlock: string;
}

export class DatabaseManagerStack extends ExtendedStack {
  constructor(scope: Construct, id: string, props: DatabaseManagerStackProps) {
    super(scope, id, props);
    // this.addMetadata('Version', p.version);
    // this.addMetadata('Name', p.name);
    // this.addMetadata('RepositoryType', p.repository.type);
    // this.addMetadata('Repository', p.repository.url);
    // this.addMetadata('Homepage', p.homepage);

    new DatabaseManager(this, 'DatabaseManager', {...props});
  }
}
