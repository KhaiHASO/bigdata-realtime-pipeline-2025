# Real-Time Streaming Pipeline: Kafka → Flink → Cassandra

A complete real-time streaming data pipeline using Kafka, Apache Flink, and Cassandra, orchestrated with Docker Compose.

## Architecture

```
API Producer → Kafka → Flink Streaming Job → Cassandra
```

**Optional:** Airflow DAG for orchestration

## Project Structure

```
project/
├── docker-compose.yml          # Docker Compose configuration
├── producer/
│   ├── producer.py             # Kafka producer script
│   └── requirements.txt        # Python dependencies
├── flink/
│   ├── job.py                  # Flink streaming job
│   └── Dockerfile              # Flink image with PyFlink
├── cassandra/
│   └── init.cql                # Cassandra initialization script
├── airflow/
│   ├── Dockerfile              # Airflow image
│   └── dags/
│       └── kafka_flink_dag.py  # Airflow DAG
└── README.md                   # This file
```

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Python 3.8+ (for running producer locally, optional)

## Quick Start

### 1. Start All Services

Start all services using Docker Compose:

```bash
docker compose up -d
```

This will start:
- **Zookeeper** (port 2181)
- **Kafka** (port 9092)
- **Flink JobManager** (port 8081)
- **Flink TaskManager**
- **Cassandra** (port 9042)
- **MySQL** (port 3306) - Database for Airflow
- **Airflow Webserver** (port 8080)
- **Airflow Scheduler**

Wait for all services to be ready (about 60-90 seconds):

```bash
docker compose ps
```

Check logs if needed:

```bash
docker compose logs -f
```

### 2. Verify Services

#### Check Kafka
```bash
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list
```

#### Check Cassandra
```bash
docker exec cassandra cqlsh -e "DESCRIBE KEYSPACE realtime;"
```

#### Check Flink UI
Open your browser and navigate to:
```
http://localhost:8081
```

You should see the Flink Web UI dashboard.

#### Check MySQL
```bash
docker exec mysql mysql -u airflow -pairflow -e "SHOW DATABASES;"
```

#### Check Airflow UI (Optional)
Open your browser and navigate to:
```
http://localhost:8080
```

**Note:** Airflow uses MySQL database and will automatically initialize the database schema and create an admin user on first startup. This may take 60-90 seconds.

Default credentials (auto-created):
- Username: `admin`
- Password: `admin`

If you need to check Airflow logs:
```bash
docker compose logs -f airflow-webserver
```

**Important:** Before starting Airflow for the first time or after changes, run:
```bash
docker compose down -v
docker compose up -d --build
```

**Troubleshooting Airflow:**
- If Airflow UI doesn't load, wait 60-90 seconds for MySQL initialization and database migration
- Check MySQL is ready: `docker compose logs mysql`
- Check Airflow logs: `docker compose logs airflow-webserver`
- Verify containers are running: `docker compose ps`
- Verify Airflow connected to MySQL: Look for "Connected to MySQL" in logs
- If issues persist, restart: `docker compose restart airflow-webserver airflow-scheduler`

### 3. Initialize Cassandra

Wait for Cassandra to be ready (about 30-60 seconds), then initialize the keyspace and table:

```bash
# Wait for Cassandra to be ready
docker exec cassandra cqlsh -e "SELECT now() FROM system.local;" || sleep 10

# Initialize keyspace and table
docker exec cassandra cqlsh -f /init.cql
```

Or use the helper script:

```bash
bash scripts/init-cassandra.sh
```

Verify initialization:

```bash
docker exec cassandra cqlsh -e "DESCRIBE KEYSPACE realtime;"
```

### 4. Create Kafka Topic

Create the `users` topic if it doesn't exist:

```bash
docker exec kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --topic users \
  --partitions 1 \
  --replication-factor 1
```

Verify the topic was created:

```bash
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list
```

### 5. Run the Producer

#### Option A: Run Producer Locally (Recommended)

First, install dependencies:

```bash
cd producer
pip install -r requirements.txt
```

Then run the producer:

```bash
python producer.py
```

The producer will generate random user data and send it to the Kafka topic `users`.

#### Option B: Run Producer in Docker

```bash
docker run --rm --network bigdata-realtime-pipeline-2025_pipeline-network \
  -v $(pwd)/producer:/app \
  -w /app \
  python:3.9-slim \
  sh -c "pip install -r requirements.txt && python producer.py"
```

### 6. Submit Flink Job

#### Option A: Submit via Flink Web UI

1. Open Flink Web UI: http://localhost:8081
2. Go to "Submit New Job"
3. Upload the job file or use the REST API

#### Option B: Submit via REST API

```bash
# First, upload the job JAR (if packaged)
curl -X POST http://localhost:8081/jars/upload \
  -H "Content-Type: multipart/form-data" \
  -F "jarfile=@flink/job.py"

# Then submit the job
# Note: For PyFlink jobs, you may need to use the Flink CLI
```

#### Option C: Submit via Flink CLI (Inside Container)

```bash
docker exec -it flink-jobmanager /opt/flink/bin/flink run \
  -py /opt/flink/usrlib/job.py
```

#### Option D: Run Job Directly (For Testing)

```bash
docker exec -it flink-taskmanager python3 /opt/flink/usrlib/job.py
```

### 7. Verify Data in Cassandra

Connect to Cassandra using `cqlsh`:

```bash
docker exec -it cassandra cqlsh
```

Then run the following CQL commands:

```cql
USE realtime;

-- Check table structure
DESCRIBE TABLE users;

-- Count records
SELECT COUNT(*) FROM users;

-- View sample records
SELECT * FROM users LIMIT 10;

-- Query by email (using index)
SELECT * FROM users WHERE email = 'alice.smith@example.com';
```

Or run a quick check from command line:

```bash
docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"
```

## Step-by-Step Instructions

### Starting the System

1. **Navigate to project directory:**
   ```bash
   cd /path/to/bigdata-realtime-pipeline-2025
   ```

2. **Start all services:**
   ```bash
   docker compose up -d
   ```

3. **Wait for services to be ready:**
   ```bash
   # Check service status
   docker compose ps
   
   # Check logs
   docker compose logs -f
   ```

4. **Verify all services are running:**
   - Zookeeper: `docker exec zookeeper echo ruok | nc localhost 2181`
   - Kafka: `docker exec kafka kafka-broker-api-versions --bootstrap-server localhost:9092`
   - Cassandra: `docker exec cassandra nodetool status`
   - Flink: Open http://localhost:8081

### Opening Flink UI

1. Open your web browser
2. Navigate to: **http://localhost:8081**
3. You should see the Flink Web UI with:
   - Running jobs
   - Task managers
   - Job metrics
   - Logs

### Opening Kafka UI (Optional)

If you want a Kafka UI, you can add Kafka UI to docker-compose.yml or use:

```bash
docker run -d \
  --name kafka-ui \
  -p 8082:8080 \
  --network bigdata-realtime-pipeline-2025_pipeline-network \
  -e KAFKA_CLUSTERS_0_NAME=local \
  -e KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:29092 \
  provectuslabs/kafka-ui:latest
```

Then access it at: **http://localhost:8082**

### Running the Producer

1. **Install dependencies:**
   ```bash
   cd producer
   pip install -r requirements.txt
   ```

2. **Run the producer:**
   ```bash
   python producer.py
   ```

3. **The producer will:**
   - Connect to Kafka at `localhost:9092`
   - Generate random user data (id, name, email, timestamp)
   - Send messages to the `users` topic
   - Display progress and confirmation

### Submitting Flink Job

**Method 1: Using Flink CLI (Recommended)**

```bash
# Execute inside Flink container
docker exec -it flink-jobmanager /opt/flink/bin/flink run \
  -py /opt/flink/usrlib/job.py
```

**Method 2: Using Flink Web UI**

1. Go to http://localhost:8081
2. Click "Submit New Job"
3. Upload your job file or use the REST API

**Method 3: Direct Python Execution (For Testing)**

```bash
docker exec -it flink-taskmanager python3 /opt/flink/usrlib/job.py
```

### Verifying Data in Cassandra

**Using cqlsh:**

```bash
# Connect to Cassandra
docker exec -it cassandra cqlsh

# Inside cqlsh:
USE realtime;
SELECT COUNT(*) FROM users;
SELECT * FROM users LIMIT 10;
```

**Using command line:**

```bash
# Quick count
docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"

# View records
docker exec cassandra cqlsh -e "SELECT * FROM realtime.users LIMIT 10;"
```

## Monitoring

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f kafka
docker compose logs -f flink-jobmanager
docker compose logs -f cassandra
```

### Check Service Health

```bash
# Kafka
docker exec kafka kafka-broker-api-versions --bootstrap-server localhost:9092

# Cassandra
docker exec cassandra nodetool status

# Flink
curl http://localhost:8081/overview
```

## Troubleshooting

### Kafka Connection Issues

If the producer can't connect to Kafka:

1. Check if Kafka is running: `docker compose ps`
2. Verify Kafka is accessible: `docker exec kafka kafka-broker-api-versions --bootstrap-server localhost:9092`
3. Check Kafka logs: `docker compose logs kafka`

### Flink Job Not Starting

1. Check Flink logs: `docker compose logs flink-jobmanager`
2. Verify Kafka connector JAR is present
3. Check if job file is accessible: `docker exec flink-taskmanager ls -la /opt/flink/usrlib/`

### Cassandra Connection Issues

1. Wait for Cassandra to fully start (can take 30-60 seconds)
2. Check Cassandra logs: `docker compose logs cassandra`
3. Verify keyspace exists: `docker exec cassandra cqlsh -e "DESCRIBE KEYSPACE realtime;"`

### Airflow UI Not Accessible

If you cannot access http://localhost:8080:

1. **Wait for initialization:** Airflow needs 60-90 seconds to connect to MySQL and migrate database on first startup
   ```bash
   # Check if containers are running
   docker compose ps
   
   # Check MySQL is ready
   docker compose logs mysql
   
   # Check logs for initialization progress
   docker compose logs -f airflow-webserver
   ```

2. **Verify MySQL is accessible:**
   ```bash
   # Test MySQL connection
   docker exec mysql mysql -u airflow -pairflow -e "SELECT 1;"
   
   # Check if database exists
   docker exec mysql mysql -u airflow -pairflow -e "SHOW DATABASES;"
   ```

3. **Check if database migration completed:**
   ```bash
   # Look for "Running migration" or "Database migration done" in logs
   docker compose logs airflow-webserver | grep -i "migrate"
   
   # Check for MySQL connection errors
   docker compose logs airflow-webserver | grep -i "mysql\|error"
   ```

4. **Verify port is not in use:**
   ```bash
   # Check if port 8080 is available
   sudo lsof -i :8080
   # or
   netstat -tulpn | grep 8080
   ```

5. **Restart services:**
   ```bash
   docker compose restart airflow-webserver airflow-scheduler mysql
   ```

6. **Rebuild and restart (recommended after changes):**
   ```bash
   docker compose down -v
   docker compose up -d --build
   ```

7. **Manual database migration (if automatic fails):**
   ```bash
   # Stop services
   docker compose stop airflow-webserver airflow-scheduler
   
   # Wait for MySQL to be ready
   docker compose up -d mysql
   sleep 30
   
   # Run database migration manually
   docker compose run --rm airflow-webserver airflow db migrate
   
   # Create admin user
   docker compose run --rm airflow-webserver airflow users create \
     --username admin \
     --firstname Admin \
     --lastname User \
     --role Admin \
     --email admin@example.com \
     --password admin
   
   # Start services
   docker compose up -d airflow-webserver airflow-scheduler
   ```

8. **Check MySQL connection string:**
   ```bash
   # Verify environment variable is set correctly
   docker exec airflow-webserver env | grep SQL_ALCHEMY_CONN
   # Should show: AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=mysql+mysqldb://airflow:airflow@mysql:3306/airflow
   ```

**Default Credentials:**
- Username: `admin`
- Password: `admin`

**MySQL Credentials:**
- User: `airflow`
- Password: `airflow`
- Root Password: `airflow`
- Database: `airflow`

### Data Not Appearing in Cassandra

1. Verify Flink job is running: Check Flink UI at http://localhost:8081
2. Check Flink logs for errors
3. Verify Kafka has messages: `docker exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic users --from-beginning`
4. Check Cassandra table: `docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"`

## Stopping the System

```bash
# Stop all services
docker compose down

# Stop and remove volumes (WARNING: This deletes all data including MySQL database)
docker compose down -v
```

**Note:** After running `docker compose down -v`, you need to rebuild and restart:
```bash
docker compose up -d --build
```

## Configuration

### Kafka Configuration

- Bootstrap servers: `localhost:9092` (external), `kafka:29092` (internal)
- Topic: `users`
- Replication factor: 1 (for development)

### Flink Configuration

- JobManager: http://localhost:8081
- Parallelism: 1 (default)
- Task slots: 2 per TaskManager

### Cassandra Configuration

- Host: `cassandra` (internal), `localhost` (external)
- Port: 9042
- Keyspace: `realtime`
- Table: `users`

### Airflow Configuration

- Webserver: http://localhost:8080
- Executor: LocalExecutor
- Database: MySQL 8.0
  - Host: `mysql` (internal), `localhost` (external)
  - Port: 3306
  - Database: `airflow`
  - User: `airflow` / Password: `airflow`
  - Root password: `airflow`
- Default credentials: `admin` / `admin`
- DAGs location: `./airflow/dags`
- Auto-initialization: Enabled (database migration and admin user created automatically)
- Connection string: `mysql+mysqldb://airflow:airflow@mysql:3306/airflow`

## Production Considerations

For production deployments, consider:

1. **Kafka:**
   - Increase replication factor
   - Add more partitions
   - Enable authentication/authorization

2. **Flink:**
   - Increase parallelism
   - Configure checkpointing
   - Set up high availability

3. **Cassandra:**
   - Multi-node cluster
   - Proper replication strategy
   - Backup and recovery

4. **Security:**
   - Enable SSL/TLS
   - Add authentication
   - Network isolation

## License

This project is provided as-is for educational and development purposes.

