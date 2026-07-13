# WebSocket Quick Setup Guide

## Prerequisites
- Node.js installed
- Backend and Frontend already set up
- User authentication working (JWT tokens)

## Installation Steps

### 1. Install Backend Dependencies
```bash
cd backend
npm install ws@^8.16.0 @types/ws@^8.5.10
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
JWT_SECRET=your-secret-key-here
PORT=5000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000/ws
```

### 3. Start the Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## Verify Installation

### 1. Check Backend Logs
You should see:
```
Server running on port 5000
WebSocket server running on ws://localhost:5000/ws
```

### 2. Open Browser
- Navigate to `http://localhost:3000`
- Login to your account
- Go to Dashboard
- Look for green "Live" indicator next to "Upcoming Tasks"

### 3. Test Real-Time Updates
1. Open the same dashboard in two browser tabs
2. In Tab 1: Create a new task
3. In Tab 2: Task should appear instantly without refresh
4. Try updating and deleting tasks - changes should sync across tabs

## Performance Testing

Run the performance test:
```bash
cd backend
npx ts-node src/tests/websocket.test.ts
```

Note: Update `TEST_TOKEN` in the test file with a valid JWT token first.

Expected output:
```
🚀 Starting WebSocket Performance Tests

🧪 Testing 10 concurrent connections...
✅ Client 1 connected
✅ Client 2 connected
...

📊 Test Results:
   Connected: 10
   Messages: 100
   Avg Latency: 45.23ms
   Errors: 0
```

## Troubleshooting

### WebSocket Connection Failed
**Problem**: "Live" indicator not showing
**Solution**: 
- Check backend is running
- Verify JWT token is valid (check localStorage)
- Check browser console for errors

### CORS Issues
**Problem**: Connection blocked by CORS
**Solution**: Backend already configured with CORS, but if issues persist, check `backend/src/index.ts`

### Port Already in Use
**Problem**: Port 5000 already taken
**Solution**: 
- Change PORT in `.env`
- Update `NEXT_PUBLIC_WS_URL` to match new port
- Restart backend

### Multiple Reconnection Attempts
**Problem**: WebSocket keeps reconnecting
**Solution**:
- Check backend logs for errors
- Verify JWT token hasn't expired
- Check network connectivity

## Features Enabled

✅ **Real-Time Task Updates**
- Task creation syncs instantly
- Task updates appear immediately
- Task deletions reflected in real-time

✅ **Multiple Tab Support**
- Each tab has independent connection
- Updates sync across all tabs
- No conflicts or duplicate messages

✅ **Automatic Reconnection**
- Handles network interruptions
- Retries up to 10 times
- Exponential backoff between attempts

✅ **Connection Status Indicator**
- Green "Live" badge when connected
- Visual feedback for users
- Helps debug connection issues

✅ **Performance Optimizations**
- Heartbeat to detect dead connections
- User-specific message routing
- Optimistic UI updates

## Next Steps

Once everything is working:
1. Monitor performance under load
2. Consider Redis adapter for production scaling
3. Add logging/monitoring for WebSocket metrics
4. Implement rate limiting if needed
5. Add e2e tests for WebSocket functionality

## Support

If you encounter issues:
1. Check browser console (F12)
2. Check backend terminal logs
3. Verify environment variables
4. Review `WEBSOCKET_IMPLEMENTATION.md` for detailed docs
