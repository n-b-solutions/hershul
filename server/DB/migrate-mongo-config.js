module.exports = {
  mongodb: {
    url: "mongodb://127.0.0.1:27017",
    databaseName: "hershul",
    options: {
      // ניתן להשאיר את האפשרויות הבסיסיות
    }
  },
  migrationsDir: "migrations", // התיקייה שבה מאוחסנות המיגרציות
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'commonjs',
};


