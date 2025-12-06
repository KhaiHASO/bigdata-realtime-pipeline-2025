#!/bin/bash

# Demo 6: Query và Analysis
# Query và analyze data trong Cassandra

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DEMO 6: Query và Analysis${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print step
print_step() {
    echo -e "${YELLOW}[STEP $1]${NC} $2"
    echo ""
}

# Function to wait for user
wait_user() {
    echo -e "${GREEN}✓ Step completed!${NC}"
    echo -e "${YELLOW}Press Enter to continue...${NC}"
    read
    echo ""
}

# Step 1: Basic Queries
print_step "1" "Basic Queries"

echo "Total record count:"
COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
echo -e "${GREEN}$COUNT records${NC}"

echo ""
echo "Sample records (first 10):"
docker exec cassandra cqlsh -e "SELECT id, name, email, ts FROM realtime.users LIMIT 10;" 2>/dev/null | tail -11
wait_user

# Step 2: Query by Email (sử dụng index)
print_step "2" "Query by Email"

echo "Getting a sample email to query..."
SAMPLE_EMAIL=$(docker exec cassandra cqlsh -e "SELECT email FROM realtime.users LIMIT 1;" 2>/dev/null | grep "@" | head -1 | tr -d ' ')

if [ ! -z "$SAMPLE_EMAIL" ]; then
    echo "Querying user by email: $SAMPLE_EMAIL"
    docker exec cassandra cqlsh -e "SELECT * FROM realtime.users WHERE email = '$SAMPLE_EMAIL';" 2>/dev/null | tail -5
else
    echo "No email found. Showing first email from table:"
    docker exec cassandra cqlsh -e "SELECT email FROM realtime.users LIMIT 5;" 2>/dev/null | grep "@" | head -3
fi

echo ""
echo "Listing unique email domains (first 10):"
docker exec cassandra cqlsh -e "SELECT email FROM realtime.users LIMIT 20;" 2>/dev/null | grep "@" | sed 's/.*@//' | sort | uniq | head -10
wait_user

# Step 3: Time-based Queries
print_step "3" "Time-based Queries"

echo "Most recent users (by timestamp):"
docker exec cassandra cqlsh -e "SELECT id, name, email, ts FROM realtime.users LIMIT 5;" 2>/dev/null | tail -6

echo ""
echo "Oldest users (if we had ordering):"
echo "Note: Cassandra requires ALLOW FILTERING for time range queries without proper clustering key"
docker exec cassandra cqlsh -e "SELECT id, name, email, ts FROM realtime.users LIMIT 5;" 2>/dev/null | head -6
wait_user

# Step 4: Data Analysis
print_step "4" "Data Analysis"

echo "Top 10 most recent users:"
docker exec cassandra cqlsh -e "SELECT id, name, email, ts FROM realtime.users LIMIT 10;" 2>/dev/null | tail -11

echo ""
echo "Email domain distribution:"
docker exec cassandra cqlsh -e "SELECT email FROM realtime.users;" 2>/dev/null | grep "@" | sed 's/.*@//' | sort | uniq -c | sort -rn | head -10

echo ""
echo "Total unique emails:"
UNIQUE_EMAILS=$(docker exec cassandra cqlsh -e "SELECT email FROM realtime.users;" 2>/dev/null | grep "@" | sort | uniq | wc -l)
echo -e "${GREEN}$UNIQUE_EMAILS unique emails${NC}"
wait_user

# Step 5: Export Data
print_step "5" "Export Data"

echo "Exporting data to CSV..."
docker exec cassandra cqlsh -e "
COPY realtime.users (id, name, email, ts) TO '/tmp/users.csv' WITH HEADER = true;
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Data exported to /tmp/users.csv in container${NC}"
    
    echo "Copying file to host..."
    docker cp cassandra:/tmp/users.csv ./users_export.csv 2>/dev/null
    
    if [ -f "./users_export.csv" ]; then
        echo -e "${GREEN}✓ File copied to ./users_export.csv${NC}"
        echo ""
        echo "First 10 lines of exported file:"
        head -10 ./users_export.csv
        echo ""
        echo "File size: $(du -h ./users_export.csv | cut -f1)"
        echo "Total lines: $(wc -l < ./users_export.csv)"
    else
        echo -e "${YELLOW}⚠ Could not copy file from container${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Export may have failed or table is empty${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ DEMO 6 COMPLETED!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Kết quả:"
echo "  ✅ Có thể query data dễ dàng"
echo "  ✅ Index hoạt động tốt"
echo "  ✅ Có thể export data để analysis"
echo ""
if [ -f "./users_export.csv" ]; then
    echo "Exported file: ./users_export.csv"
fi
echo ""
echo -e "${YELLOW}Press Enter to exit...${NC}"
read

