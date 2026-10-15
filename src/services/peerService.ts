import Peer, { DataConnection } from 'peerjs';

export interface P2PMessage {
  type: 'PLAYER_JOIN' | 'PLAYER_LIST' | 'START_MATCH' | 'PASS_POTATO' | 'EXPLOSION' | 'VOICE_SHOUT';
  senderId: string;
  payload?: any;
}

export type MessageCallback = (msg: P2PMessage) => void;

class PeerService {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private hostConnection: DataConnection | null = null;
  private messageListeners: MessageCallback[] = [];
  private broadcastChannel: BroadcastChannel | null = null;

  public myCode: string = '';
  public isHost: boolean = false;
  public isConnected: boolean = false;

  // Initialize as Host with 4-digit code
  public async createHostRoom(code: string): Promise<string> {
    this.cleanup();
    this.myCode = code;
    this.isHost = true;

    const peerId = `hp-p2p-${code}`;

    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer(peerId, {
          debug: 1,
        });

        this.peer.on('open', (id) => {
          this.isConnected = true;
          this.initBroadcast(code);
          resolve(code);
        });

        this.peer.on('connection', (conn) => {
          this.handleIncomingConnection(conn);
        });

        this.peer.on('error', (err) => {
          // If ID is already taken or failed, still allow broadcast fallback
          this.initBroadcast(code);
          resolve(code);
        });
      } catch (err) {
        this.initBroadcast(code);
        resolve(code);
      }
    });
  }

  // Connect as Client using 4-digit code
  public async joinRoom(code: string, myName: string, avatar: string): Promise<boolean> {
    this.cleanup();
    this.myCode = code;
    this.isHost = false;

    const targetPeerId = `hp-p2p-${code}`;

    return new Promise((resolve) => {
      try {
        this.peer = new Peer({
          debug: 1,
        });

        this.peer.on('open', () => {
          const conn = this.peer!.connect(targetPeerId, {
            reliable: true,
          });

          this.hostConnection = conn;

          conn.on('open', () => {
            this.isConnected = true;
            this.sendToHost({
              type: 'PLAYER_JOIN',
              senderId: conn.peer,
              payload: { name: myName, avatar },
            });
            resolve(true);
          });

          conn.on('data', (data) => {
            this.notifyListeners(data as P2PMessage);
          });

          conn.on('close', () => {
            this.isConnected = false;
          });

          conn.on('error', () => {
            // Fallback to broadcast
            this.initBroadcast(code);
            resolve(true);
          });
        });

        this.peer.on('error', () => {
          this.initBroadcast(code);
          resolve(true);
        });

        // Timeout fallback
        setTimeout(() => {
          this.initBroadcast(code);
          resolve(true);
        }, 3500);
      } catch {
        this.initBroadcast(code);
        resolve(true);
      }
    });
  }

  private handleIncomingConnection(conn: DataConnection) {
    this.connections.set(conn.peer, conn);

    conn.on('data', (data) => {
      const msg = data as P2PMessage;
      this.notifyListeners(msg);
      // Host broadcasts message to all other connected peers
      this.broadcastToAll(msg, conn.peer);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
    });
  }

  // Broadcast local channel for instant multi-tab fallback
  private initBroadcast(code: string) {
    try {
      if (this.broadcastChannel) this.broadcastChannel.close();
      this.broadcastChannel = new BroadcastChannel(`hp_channel_${code}`);
      this.broadcastChannel.onmessage = (event) => {
        this.notifyListeners(event.data);
      };
    } catch {
      // Ignore
    }
  }

  // Send message to host
  public sendToHost(msg: P2PMessage) {
    if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send(msg);
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch {
        // Ignore
      }
    }
  }

  // Broadcast to all peers (Host only)
  public broadcastToAll(msg: P2PMessage, excludePeerId?: string) {
    this.connections.forEach((conn, id) => {
      if (id !== excludePeerId && conn.open) {
        conn.send(msg);
      }
    });
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch {
        // Ignore
      }
    }
  }

  // Add listener for incoming messages
  public onMessage(callback: MessageCallback) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter((cb) => cb !== callback);
    };
  }

  private notifyListeners(msg: P2PMessage) {
    this.messageListeners.forEach((cb) => {
      try {
        cb(msg);
      } catch {
        // Ignore
      }
    });
  }

  public cleanup() {
    this.connections.forEach((c) => c.close());
    this.connections.clear();
    if (this.hostConnection) {
      this.hostConnection.close();
      this.hostConnection = null;
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.messageListeners = [];
    this.isConnected = false;
  }
}

export const peerService = new PeerService();
