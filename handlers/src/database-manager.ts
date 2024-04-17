import {getSecret, checkSecretKeys} from './secrets-helper';

interface EventParameters {
  readonly databaseName: string;
  readonly operation: string;
  readonly secretArn: string;
}

export async function handler(event: EventParameters): Promise<string | null> {
  console.log(`event is ${JSON.stringify(event)}`);

  try {
    const secretArn = event.secretArn;

    // Check that all required parameters are present
    if (!secretArn) {
      throw new Error('Secret ARN is required in the event');
    }

    if (!event.operation) {
      throw new Error('Operation is required in the event');
    }

    if (!event.databaseName) {
      throw new Error('Database name is required in the event');
    }
    if (!event.operation) {
      throw new Error('Operation is required');
    }

    console.log(`starting function: secretArn is ${secretArn}`);
    const secret = await getSecret(secretArn);

    if (secret !== null) {
      console.log('Secret:', secret);

      if (
        !checkSecretKeys(secret, ['username', 'password', 'endpoint', 'port'])
      ) {
        console.log('Secret keys are present');
      }
      const {Client} = require('pg');

      // Validate the secret, ensure it has the keys required to connect to the database
      try {
        if (secret.port === null || secret.port === undefined) {
          console.error(
            `Port is required in secret ${secretArn}. No such key was found.`
          );
        }

        if (secret.endpoint === null || secret.endpoint === undefined) {
          console.error(
            `endpoint is required in secret ${secretArn}. No such key was found.`
          );
        }

        if (secret.username === null || secret.username === undefined) {
          console.error(
            `username is required in secret ${secretArn}. No such key was found.`
          );
        }

        if (secret.password === null || secret.password === undefined) {
          console.error(
            `password is required in secret ${secretArn}. No such key was found.`
          );
        }
      } catch (error) {
        console.error(`Secret ${secretArn} is missing required keys. ${error}`);
        throw new Error(
          `Secret ${secretArn} is missing required keys. ${error}`
        );
      }

      // Create a new client
      const client = new Client({
        user: secret.username,
        host: secret.endpoint,
        database: event.databaseName,
        password: secret.password,
        port: secret.port,
        ssl: {
          rejectUnauthorized: true,
        },
      });

      // Connect to the database
      await client.connect();
      console.log('Connected to the database');
      // Perform the operation
      let result = 'Operation not supported';
      if (event.operation === 'SELECT') {
        try {
          const res = await client.query(
            'SELECT CURRENT_DATE AS "currentDate"'
          );
          if (res.rows.length > 0) {
            result = res.rows[0].currentDate;
            console.log(`date is ${res.rows}`);
          } else {
            result = 'No date returned';
          }
        } catch (error) {
          console.error('Query failed:', error);
          result = 'Query execution failed';
        }
      }

      // Close the connection
      await client.end();

      console.log(`result is ${result}`);
      return result;
    }
    return null;
  } catch (err) {
    console.error('Error:', err);
    throw err; // Rethrow the error for Lambda to catch
  }
}
