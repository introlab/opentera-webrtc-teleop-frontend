// src/store/modules/opentera.ts

import { getBasePath, getOrigin } from "@/config/location";

import ClientStore, { Client } from "./clientStore";

import openteraWebrtcWebClient from "opentera-webrtc-web-client";

export interface SignalingServerConfirguration {
  url?: string;
  name?: string;
  data?: Record<string, any>;
  room?: string;
  password?: string;
}

export interface StreamConfiguration {
  localStream: Record<string, any>;
  isSendOnly: boolean;
}

export interface RtcConfiguration {
  iceServers: [{ urls: string }];
}

type StreamDataChannelClient = typeof openteraWebrtcWebClient.StreamDataChannelClient;

export interface Logger {
  (...args: any[]): void | string;
}

export interface State {
  localStream: Record<string, any> | null;
  streamClient: StreamDataChannelClient | null;
  logger: Logger | null;
  clientsInRoom: Array<Client>;
  clientsInCall: Array<Client>;
  showParticipants: boolean;
};

const Opentera = {
  namespaced: true,
  state: (): State => ({
    localStream: null,
    streamClient: null,
    logger: (...args) => console.log(...args),
    clientsInRoom: [],
    clientsInCall: [],
    showParticipants: false
  }),

  mutations: {
    setLocalStream(state: State, payload: any) {
      state.localStream = payload;
    },

    setStreamClient(state: State, payload: StreamDataChannelClient) {
      state.streamClient = payload;
    },

    setLogger(state: State, payload: Logger) {
      state.logger = payload;
    },

    updateClientsInRoom(state: State, payload: Array<Client>) {
      state.clientsInRoom = payload;
    },

    addClientInCall(state: State, payload: Client) {
      state.clientsInCall.push(payload);
    },

    removeClientIncallById(state: State, payload: string) {
      state.clientsInCall = state.clientsInCall.filter(client => client.id !== payload);
    },

    setCallAcceptor(state: State, payload: () => boolean) {
      state.streamClient.callAcceptor = payload;
    },

    toggleParticipantsList(state: State) {
      state.showParticipants = !state.showParticipants;
    }
  },

  actions: {
    async initialize(context: any, payload: SignalingServerConfirguration) {
      
      context.commit("localClient/setClient", payload);

      const signalingServerURL = await context.dispatch("getSignalingServerURL");

      const signalingServerConfirguration: SignalingServerConfirguration = {
        url: process.env.NODE_ENV !== "production" ? process.env.VUE_APP_SIGNALING_SERVER_URL : signalingServerURL + "/socket.io",
        name: payload.name,
        data: payload.data,
        room: payload.room,
        password: payload.password
      };

      await context.dispatch("fetchLocalStream");

      const streamConfiguration: StreamConfiguration = {
        localStream: context.state.localStream,
        isSendOnly: false
      };

      const dataChannelConfiguration = {};

      const rtcConfiguration: RtcConfiguration = {
        iceServers: await openteraWebrtcWebClient.iceServers.fetchFromServer(signalingServerURL + "/iceservers", payload.password)
      };

      context.commit(
        "setStreamClient",
        new openteraWebrtcWebClient.StreamDataChannelClient(
          signalingServerConfirguration,
          streamConfiguration,
          dataChannelConfiguration,
          rtcConfiguration,
          context.state.logger
        )
      );

      context.dispatch("connectStreamClientEvents");
    },

    connectStreamClientEvents({ state, commit }: {state: State; commit: any;}) {
      state.streamClient.onSignalingConnectionOpen;

      state.streamClient.onSignalingConnectionOpen = () => {
        // TODO
      };
      state.streamClient.onSignalingConnectionClose = async () => {
        // TODO
      };
      state.streamClient.onSignalingConnectionError = (message: string) => {
        // TODO
        alert(message);
      };
      state.streamClient.onRoomClientsChange = (clients: Array<Record<string, any>>) => {
        commit("updateClientsInRoom", clients);
      };
      state.streamClient.onAddRemoteStream = (id: string, name: string, clientData: Record<string, any>, stream: MediaStream) => {
        commit("addClientInCall", { id: id, name: name, data: clientData, stream: stream });
      };
      state.streamClient.onClientConnect = (id: string, name: string, clientData: Record<string, any>) => {
        commit("localClient/setCallState", true);
      };
      state.streamClient.onClientDisconnect = (id: string, name: string, clientData: Record<string, any>) => {
        commit("removeClientIncallById", id);
        if (state.clientsInCall.length <= 0) {
          commit("localClient/setCallState", false);
        }
      };
    },

    fetchLocalStream(context: any) {
      return openteraWebrtcWebClient.devices
        .getDefaultStream()
        .then((stream: MediaStream): void => {
          context.commit("setLocalStream", stream);
        });
    },

    connectStreamClient({ state, commit, rootState }: {state: State; commit: any; rootState: any;}) {
      return new Promise<void>(resolve => {
        state.streamClient.connect().then(() => {
          commit("localClient/setClient", {
            id: state.streamClient.id,
            name: rootState.opentera.localClient.name,
            data: rootState.opentera.localClient.data,
            room: rootState.opentera.localClient.room
          });
          resolve();
        });
      });
    },

    getSignalingServerURL() {
      return getOrigin() + getBasePath();
    }
  },

  modules: {
    localClient: ClientStore
  }
};

export default Opentera;
