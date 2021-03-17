// src/store/modules/opentera.ts

import ClientStore from "./clientStore";
import { Client, Logger, SignalingServerConfirguration, State, StreamDataChannelClient } from "./types";
import { initDataChannelConfiguration, initRtcConfiguration, initSignalingServerConfiguration, initStreamConfiguration } from "./init";
import { fetchLocalStream } from "./utils";

import openteraWebrtcWebClient from "opentera-webrtc-web-client";

const Opentera = {
  namespaced: true,
  state: (): State => ({
    isInitPending: false,
    localStream: null,
    streamClient: null,
    logger: (...args) => console.log(...args),
    clientsInRoom: [],
    clientsInCall: [],
    showParticipants: false
  }),

  mutations: {
    setInitPendingState(state: State, payload: boolean) {
      state.isInitPending = payload;
    },

    setLocalStream(state: State, payload: MediaStream) {
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
      
      context.commit("setInitPendingState", true);
      context.commit("localClient/setClient", payload);
      context.commit("setLocalStream", await fetchLocalStream());

      const signalingServerConfirguration = initSignalingServerConfiguration(payload);
      const streamConfiguration = initStreamConfiguration(context.state.localStream);
      const dataChannelConfiguration = initDataChannelConfiguration();
      const rtcConfiguration = await initRtcConfiguration(payload.password).catch(err => context.state.logger(err));

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
      context.commit("setInitPendingState", false);
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
    }
  },

  modules: {
    localClient: ClientStore
  }
};

export default Opentera;
