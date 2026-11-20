#!/bin/bash

endpoints=(
  "/products"
  "/inventory"
  "/hr/employees"
  "/general-ledger/trial-balance"
  "/analytics/getDashboardMetrics"
  "/suppliers"
)

echo "Starting ERP Platform API Endpoints Test..."
echo "------------------------------------------"

for path in "${endpoints[@]}"; do
  echo -n "Testing http://127.0.0.1:3000${path} ... "
  response=$(curl -s -w "\n%{http_code}" "http://127.0.0.1:3000${path}")
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  echo "[HTTP $status]"
  if [ -n "$body" ]; then
    echo "  Payload preview: ${body:0:100}..."
  fi
  echo ""
done

echo "------------------------------------------"
echo "Test completed."
