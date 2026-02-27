#!/bin/bash
# Script to setup PostgreSQL database for Orb Studios

set -e

DB_NAME="orb_studios"
DB_USER="payload"
DB_PASSWORD="${DB_PASSWORD:-payload123}"
DB_PORT="${DB_PORT:-5432}"

echo "🗄️  Setting up PostgreSQL database for Orb Studios..."
echo ""
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Database Port: $DB_PORT"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed."
    echo "   Install it with: brew install postgresql@15"
    exit 1
fi

echo "✓ PostgreSQL found"

# Check if PostgreSQL is running
if ! pg_isready -p $DB_PORT > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running."
    echo "   Start it with: brew services start postgresql@15"
    exit 1
fi

echo "✓ PostgreSQL is running"
echo ""

# Create database
echo "Creating database '$DB_NAME'..."
createdb -p $DB_PORT $DB_NAME 2>/dev/null || true
echo "✓ Database '$DB_NAME' ready"

# Create user if it doesn't exist
echo "Creating database user '$DB_USER'..."
psql -p $DB_PORT -tc "SELECT 1 FROM pg_user WHERE usename = '$DB_USER'" | grep -q 1 || \
  psql -p $DB_PORT -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
echo "✓ User '$DB_USER' ready"

# Grant privileges
echo "Granting privileges..."
psql -p $DB_PORT -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
psql -p $DB_PORT -d $DB_NAME -c "GRANT USAGE ON SCHEMA public TO $DB_USER;"
psql -p $DB_PORT -d $DB_NAME -c "GRANT CREATE ON SCHEMA public TO $DB_USER;"
echo "✓ Privileges granted"

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Update your .env.local with:"
echo "DATABASE_URI=postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME"
