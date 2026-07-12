#!/bin/bash

# Smart Contract Verification Script
# Verifies deployed contracts on Etherscan/PolygonScan
# Supports both Sepolia and Mumbai testnets

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Arguments
CONTRACT_ADDRESS="$1"
NETWORK="$2"
VERIFICATION_KEY="$3"
CONTRACT_NAME="${4:-AcademicImplementation}"

if [ -z "$CONTRACT_ADDRESS" ] || [ -z "$NETWORK" ] || [ -z "$VERIFICATION_KEY" ]; then
    echo -e "${RED}Usage: ./verify.sh <contract_address> <network> <verification_key> [contract_name]${NC}"
    echo -e "${RED}Example: ./verify.sh 0x1234... sepolia YOUR_API_KEY${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Smart Contract Verification${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Contract:      ${YELLOW}$CONTRACT_ADDRESS${NC}"
echo -e "Network:       ${YELLOW}$NETWORK${NC}"
echo -e "Contract Name: ${YELLOW}$CONTRACT_NAME${NC}"

# Set network-specific parameters
if [ "$NETWORK" = "sepolia" ]; then
    VERIFY_URL="https://api-sepolia.etherscan.io/api"
    EXPLORER="https://sepolia.etherscan.io/address/$CONTRACT_ADDRESS"
elif [ "$NETWORK" = "mumbai" ]; then
    VERIFY_URL="https://api-testnet.polygonscan.com/api"
    EXPLORER="https://mumbai.polygonscan.com/address/$CONTRACT_ADDRESS"
else
    echo -e "${RED}Unknown network: $NETWORK${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Explorer: $EXPLORER${NC}"

# Prepare source code (placeholder - actual implementation would include real contract)
FLATTENED_CODE="// Flattened contract source code"

# Construct verification payload
VERIFY_PAYLOAD="apikey=$VERIFICATION_KEY&module=contract&action=verifysourcecode"
VERIFY_PAYLOAD="$VERIFY_PAYLOAD&address=$CONTRACT_ADDRESS"
VERIFY_PAYLOAD="$VERIFY_PAYLOAD&contractname=$CONTRACT_NAME"
VERIFY_PAYLOAD="$VERIFY_PAYLOAD&codeformat=solidity-single-file"
VERIFY_PAYLOAD="$VERIFY_PAYLOAD&compilerversion=v0.8.19+commit.7dd6d404"
VERIFY_PAYLOAD="$VERIFY_PAYLOAD&optimizationUsed=1"
VERIFY_PAYLOAD="$VERIFY_PAYLOAD&runs=200"
VERIFY_PAYLOAD="$VERIFY_PAYLOAD&sourceCode=$FLATTENED_CODE"
VERIFY_PAYLOAD="$VERIFY_PAYLOAD&constructorArguments="

echo -e "\n${YELLOW}Submitting verification request...${NC}"

# Submit verification
RESPONSE=$(curl -s -X POST "$VERIFY_URL" -d "$VERIFY_PAYLOAD")

echo -e "${GREEN}$RESPONSE${NC}"

# Check for success
if echo "$RESPONSE" | grep -q "OK"; then
    echo -e "\n${GREEN}✓ Verification submitted successfully${NC}"
    echo -e "${YELLOW}Check status: $EXPLORER${NC}"
else
    echo -e "\n${RED}✗ Verification failed${NC}"
    exit 1
fi
