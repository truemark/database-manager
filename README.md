# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

Connecting to the database

When calling the Lambda function, a Secret ARN must be passed in the event object. 
The following key/value pairs are required in the Secrets Manager master database secret:


| Key      | Sample Value                                          | Description                               |
|----------|-------------------------------------------------------|-------------------------------------------|
| engine   | mysql                                                 | The database engine                       |
| host     | mydbcluster.cluster-xxxxx.us-east-1.rds.amazonaws.com | The hostname of the database cluster      |
| password | FEmDPNNw3#nqlyIRe                                     | The password for the master database user |
| port     | 3306                                                  | The port of the database cluster          |
| username | master                                                | The username for the master database user |

