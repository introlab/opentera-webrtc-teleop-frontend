// src/store/modules/opentera/types.ts

import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import { Commit, Dispatch } from "vuex";
import { RouterState } from "../router";

export interface RobotStatus {
  isCharging: boolean;
  batteryVoltage: number;
  batteryCurrent: number;
  batteryLevel: number;
  cpuUsage: number;
  memUsage: number;
  diskUsage: number;
  wifiNetwork: string;
  wifiStrength: number;
  localIp: string;
  micVolume: number;
  isCameraOn: boolean;
  volume: number;
}

export interface LabelHandling {
  labels: Array<{ value: string; text: string }>;
  labelsDesc: Record<string, string>;
  changedCb: Function | null;
}

export interface SignalingServerConfiguration {
  url?: string;
  name?: string;
  data?: Record<string, string>;
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
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: (any)[]): void | string;
}

// TODO: Split in different interface
export interface Client {
  id?: string;
  name?: string;
  data?: Record<string, string>; // TODO: define data interface
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
  beforeunloadEventHandler: EventListener;
  logger: Logger;
  client?: openteraWebrtcWebClient.SignalingClient;
  clientsInRoom: Array<Client>;
  numberClientsInCall: number;
  inCallState: boolean;
}

export interface StreamClientState extends SignalingClientRoom {
  localStream: MediaStream | null;
  client: openteraWebrtcWebClient.StreamClient;
  clientsInCall: Array<Client>;
  showParticipants: boolean;
  cameraDisplayMode: number;
  showControls: boolean;
  showSettings: boolean;
  micVolume: number;
  volume: number;
}

export interface DataChannelClientState extends SignalingClientRoom {
  client: openteraWebrtcWebClient.DataChannelClient;
  onMessageEventHandler: Function | null;
  status: RobotStatus;
  waypointReached: number;
  dockingStatus: string;
  labelHandling: LabelHandling;
}

export interface RoomClient {
  id?: string;
  name?: string;
  data?: Record<string, string>; // TODO define data interface
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

export interface RootState {
  router: RouterState,
  localClient: ClientState
}

export interface Context {
  rootState: RootState;
  commit: Commit;
  dispatch: Dispatch;
  getters: { [key: string]: Function };
  rootGetters: { [key: string]: Function };
}

export interface ClientContext extends Context {
  state: ClientState;
}

export interface ClientState {
  id?: string;
  name?: string;
  data?: Record<string, string>; // TODO: define data interface
  room?: string;
  stream?: MediaStream;
  isInCall?: boolean;
  isMuted?: boolean;
  isCameraOn?: boolean;
  isConnected?: boolean;
  openteraVideoConf: StreamClientState;
  openteraCameraX: StreamClientState;
  openteraMap: StreamClientState;
  openteraTeleop: DataChannelClientState;
}
