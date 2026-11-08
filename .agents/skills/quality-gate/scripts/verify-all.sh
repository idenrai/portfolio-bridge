#!/usr/bin/env bash
# verify-all.sh - Fail-Fast Pipeline Verification Script
# Executes: TypeScript Check -> Lint -> Vitest -> Vite Build

set -euo pipefail

echo "=================================================="
echo "🚀 [Quality Gate] Starting Full Pipeline Check..."
echo "=================================================="

# 1. Type Check (Fail-Fast)
echo "🔍 Step 1: Checking TypeScript types (npx tsc --noEmit)..."
npx tsc --noEmit
echo "✅ Step 1 Passed: 0 Type Errors"
echo ""

# 2. Lint Check
echo "🔍 Step 2: Running ESLint (npm run lint)..."
npm run lint
echo "✅ Step 2 Passed: 0 Lint Errors"
echo ""

# 3. Unit Tests
echo "🔍 Step 3: Running Vitest Unit Tests (npx vitest run)..."
npx vitest run
echo "✅ Step 3 Passed: All Unit Tests Green"
echo ""

# 4. Production Build
echo "🔍 Step 4: Running Production Build (npm run build)..."
npm run build
echo "✅ Step 4 Passed: Production Build Succeeded"
echo ""

echo "=================================================="
echo "🎉 [Quality Gate] All checks passed successfully!"
echo "=================================================="

