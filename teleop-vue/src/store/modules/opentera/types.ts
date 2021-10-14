// src/store/modules/opentera/types.ts

import openteraWebrtcWebClient from "opentera-webrtc-web-client";

export interface SignalingServerConfiguration {
  url?: string;
  name?: string;
  data?: Record<string, any>;
  room?: string;
  password?: string;
}

export interface StreamConfiguration {
  localStream?: MediaStream;
  isSendOnly: boolean;
}

export interface IceServer {
  urls: string;
  username?: string;
  credential?: string;
  credentialType?: string;
}

export interface RtcConfiguration {
  iceServers: Array<IceServer>;
}

export interface Logger {
  (...args: any[]): void | string;
}

// TODO: Split in different interface
export interface Client {
  id?: string;
  name?: string;
  data?: Record<string, any>; // TODO: define data interface
  room?: string;
  stream?: MediaStream;
  isInCall?: boolean;
  isMuted?: boolean;
  isCameraOn?: boolean;
  isConnected?: boolean;
}

// REFACTOR TYPES
export interface SignalingClientRoom {
  isInitPending: boolean;
  beforeunloadEventHandler: Function | null;
  logger: Logger;
  client?: openteraWebrtcWebClient.SignalingClient;
  clientsInRoom: Array<Client>;
  numberClientsInCall: number;
  inCallState: boolean;
  //clientsInCall: Array<Client>;
}

export interface StreamClientState extends SignalingClientRoom {
  localStream: MediaStream | null;
  client: openteraWebrtcWebClient.StreamClient;
  clientsInCall: Array<Client>;
  showParticipants: boolean;
}

export interface DataChannelClientState extends SignalingClientRoom {
  client: openteraWebrtcWebClient.DataChannelClient;
  onMessageEventHandler: Function | null;
  batteryLevel: number;
  signalStrength: number;
  waypointReached: number;
}

export interface RoomClient {
  id?: string;
  name?: string;
  data?: Record<string, any>; // TODO define data interface
  room?: string;
}

export interface SignalingClientContext extends Context {
  state: SignalingClientRoom;
}

export interface StreamClientContext extends SignalingClientContext {
  state: StreamClientState;
}

export interface DataChannelClientContext extends SignalingClientContext {
  state: DataChannelClientState;
}

export interface Context {
  state: Record<string, any> | Function;
  rootState: Record<string, any> | Function;
  commit: {
    (type: string, payload?: any, options?: Record<string, any>): void;
  };
  dispatch: {
    (type: string, payload?: any, options?: Record<string, any>): void;
  };
  getters: { [key: string]: Function };
  rootGetters: { [key: string]: Function };
}
