import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

if (env !== 'development') {
  console.error('This script can only be run in the development environment');
  process.exit(1);
}

console.log('Dropping database...');

const uri = process.env.VITE_MONGO_URI;
const dbName = process.env.VITE_MONGO_DB_NAME;

if (!uri || !dbName) {
  console.error('Missing MongoDB URI or Database Name in environment variables');
  process.exit(1);
}

async function dropDatabase() {
  const client = new MongoClient(uri!);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collections = await db.collections();

    if (collections.length === 0) {
      console.log('No collections found in the database');
    } else {
      for (const collection of collections) {
        await collection.drop();
        console.log(`Dropped collection: ${collection.collectionName}`);
      }
      console.log('All collections dropped');
    }
  } catch (error) {
    console.error('Error dropping collections:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

dropDatabase();