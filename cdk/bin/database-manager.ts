#!/usr/bin/env node
import 'source-map-support/register';
// import * as cdk from 'aws-cdk-lib';
import {
  DatabaseManagerStack,
  DatabaseManagerStackProps,
} from '../lib/database-manager-stack';
import {ExtendedApp} from 'truemark-cdk-lib/aws-cdk';

const databaseManagerStackProps: DatabaseManagerStackProps = {
  vpcId: 'vpc-09186ce91104e20c6', // TODO Populate from your dev account, it's fine to check in, we'll remove it later
  privateSubnetIds: ['subnet-0ca25478c2d35b8e4', 'subnet-094a6a1daa32e3a52'],
  availabilityZones: ['us-west-2a', 'us-west-2b'],
  vpcCidrBlock: '10.200.0.0/20',
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new ExtendedApp();
new DatabaseManagerStack(app, 'DatabaseManager', databaseManagerStackProps);
