import {getSecret} from './secrets-helper';

interface EventParameters {
  readonly databaseName?: string;
  readonly engine?: string;
  readonly operation?: string;
  readonly secretArn?: string;
}

export async function handler(event: EventParameters): Promise<string | null> {
  console.log(`event is ${JSON.stringify(event)}`);

  try {
    const secretArn = event.secretArn;
    if (!secretArn) {
      throw new Error('Secret ARN is required');
    }

    console.log(`starting function: secretArn is ${secretArn}`);
    const secret = await getSecret(secretArn);

    if (secret !== null) {
      console.log('Secret:', secret);

      if (!secret.username) {
        throw new Error(
          `username is required in secret ${secretArn}. No such key was found.`
        );
      }
      if (!secret.password) {
        throw new Error(
          `password is required in secret ${secretArn}. No such key was found.`
        );
      }
      if (!secret.endpoint) {
        throw new Error(
          `endpoint is required in secret ${secretArn}. No such key was found.`
        );
      }
      if (!secret.port) {
        throw new Error(
          `port is required in secret ${secretArn}. No such key was found.`
        );
      }

      const {Client} = require('pg');

      // Create a new client
      const client = new Client({
        user: secret.username,
        host: secret.endpoint,
        database: 'postgres',
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
