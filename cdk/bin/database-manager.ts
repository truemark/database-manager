#!/usr/bin/env node
import 'source-map-support/register';
// import * as cdk from 'aws-cdk-lib';
import {
  DatabaseManagerStack,
  DatabaseManagerStackProps,
} from '../lib/database-manager-stack';
import {ExtendedApp} from 'truemark-cdk-lib/aws-cdk';

// lkoivu truemark account
const databaseManagerStackProps: DatabaseManagerStackProps = {
  vpcId: 'vpc-09186ce91104e20c6',
  privateSubnetIds: ['subnet-00b7b293bc7e39ad5', 'subnet-091ee26f6c54a5b1c'],
  availabilityZones: ['us-west-2a', 'us-west-2b'],
  vpcCidrBlock: '10.200.0.0/20',
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// const databaseManagerStackProps: DatabaseManagerStackProps = {
//   vpcId: 'vpc-057ded8a4829d01a7',
//   privateSubnetIds: [
//     'subnet-01001cca4307389db',
//     'subnet-0478b2f477f72229c',
//     'subnet-00d785a8314042ed7',
//   ],
//   availabilityZones: ['us-west-2a', 'us-west-2b', 'us-west-2c'],
//   vpcCidrBlock: '10.238.0.0/19',
//   account: process.env.CDK_DEFAULT_ACCOUNT,
//   region: process.env.CDK_DEFAULT_REGION,
// };
//
// const app = new ExtendedApp();
// new DatabaseManagerStack(app, 'DatabaseManager', databaseManagerStackProps);
