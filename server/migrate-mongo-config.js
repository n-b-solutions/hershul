require("dotenv").config();

const mongo_uri = process.env.VITE_MONGO_URI;
const db_name = process.env.VITE_MONGO_DB_NAME;

module.exports = {
  mongodb: {
    url: "mongodb://127.0.0.1:27017",
    databaseName: "hershul",
    options: {},
  },
  migrationsDir: "DB/migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".ts",
  useFileHash: false,
  moduleSystem: "commonjs",
};
