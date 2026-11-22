import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/** Solo emite notificaciones de actualización; nunca datos de incidentes. */
@WebSocketGateway({ cors: { origin: process.env.CORS_ORIGIN ?? '*' } })
export class RealtimeGateway implements OnGatewayConnection {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    this.logger.debug(`Cliente conectado: ${client.id}`);
  }

  notificarIncidentes(count: number) {
    this.server.emit('incidentes:actualizados', {
      count,
      at: new Date().toISOString(),
    });
  }
}
