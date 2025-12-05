-- Create keyspace
CREATE KEYSPACE IF NOT EXISTS realtime
WITH REPLICATION = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
};

-- Use the keyspace
USE realtime;

-- Create users table
-- Using TEXT for id to match producer output (UUID as string)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    ts TIMESTAMP
);

-- Create index on email for faster lookups (optional)
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

