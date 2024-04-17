import {
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

const currentRegion = process.env.AWS_REGION;
const client = new SecretsManagerClient({region: currentRegion});

interface SecretDetails {
  readonly username: string;
  readonly password: string;
  readonly endpoint: string;
  readonly port: number;
}

export async function getSecret(
  secretName: string
): Promise<SecretDetails | null> {
  console.log(`starting getSecret: secretName is ${secretName}`);
  try {
    // Create the command
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });

    // Send the request and get the response
    const response: GetSecretValueCommandOutput = await client.send(command);
    if (response.SecretString) {
      return JSON.parse(response.SecretString) as SecretDetails;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching secret value. Exiting. ${error}`);
    throw error;
  }
}

export async function checkSecretKeys(
  secret: SecretDetails,
  keys: string[]
): Promise<boolean> {
  console.log(`starting checkSecretKeys: keys are ${keys}`);
  try {
    if (secret === null) {
      return false;
    }
    for (const key of keys) {
      if (!(key in secret)) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error(`Error fetching secret value. Exiting. ${error}`);
    throw error;
  }
}
