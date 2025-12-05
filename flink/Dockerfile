FROM flink:1.17.1-scala_2.12

# Install Python and pip
USER root
RUN apt-get update && \
    apt-get install -y python3 python3-pip curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Download Kafka connector JAR if not present
RUN if [ ! -f /opt/flink/lib/flink-sql-connector-kafka-3.0.1-1.17.jar ]; then \
        curl -o /opt/flink/lib/flink-sql-connector-kafka-3.0.1-1.17.jar \
        https://repo.maven.apache.org/maven2/org/apache/flink/flink-sql-connector-kafka/3.0.1-1.17/flink-sql-connector-kafka-3.0.1-1.17.jar; \
    fi

# Install PyFlink and dependencies
RUN pip3 install apache-flink==1.17.1 cassandra-driver==3.28.0

# Copy job file
COPY job.py /opt/flink/usrlib/job.py

# Set working directory
WORKDIR /opt/flink

# Switch back to flink user
USER flink

