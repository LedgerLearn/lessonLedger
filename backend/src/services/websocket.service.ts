import WebSocket from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

export class WebSocketService {
  private wss: WebSocket.Server;
  private clients: Map<string, Set<AuthenticatedWebSocket>> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server, path: '/ws' });
    this.setupWebSocketServer();
    this.setupHeartbeat();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
      ws.isAlive = true;

      // Handle authentication
      const token = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('token');
      
      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        ws.userId = decoded.userId;

        // Add client to user's connection set
        if (!this.clients.has(ws.userId)) {
          this.clients.set(ws.userId, new Set());
        }
        this.clients.get(ws.userId)!.add(ws);

        console.log(`WebSocket client connected: ${ws.userId}`);

        // Send connection success message
        ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connection established' }));

        // Handle pong responses
        ws.on('pong', () => {
          ws.isAlive = true;
        });

        // Handle client messages
        ws.on('message', (message: string) => {
          try {
            const data = JSON.parse(message.toString());
            if (data.type === 'ping') {
              ws.send(JSON.stringify({ type: 'pong' }));
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });

        // Handle disconnection
        ws.on('close', () => {
          if (ws.userId && this.clients.has(ws.userId)) {
            this.clients.get(ws.userId)!.delete(ws);
            if (this.clients.get(ws.userId)!.size === 0) {
              this.clients.delete(ws.userId);
            }
          }
          console.log(`WebSocket client disconnected: ${ws.userId}`);
        });

        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
        });

      } catch (error) {
        console.error('Authentication error:', error);
        ws.close(1008, 'Invalid token');
      }
    });
  }

  private setupHeartbeat() {
    // Ping clients every 30 seconds to detect dead connections
    const interval = setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    this.wss.on('close', () => {
      clearInterval(interval);
    });
  }

  // Broadcast task update to all user's connections
  public broadcastToUser(userId: string, data: any) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const message = JSON.stringify(data);
      userClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }

  // Broadcast to all connected clients
  public broadcastToAll(data: any) {
    const message = JSON.stringify(data);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  public getConnectionCount(): number {
    return this.wss.clients.size;
  }

  public getUserConnectionCount(userId: string): number {
    return this.clients.get(userId)?.size || 0;
  }
}

let wsService: WebSocketService | null = null;

export const initWebSocketService = (server: Server): WebSocketService => {
  if (!wsService) {
    wsService = new WebSocketService(server);
  }
  return wsService;
};

export const getWebSocketService = (): WebSocketService | null => {
  return wsService;
};
