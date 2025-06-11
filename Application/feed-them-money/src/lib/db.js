import mysql from 'mysql2/promise';

export async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,      // update as needed
    port: process.env.DB_PORT,                  // update as needed
    user: process.env.DB_USER,      // update as needed
    password: process.env.DB_PASSWORD,  // update as needed
    database: process.env.DB_SCHEMA,    // update as needed
  });
  const [results] = await connection.execute(sql, params);
  await connection.end();
  return results;
}