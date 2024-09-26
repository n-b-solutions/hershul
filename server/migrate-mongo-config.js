require('dotenv').config()

const mongo_uri=process.env.VITE_MONGO_URI
const db_name= process.env.VITE_MONGO_DB_NAME

module.exports = {
  mongodb: {
    url: mongo_uri,
    databaseName: db_name,
    options: {
    }
  },
  migrationsDir: "DB/migrations", 
  changelogCollectionName: "changelog",
  migrationFileExtension: ".ts",
  useFileHash: false,
  moduleSystem: 'commonjs',
};


