# Legacy Pipeline - Summary

## Overview

This folder contains the original Big Data Real-Time Pipeline implementation using actual infrastructure components: Kafka, Flink, Cassandra, and Airflow.

## What Components Existed

### Infrastructure Services
- **Zookeeper** (Confluent 7.4.0) - Coordination service for Kafka
- **Kafka** (Confluent 7.4.0) - Message broker for streaming data
- **Apache Flink** (1.17.1) - Stream processing engine (replaced Spark)
- **Cassandra** (4.1) - NoSQL database for storing processed data
- **MySQL** (8.0) - Database for Airflow metadata
- **Airflow** (2.7.0) - Workflow orchestration tool

### Application Components
- **Python Producer** (`producer/producer.py`) - Generates random user data and sends to Kafka
- **Flink Streaming Job** (`flink/job.py`) - Reads from Kafka, processes data, writes to Cassandra
- **Airflow DAG** (`airflow/dags/kafka_flink_dag.py`) - Orchestrates the pipeline
- **Cassandra Schema** (`cassandra/init.cql`) - Database initialization

### Demo Scripts
- `demo-01.sh` through `demo-07.sh` - Automated demo scenarios
- `README-demo-*.md` - Detailed documentation for each demo

## What the Pipeline Attempted to Do

The pipeline implemented a complete real-time data processing workflow:

```
API Producer → Kafka → Flink Streaming Job → Cassandra
```

**Flow:**
1. Producer generates random user data (id, name, email, timestamp)
2. Data is sent to Kafka topic "users"
3. Flink job reads from Kafka, processes JSON messages
4. Processed data is written to Cassandra table "users"
5. Airflow orchestrates the entire workflow

## Why the New FE-Based Simulation is Simpler for Demo

### Challenges with Legacy Approach:
1. **Complex Setup**: Requires Docker, multiple services, network configuration
2. **Resource Intensive**: Needs significant CPU/RAM to run all containers
3. **Time Consuming**: Services take 60-90 seconds to start
4. **Dependency Issues**: Python venv, package conflicts, system requirements
5. **Hard to Demo**: Requires understanding of Docker, terminal commands
6. **Not Portable**: Difficult to show in presentations or share

### Benefits of Frontend Simulation:
1. **Zero Setup**: Just `npm install` and `npm run dev`
2. **Lightweight**: Runs entirely in browser, no backend needed
3. **Instant Start**: No waiting for services to boot
4. **Visual**: Beautiful UI that's easy to understand
5. **Portable**: Can be deployed anywhere (Vercel, Netlify, GitHub Pages)
6. **Educational**: Shows pipeline concepts without infrastructure complexity
7. **Interactive**: Users can click buttons, see real-time updates
8. **No Dependencies**: No Docker, no Python, no database setup

## Architecture Comparison

### Legacy (Actual Infrastructure)
```
┌─────────┐     ┌──────┐     ┌──────┐     ┌──────────┐
│ Producer│────▶│Kafka │────▶│Flink │────▶│Cassandra │
└─────────┘     └──────┘     └──────┘     └──────────┘
     │              │            │              │
     │              │            │              │
  Python        Docker       Docker         Docker
```

### New (Frontend Simulation)
```
┌─────────────────────────────────────────────────┐
│         React Frontend Application              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Kafka UI │  │Spark UI  │  │MongoDB UI│     │
│  │  (Fake)  │  │  (Fake)  │  │  (Fake)  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│         │            │            │           │
│         └────────────┴────────────┘           │
│              Fake Data Service                 │
└─────────────────────────────────────────────────┘
```

## Key Differences

| Aspect | Legacy | New Frontend |
|--------|--------|--------------|
| Setup Time | 5-10 minutes | 30 seconds |
| Dependencies | Docker, Python, Java | Node.js only |
| Resource Usage | High (multiple containers) | Low (browser only) |
| Portability | Requires Docker | Works anywhere |
| Learning Curve | Steep (infrastructure) | Gentle (UI focused) |
| Demo Value | Shows real tech | Shows concepts clearly |
| Maintenance | Complex | Simple |

## When to Use Each

**Use Legacy Pipeline:**
- Learning actual infrastructure
- Testing real performance
- Production development
- Understanding system internals

**Use Frontend Simulation:**
- Presentations and demos
- Teaching concepts
- Quick prototyping
- Client demonstrations
- Portfolio projects

## Files in This Folder

- `docker-compose.yml` - All service definitions
- `producer/` - Kafka producer scripts
- `flink/` - Flink streaming job
- `cassandra/` - Database schema
- `airflow/` - Orchestration DAGs
- `demo-*.sh` - Demo scripts
- `README.md` - Original documentation
- `DEMO.md` - Demo scenarios

## Note

This legacy code is kept for reference only. The new frontend simulation in `/pipeline-simulator-fe` provides a simpler, more accessible way to demonstrate the same concepts.

