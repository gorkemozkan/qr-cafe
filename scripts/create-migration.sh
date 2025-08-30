#!/bin/bash

# Get the migration name from the first argument, default to "migration"
MIGRATION_NAME=${1:-migration}

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Create the migration file
supabase db diff > "supabase/migrations/${TIMESTAMP}_${MIGRATION_NAME}.sql"

echo "Created migration: ${TIMESTAMP}_${MIGRATION_NAME}.sql"
