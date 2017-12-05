import * as io from 'socket.io-client';

import { SocketEventType } from '../x-shared/events/SocketEventType';

export abstract class BaseRoom {
    protected socket: SocketIOClient.Socket;
    protected mainSocketAddress = 'localhost:4000/';

    protected appendToMainSocketAddress(roomId: string) {
        return this.mainSocketAddress + roomId;
    }

    /**
     * This method will be called once the connection is established
     */
    protected abstract onConnectionEstablished(): void;

    protected connectToSocket(connectionString?: string) {
        this.socket = io.connect(connectionString ? connectionString : this.mainSocketAddress);
        this.socket.on(SocketEventType.client.connected, () => {
            this.onConnectionEstablished();
        });
    }

    protected disconnectFromSocket() {
        this.socket.disconnect();
    }

}
