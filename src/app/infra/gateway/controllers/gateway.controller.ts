import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from '../services/gateway.service';
import {
  ConnectionPayload,
  SendConnectionPayload,
} from './protocols/connection.payload';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
})
export class GatewayController
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly gatewayService: GatewayService) {}

  @WebSocketServer()
  public server: Server;

  handleConnection(client: Socket) {
    try {
      if (!client.handshake.auth.token) {
        this.handleDisconnect(client);
        this.sendConnectionStatus({
          clientId: client.id,
          connected: false,
          message: 'Error making connection, token not informed',
        });
        return;
      }

      this.gatewayService.handleConnection(
        client.id,
        client.handshake.auth.token,
      );
      this.sendConnectionStatus({
        clientId: client.id,
        connected: true,
        message: 'Successful connection',
      });

      this.gatewayService.checkNotificationToSend(client.handshake.auth.token);

      console.log(client.id, 'connect');
    } catch (error) {
      console.log('Error Connecting:', error);

      let message = 'Error making connection';
      if (error.response.message) {
        message = error.response.message;
      }

      this.handleDisconnect(client);
      this.sendConnectionStatus({
        clientId: client.id,
        connected: false,
        message,
      });
    }
  }

  handleDisconnect(client: Socket) {
    try {
      if (!client.handshake.auth.token) {
        return;
      }
      this.gatewayService.removeUserDisconnecting(client.handshake.auth.token);
      console.log(client.id, 'disconnect');
    } catch (error) {
      console.log('Error Disconnect:', error);
    }
  }

  sendConnectionStatus(payload: SendConnectionPayload): void {
    this.server.to(payload.clientId).emit('connection', {
      connected: payload.connected,
      message: payload.message,
    } as ConnectionPayload);
  }
}
