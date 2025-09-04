#!/bin/bash

MIGRATION_NAME=${1:-migration}

TIMESTAMP=$(date +%Y%m%d%H%M%S)

supabase db diff > "supabase/migrations/${TIMESTAMP}_${MIGRATION_NAME}.sql"

supabase gen types typescript --local > types/db.ts

echo "Created migration: ${TIMESTAMP}_${MIGRATION_NAME}.sql"
