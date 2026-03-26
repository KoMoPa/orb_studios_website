#!/bin/bash

echo "🧪 Testing Media File Access"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test URLs
BASE_URL="${1:-http://localhost:3000}"
TEST_FILES=(
  "liveroom1.jpg"
  "console.jpg"
  "Record.png"
)

echo "Testing against: $BASE_URL"
echo ""

# Function to test a URL
test_url() {
  local file=$1
  local url="$BASE_URL/media/$file"
  
  echo -n "Testing /media/$file ... "
  
  # Use curl to check status code
  status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null)
  
  if [ "$status_code" = "200" ]; then
    echo -e "${GREEN}✓ SUCCESS${NC} (HTTP $status_code)"
    return 0
  elif [ "$status_code" = "000" ]; then
    echo -e "${RED}✗ FAILED${NC} (Connection failed - is server running?)"
    return 1
  else
    echo -e "${RED}✗ FAILED${NC} (HTTP $status_code)"
    return 1
  fi
}

# Test each file
success_count=0
fail_count=0

for file in "${TEST_FILES[@]}"; do
  if test_url "$file"; then
    ((success_count++))
  else
    ((fail_count++))
  fi
done

echo ""
echo "=============================="
echo "Results: ${GREEN}$success_count passed${NC}, ${RED}$fail_count failed${NC}"

if [ $fail_count -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  echo ""
  echo "Make sure the dev server is running:"
  echo "  pnpm dev"
  exit 1
fi
