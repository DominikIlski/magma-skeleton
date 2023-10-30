export const MONGODB_URI = () => {
  const URI_OBJECT = {
    MONGODB_URI:
      'mongodb://' +
      process.env.MONGO_INITDB_ROOT_USERNAME +
      ':' +
      process.env.MONGO_INITDB_ROOT_PASSWORD +
      '@' +
      [
        process.env.MONGODB_PRIMARY_NAME,
        process.env.MONGODB_SECONDARY_NAME,
        process.env.MONGODB_ARBITER_NAME,
      ]
        .map((dbName) => `${dbName}:${process.env.MONGODB_PORT}`)
        .join(',') +
      '/' +
      '?replicaSet=' +
      process.env.MONGODB_REPLICA_SET_KEY,
  };
  return URI_OBJECT;
};
