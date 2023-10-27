export const MONGODB_URI = () => {
  const URI_OBJECT = {
    MONGODB_URI:
      'mongodb://' +
      process.env.MONGO_INITDB_ROOT_USERNAME +
      ':' +
      process.env.MONGO_INITDB_ROOT_PASSWORD +
      '@' +
      process.env.MONGODB_PRIMARY_NAME +
      ':' +
      process.env.MONGODB_PORT +
      '/',
  };
  console.log(URI_OBJECT);
  return URI_OBJECT;
};
