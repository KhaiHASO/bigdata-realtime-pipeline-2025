FROM apache/airflow:2.7.0

USER root

# Install additional dependencies
RUN apt-get update && \
    apt-get install -y gcc python3-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER airflow

# Install Python packages
RUN pip install --no-cache-dir \
    kafka-python==2.0.2 \
    apache-airflow-providers-apache-flink==1.0.0

