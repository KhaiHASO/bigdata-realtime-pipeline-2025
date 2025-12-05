FROM apache/airflow:2.7.0

USER root

# Install additional dependencies including MySQL client libraries
RUN apt-get update && \
    apt-get install -y default-libmysqlclient-dev gcc python3-dev curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER airflow

# Install Python packages including mysqlclient
RUN pip install --no-cache-dir \
    mysqlclient \
    kafka-python==2.0.2 \
    apache-airflow-providers-apache-flink==1.0.0

