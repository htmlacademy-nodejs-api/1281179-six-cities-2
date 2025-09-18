export function getMongoDBURI (
  username: string,
  password: string,
  host: string,
  port: number,
  databaseName: string,
) {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
}
