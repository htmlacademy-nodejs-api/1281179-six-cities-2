export function getMongoDBURI (
  username: string,
  password: string,
  host: string,
  port: string,
  databasename: string,
) {
  return `mongodb://${username}:${password}@${host}:${port}/${databasename}?authSource=admin`;
}
