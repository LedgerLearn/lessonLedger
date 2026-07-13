import WebSocket from 'ws';

// Test script for WebSocket performance and concurrent connections
// Run this manually: ts-node src/tests/websocket.test.ts

const WS_URL = 'ws://localhost:5000/ws';
const TEST_TOKEN = 'your-test-token-here'; // Replace with a valid JWT token

interface TestResult {
  connectedClients: number;
  messagesReceived: number;
  avgLatency: number;
  errors: number;
  duration: number;
}

async function testConcurrentConnections(numClients: number, numUpdatesPerClient: number): Promise<TestResult> {
  return new Promise((resolve) => {
    const clients: WebSocket[] = [];
    let messagesReceived = 0;
    let errors = 0;
    const latencies: number[] = [];
    const startTime = Date.now();

    console.log(`\n🧪 Testing ${numClients} concurrent connections with ${numUpdatesPerClient} updates each...`);

    // Create multiple WebSocket connections
    for (let i = 0; i < numClients; i++) {
      const ws = new WebSocket(`${WS_URL}?token=${TEST_TOKEN}`);
      
      ws.on('open', () => {
        console.log(`✅ Client ${i + 1} connected`);
        
        // Send test messages
        for (let j = 0; j < numUpdatesPerClient; j++) {
          const sendTime = Date.now();
          ws.send(JSON.stringify({ type: 'ping', timestamp: sendTime }));
        }
      });

      ws.on('message', (data) => {
        messagesReceived++;
        const message = JSON.parse(data.toString());
        
        if (message.type === 'pong' && message.timestamp) {
          const latency = Date.now() - message.timestamp;
          latencies.push(latency);
        }

        // Close after receiving expected messages
        if (messagesReceived >= numClients * numUpdatesPerClient) {
          cleanup();
        }
      });

      ws.on('error', (error) => {
        errors++;
        console.error(`❌ Client ${i + 1} error:`, error.message);
      });

      clients.push(ws);
    }

    function cleanup() {
      clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });

      const duration = Date.now() - startTime;
      const avgLatency = latencies.length > 0 
        ? latencies.reduce((a, b) => a + b, 0) / latencies.length 
        : 0;

      resolve({
        connectedClients: numClients,
        messagesReceived,
        avgLatency,
        errors,
        duration,
      });
    }

    // Timeout after 30 seconds
    setTimeout(() => {
      console.log('⏱️  Test timeout reached');
      cleanup();
    }, 30000);
  });
}

async function runTests() {
  console.log('🚀 Starting WebSocket Performance Tests\n');

  // Test 1: Small load (10 clients)
  const test1 = await testConcurrentConnections(10, 10);
  console.log('\n📊 Test 1 Results (10 clients, 10 updates each):');
  console.log(`   Connected: ${test1.connectedClients}`);
  console.log(`   Messages: ${test1.messagesReceived}`);
  console.log(`   Avg Latency: ${test1.avgLatency.toFixed(2)}ms`);
  console.log(`   Errors: ${test1.errors}`);
  console.log(`   Duration: ${test1.duration}ms`);

  // Test 2: Medium load (50 clients)
  const test2 = await testConcurrentConnections(50, 5);
  console.log('\n📊 Test 2 Results (50 clients, 5 updates each):');
  console.log(`   Connected: ${test2.connectedClients}`);
  console.log(`   Messages: ${test2.messagesReceived}`);
  console.log(`   Avg Latency: ${test2.avgLatency.toFixed(2)}ms`);
  console.log(`   Errors: ${test2.errors}`);
  console.log(`   Duration: ${test2.duration}ms`);

  // Test 3: High load (100 clients)
  const test3 = await testConcurrentConnections(100, 2);
  console.log('\n📊 Test 3 Results (100 clients, 2 updates each):');
  console.log(`   Connected: ${test3.connectedClients}`);
  console.log(`   Messages: ${test3.messagesReceived}`);
  console.log(`   Avg Latency: ${test3.avgLatency.toFixed(2)}ms`);
  console.log(`   Errors: ${test3.errors}`);
  console.log(`   Duration: ${test3.duration}ms`);

  console.log('\n✅ All tests completed!');
  process.exit(0);
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

export { testConcurrentConnections };
