#!/bin/bash
# Script to initialize Cassandra keyspace and table
# Run this after Cassandra is up and running

echo "Waiting for Cassandra to be ready..."
sleep 30

echo "Initializing Cassandra keyspace and table..."
docker exec cassandra cqlsh -f /init.cql

echo "✓ Cassandra initialization complete!"
echo "Verifying..."
docker exec cassandra cqlsh -e "DESCRIBE KEYSPACE realtime;"

