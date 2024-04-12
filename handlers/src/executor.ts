import pg from 'pg';
import {getSecret} from './secrets-helper';

interface EventParameters {
  readonly databaseName?: string;
  readonly engine?: string;
  readonly operation?: string;
  readonly secretArn?: string;
}

export async function handler(event: EventParameters): Promise<string> {
  console.log(`event is ${JSON.stringify(event)}`);

  try {

    const secretArn = event.secretArn;
    if (!secretArn) {
      throw new Error('Secret ARN is required');
    }

    console.log(`starting function: secretArn is ${secretArn}`);
    const secret = await getSecret(secretArn);

    console.log('Secret:', secret);
    const { Client } = require('pg');

    // Create a new client
    const client = new Client({
      user: secret.username,
      host: secret.endpoint,
      database: 'postgres',
      password: secret.password,
      port: secret.port,
    });

    // Connect to the database
    await client.connect();

    // Perform the operation
    let result = 'Operation not supported';
    if (event.operation === 'SELECT') {
      const res = await client.query('SELECT $1::text as message', [
        'Hello world!',
      ]);
      result = res.rows[0].message;
    }

    // Close the connection
    await client.end();

    console.log(`result is ${result}`);
    return result;
  } catch (err) {
    console.error('Error:', err);
    throw err; // Rethrow the error for Lambda to catch
  }
}
