"""
Flink Streaming Job
Reads from Kafka topic 'users', processes messages, and writes to Cassandra table 'users'
Uses Table API with custom Cassandra sink function
"""

from pyflink.datastream import StreamExecutionEnvironment
from pyflink.table import StreamTableEnvironment
from pyflink.datastream.functions import SinkFunction, RuntimeContext
from pyflink.common.typeinfo import Types
from pyflink.datastream.formats.json import JsonRowDeserializationSchema
from pyflink.common import Row
import json
from datetime import datetime
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider


class CassandraSink(SinkFunction):
    """Custom Cassandra Sink for Flink"""
    
    def __init__(self, host='cassandra', port=9042, keyspace='realtime', table='users'):
        self.host = host
        self.port = port
        self.keyspace = keyspace
        self.table = table
        self.cluster = None
        self.session = None
    
    def open(self, runtime_context: RuntimeContext):
        """Initialize Cassandra connection"""
        try:
            self.cluster = Cluster([self.host], port=self.port)
            self.session = self.cluster.connect(self.keyspace)
            print(f"✓ Connected to Cassandra at {self.host}:{self.port}")
        except Exception as e:
            print(f"✗ Failed to connect to Cassandra: {e}")
            raise
    
    def invoke(self, value, context=None):
        """Write record to Cassandra"""
        try:
            # Parse JSON value
            if isinstance(value, str):
                data = json.loads(value)
            elif isinstance(value, Row):
                # Convert Row to dict
                data = {
                    'id': value[0] if len(value) > 0 else '',
                    'name': value[1] if len(value) > 1 else '',
                    'email': value[2] if len(value) > 2 else '',
                    'timestamp': value[3] if len(value) > 3 else ''
                }
            else:
                data = value
            
            # Prepare CQL insert statement
            cql = f"""
                INSERT INTO {self.table} (id, name, email, ts)
                VALUES (?, ?, ?, ?)
            """
            
            # Parse timestamp
            timestamp_str = data.get('timestamp', '')
            if timestamp_str:
                try:
                    # Parse ISO format timestamp
                    if timestamp_str.endswith('Z'):
                        ts = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
                    else:
                        ts = datetime.fromisoformat(timestamp_str)
                except:
                    ts = datetime.utcnow()
            else:
                ts = datetime.utcnow()
            
            # Execute insert
            self.session.execute(
                cql,
                (data['id'], data['name'], data['email'], ts)
            )
            
        except Exception as e:
            print(f"✗ Error writing to Cassandra: {e}")
            import traceback
            traceback.print_exc()
            # Don't raise to avoid stopping the stream
    
    def close(self):
        """Close Cassandra connection"""
        if self.session:
            self.session.shutdown()
        if self.cluster:
            self.cluster.shutdown()
        print("✓ Closed Cassandra connection")


def create_kafka_source_stream(env):
    """Create Kafka source stream using Table API"""
    table_env = StreamTableEnvironment.create(env)
    
    # Create Kafka source table
    table_env.execute_sql("""
        CREATE TABLE kafka_users_source (
            id STRING,
            name STRING,
            email STRING,
            `timestamp` STRING
        ) WITH (
            'connector' = 'kafka',
            'topic' = 'users',
            'properties.bootstrap.servers' = 'kafka:29092',
            'properties.group.id' = 'flink-users-consumer',
            'format' = 'json',
            'scan.startup.mode' = 'earliest-offset'
        )
    """)
    print("✓ Created Kafka source table")
    
    # Convert table to stream
    table = table_env.from_path("kafka_users_source")
    stream = table_env.to_data_stream(table)
    
    return stream


def main():
    """Main function"""
    print("=" * 60)
    print("Flink Streaming Job: Kafka -> Cassandra")
    print("=" * 60)
    
    # Create execution environment
    env = StreamExecutionEnvironment.get_execution_environment()
    env.set_parallelism(1)
    
    # Add Flink Kafka connector JAR
    env.add_jars("file:///opt/flink/lib/flink-sql-connector-kafka-3.0.1-1.17.jar")
    
    try:
        # Create Kafka source stream
        stream = create_kafka_source_stream(env)
        
        # Add Cassandra sink
        cassandra_sink = CassandraSink(
            host='cassandra',
            port=9042,
            keyspace='realtime',
            table='users'
        )
        
        stream.add_sink(cassandra_sink)
        print("✓ Added Cassandra sink")
        
        # Execute the job
        print("\n🚀 Starting Flink job execution...")
        print("   Reading from Kafka topic 'users' -> Writing to Cassandra table 'users'")
        env.execute("Kafka to Cassandra Streaming Job")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        raise


if __name__ == '__main__':
    main()

