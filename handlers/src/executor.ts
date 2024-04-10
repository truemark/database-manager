// import {
//   SecretsManagerClient,
//   DescribeSecretCommand,
// } from '@aws-sdk/client-secrets-manager';

import {getSecret} from './secrets-helper';
const currentRegion = process.env.AWS_REGION;

interface EventParameters  {
  readonly databaseName?: string;
  readonly engine?: string;
  readonly operation?: string;
  readonly secretArn?: string;
}

// interface ReturnValue {
//   readonly result: string;
// }

// Parameters: secret arn, operation

export async function handler(event: EventParameters): Promise<string> {
  console.log(`event is ${JSON.stringify(event)}`);
  const secretArn = event.secretArn;
  console.log(`starting function: secretArn is ${secretArn}`);


  // secretValue = getSecret(secretArn);
  const secretValue = getSecret(secretArn)
    .then(secretValue => {
      console.log('Secret:', secretValue);
    })
    .catch(err => {
      console.error('Error fetching secret:', err);
    });





}
