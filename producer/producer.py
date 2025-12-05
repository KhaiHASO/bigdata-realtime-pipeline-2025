#!/usr/bin/env python3
"""
Kafka Producer for User Data
Generates random user objects and pushes them to Kafka topic 'users'
"""

import json
import time
import random
import uuid
from datetime import datetime
from kafka import KafkaProducer
from kafka.errors import KafkaError

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS = ['localhost:9092']
TOPIC_NAME = 'users'

# Sample data for generating random users
FIRST_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
               'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rachel', 'Sam', 'Tina']
LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
              'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee']
DOMAINS = ['example.com', 'test.com', 'demo.org', 'sample.net', 'mail.io']


def generate_user():
    """Generate a random user object"""
    user_id = str(uuid.uuid4())
    first_name = random.choice(FIRST_NAMES)
    last_name = random.choice(LAST_NAMES)
    name = f"{first_name} {last_name}"
    email = f"{first_name.lower()}.{last_name.lower()}@{random.choice(DOMAINS)}"
    timestamp = datetime.utcnow().isoformat() + 'Z'
    
    return {
        'id': user_id,
        'name': name,
        'email': email,
        'timestamp': timestamp
    }


def create_producer():
    """Create and return a Kafka producer"""
    try:
        producer = KafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            key_serializer=lambda k: k.encode('utf-8') if k else None,
            acks='all',
            retries=3
        )
        print(f"✓ Connected to Kafka at {KAFKA_BOOTSTRAP_SERVERS}")
        return producer
    except Exception as e:
        print(f"✗ Failed to create Kafka producer: {e}")
        raise


def send_messages(producer, topic, num_messages=100, delay=1):
    """Send messages to Kafka topic"""
    print(f"\n📤 Starting to send {num_messages} messages to topic '{topic}'...")
    print(f"   Delay between messages: {delay} second(s)\n")
    
    for i in range(num_messages):
        try:
            user = generate_user()
            key = user['id']
            
            # Send message
            future = producer.send(topic, key=key, value=user)
            
            # Wait for the message to be sent (optional, for confirmation)
            record_metadata = future.get(timeout=10)
            
            print(f"[{i+1}/{num_messages}] ✓ Sent user: {user['name']} ({user['email']}) "
                  f"-> partition {record_metadata.partition}, offset {record_metadata.offset}")
            
            # Delay between messages
            if delay > 0:
                time.sleep(delay)
                
        except KafkaError as e:
            print(f"✗ Kafka error: {e}")
        except Exception as e:
            print(f"✗ Error sending message: {e}")
    
    # Flush to ensure all messages are sent
    producer.flush()
    print(f"\n✓ Finished sending {num_messages} messages to topic '{topic}'")


def main():
    """Main function"""
    print("=" * 60)
    print("Kafka User Producer")
    print("=" * 60)
    
    # Create producer
    producer = create_producer()
    
    try:
        # Send messages
        # You can modify num_messages and delay as needed
        send_messages(producer, TOPIC_NAME, num_messages=50, delay=0.5)
        
    except KeyboardInterrupt:
        print("\n\n⚠ Interrupted by user")
    except Exception as e:
        print(f"\n✗ Error: {e}")
    finally:
        producer.close()
        print("\n✓ Producer closed")


if __name__ == '__main__':
    main()

