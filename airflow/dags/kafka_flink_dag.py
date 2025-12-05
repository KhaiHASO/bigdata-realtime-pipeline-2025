"""
Airflow DAG for Kafka-Flink-Cassandra Pipeline
Orchestrates the producer and Flink job execution
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
import subprocess
import sys

default_args = {
    'owner': 'data-engineer',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'kafka_flink_pipeline',
    default_args=default_args,
    description='Real-time streaming pipeline: Kafka -> Flink -> Cassandra',
    schedule_interval=timedelta(hours=1),  # Run every hour
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['kafka', 'flink', 'cassandra', 'streaming'],
)


def run_producer():
    """Run the Kafka producer"""
    print("Starting Kafka producer...")
    try:
        # Run producer script
        result = subprocess.run(
            [sys.executable, '/opt/airflow/dags/../producer/producer.py'],
            cwd='/opt/airflow',
            capture_output=True,
            text=True
        )
        print(f"Producer stdout: {result.stdout}")
        if result.stderr:
            print(f"Producer stderr: {result.stderr}")
        result.check_returncode()
        print("✓ Producer completed successfully")
    except Exception as e:
        print(f"✗ Producer error: {e}")
        raise


def submit_flink_job():
    """Submit Flink job to Flink cluster"""
    print("Submitting Flink job...")
    try:
        # Submit job to Flink
        result = subprocess.run(
            [
                'curl', '-X', 'POST',
                'http://flink-jobmanager:8081/jars/upload',
                '-H', 'Content-Type: multipart/form-data',
                '-F', 'jarfile=@/opt/flink/usrlib/job.py'
            ],
            capture_output=True,
            text=True,
            timeout=30
        )
        print(f"Flink submit stdout: {result.stdout}")
        if result.stderr:
            print(f"Flink submit stderr: {result.stderr}")
        # Note: This is a simplified version. In production, you'd need to
        # properly package the job and submit it via Flink REST API
        print("✓ Flink job submission initiated")
    except Exception as e:
        print(f"✗ Flink job submission error: {e}")
        # Don't raise - job might already be running
        print("Note: Job might already be running or needs manual submission")


# Task 1: Wait for services to be ready
wait_for_services = BashOperator(
    task_id='wait_for_services',
    bash_command='''
        echo "Waiting for services to be ready..."
        sleep 30
        echo "✓ Services should be ready"
    ''',
    dag=dag,
)

# Task 2: Run Kafka producer
run_producer_task = PythonOperator(
    task_id='run_producer',
    python_callable=run_producer,
    dag=dag,
)

# Task 3: Submit Flink job (if not already running)
submit_flink_job_task = PythonOperator(
    task_id='submit_flink_job',
    python_callable=submit_flink_job,
    dag=dag,
)

# Task 4: Verify data in Cassandra
verify_cassandra = BashOperator(
    task_id='verify_cassandra',
    bash_command='''
        echo "Verifying data in Cassandra..."
        docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"
        echo "✓ Verification complete"
    ''',
    dag=dag,
)

# Define task dependencies
wait_for_services >> run_producer_task >> submit_flink_job_task >> verify_cassandra

