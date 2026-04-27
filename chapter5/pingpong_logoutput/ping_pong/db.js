const { Pool } = require("pg")

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
})

const initializeDb = async () => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    await client.query(`
      CREATE TABLE IF NOT EXISTS counter (
        id INT PRIMARY KEY,
        value INT NOT NULL DEFAULT 0
      )
    `)

    await client.query(`
      INSERT INTO counter (id, value)
      VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING
    `)

    await client.query("COMMIT")
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}

const getCounterValue = async () => {
  const result = await pool.query("SELECT value FROM counter")
  return result.rows[0].value
}

const incrementCounterValue = async () => {
  const result = await pool.query(`
    UPDATE counter
    SET value = value + 1
    RETURNING value
    `)
  return result.rows[0].value
}

module.exports = { incrementCounterValue, initializeDb, getCounterValue, pool }
