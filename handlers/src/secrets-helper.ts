import {
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

const currentRegion = process.env.AWS_REGION;
const client = new SecretsManagerClient({region: currentRegion});

export async function getSecret(secretName: string): Promise<string> {
  console.log(`starting getSecret: secretName is ${secretName}`);
  try {

    // Create the command
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });

    // Send the request and get the response
    const response: GetSecretValueCommandOutput = await client.send(command);
    const secretObject: string = response.SecretString
      ? JSON.parse(response.SecretString)
      : {};

    return secretObject;
  } catch (error) {
    console.error(`Error fetching secret value. Exiting. ${error}`);
    throw error;
  }
}
