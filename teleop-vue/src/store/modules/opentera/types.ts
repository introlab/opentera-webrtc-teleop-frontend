// src/store/modules/opentera/types.ts

import openteraWebrtcWebClient from "opentera-webrtc-web-client";

export interface SignalingServerConfirguration {
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
  
export type StreamDataChannelClient = typeof openteraWebrtcWebClient.StreamDataChannelClient;
  
export interface Logger {
    (...args: any[]): void | string;
}
  
export interface State {
    isInitPending: boolean;
    beforeunloadEventHandler: Function | null
    localStream: MediaStream | null;
    streamClient: StreamDataChannelClient | null;
    logger: Logger | null;
    clientsInRoom: Array<Client>;
    clientsInCall: Array<Client>;
    showParticipants: boolean;
};

export interface Client {
    id?: string;
    name?: string;
    data?: Record<string, any>; // TODO define data interface
    room?: string;
    stream?: MediaStream;
    isInCall?: boolean;
    isMuted?: boolean;
    isCameraOn?: boolean;
    isConnected?: boolean;
}