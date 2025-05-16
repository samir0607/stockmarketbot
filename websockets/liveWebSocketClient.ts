const FINNHUB_API_KEY = '';
const symbol = 'AAPL';

const wsUrl = `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`;

// Create a new WebSocket connection
const socket = new WebSocket(wsUrl);

socket.addEventListener('open', () => {
  console.log('WebSocket connection opened.');
  // Subscribe to live updates for the given symbol
  const subscribeMessage = JSON.stringify({ type: 'subscribe', symbol: symbol });
  socket.send(subscribeMessage);
});

socket.addEventListener('message', (event) => {
  try {
    const data = JSON.parse(event.data);
    console.log('Live update received:', data);
    // Here you could process the live data and optionally trigger notifications
  } catch (err) {
    console.error('Error parsing WebSocket message:', err);
  }
});

socket.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

socket.addEventListener('close', () => {
  console.log('WebSocket connection closed.');
});
