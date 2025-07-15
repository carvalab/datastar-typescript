#!/usr/bin/env bash
set -euo pipefail

# Always run from project root
cd "$(dirname "$0")/.."

# Check for required tools
for tool in bun node deno go git; do
  if ! command -v $tool >/dev/null 2>&1; then
    echo "[error] $tool is not installed. Please install $tool to run the tests."
    exit 1
  fi
done

# Clone datastar core repo if not present
if [ ! -d "datastar/.git" ]; then
  echo "[setup] Cloning datastar core repo..."
  git clone --depth 1 --branch develop https://github.com/starfederation/datastar.git datastar
else
  echo "[setup] datastar core repo already present. Fetching latest..."
  (cd datastar && git fetch origin develop && git checkout develop && git pull)
fi

# Build the SDK (for Node)
echo "[build] Building SDK for Node..."
deno run -A build.ts

# Start servers and run tests

declare -A servers
servers[node]="node test/node.ts"
servers[bun]="bun run test/bun.ts"
servers[deno]="deno run --allow-net test/deno.ts"
declare -A ports
ports[node]=3000
ports[bun]=8001
ports[deno]=8000

declare -A pids

echo "[test] Starting servers..."
for runtime in node bun deno; do
  echo "[test] Starting $runtime server on port ${ports[$runtime]}..."
  nohup ${servers[$runtime]} > $runtime-server.log 2>&1 &
  pids[$runtime]=$!
  sleep 5
done

# Function to cleanup servers on exit
cleanup() {
  echo "[cleanup] Stopping servers..."
  for runtime in node bun deno; do
    if kill -0 ${pids[$runtime]} 2>/dev/null; then
      kill ${pids[$runtime]} || true
    fi
  done
}
trap cleanup EXIT

# Run Go SDK tests for each server
declare -A results
for runtime in node bun deno; do
  port=${ports[$runtime]}
  echo "[test] Running Go SDK tests for $runtime (http://127.0.0.1:$port)..."
  (cd datastar/sdk/tests && go run ./cmd/datastar-sdk-tests -server http://127.0.0.1:$port)
  results[$runtime]=$?
done

# Print server logs and results
echo "\n[test] Server logs:"
for runtime in node bun deno; do
  echo "--- $runtime server log (last 20 lines) ---"
  tail -n 20 $runtime-server.log || echo "No log file found."
done

echo "\n[test] Results:"
for runtime in node bun deno; do
  if [ "${results[$runtime]}" -eq 0 ]; then
    echo "$runtime: PASS"
  else
    echo "$runtime: FAIL"
  fi
done

# Exit with failure if any test failed
for runtime in node bun deno; do
  if [ "${results[$runtime]}" -ne 0 ]; then
    exit 1
  fi
done

echo "[test] All tests passed!" 