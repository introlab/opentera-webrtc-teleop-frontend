// src/store/modules/opentera.ts

//import ClientStore from "../clientStore";
import { Client, Logger, SignalingServerConfirguration, State, StreamDataChannelClient } from "./types";
import { initDataChannelConfiguration, initRtcConfiguration, initSignalingServerConfiguration, initStreamConfiguration } from "./init";
import { fetchLocalStream} from "./utils";
import { BusyException } from "./exceptions";

import openteraWebrtcWebClient from "opentera-webrtc-web-client";

import { setCookie, getCookie, SESSION_COOKIE } from "@/config/cookie";
import { useContext } from "@vue/runtime-core";

function setTemporarySessionCookie(config: SignalingServerConfirguration) {
  // Set a cookie containing the login information with max-age of 5 seconds
  setCookie(config.room + "-" + SESSION_COOKIE, JSON.stringify(config), 5)
}

const Opentera = {
  namespaced: true,
  state: (): State => ({
    isInitPending: false,
    beforeunloadEventHandler: null,
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

    setBeforeunloadEventHandler(state: State, payload: Function) {
      state.beforeunloadEventHandler = payload;
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
      //context.commit("localClient/setClient", payload);
      //context.commit("localClient/setClient", payload, {root : true});
      context.commit("localClient/setClient", {
        id: undefined,
        name: payload.name,
        data: undefined,
        room: undefined
      }, {root : true});
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

    connectStreamClientEvents({ state, commit, dispatch }: {state: State; commit: any; dispatch: any}) {
      state.streamClient.onSignalingConnectionOpen;

      state.streamClient.onSignalingConnectionOpen = () => {
        // TODO
      };
      state.streamClient.onSignalingConnectionClose = async () => {
        // TODO
      };
      state.streamClient.onSignalingConnectionError = (message: string) => {
        // TODO
        //dispatch("destroy"); // remove the beforeunload event listener
        dispatch("localClient/destroy", null, {root: true});
        alert(message);
      };
      state.streamClient.onRoomClientsChange = (clients: Array<Record<string, any>>) => {
        commit("updateClientsInRoom", clients);
      };
      state.streamClient.onAddRemoteStream = (id: string, name: string, clientData: Record<string, any>, stream: MediaStream) => {
        commit("addClientInCall", { id: id, name: name, data: clientData, stream: stream });
      };
      state.streamClient.onClientConnect = (id: string, name: string, clientData: Record<string, any>) => {
        commit("localClient/setCallState", true, { root: true });
      };
      state.streamClient.onClientDisconnect = (id: string, name: string, clientData: Record<string, any>) => {
        commit("removeClientIncallById", id);
        if (state.clientsInCall.length <= 0) {
          commit("localClient/setCallState", false, { root: true });
        }
      };
    },

    connectStreamClient({ state, commit, rootState }: {state: State; commit: any; rootState: any;}) {
      // return new Promise<void>(resolve => {
      //   state.streamClient.connect().then(() => {
      //     commit("localClient/setClient", {
      //       id: state.streamClient.id,
      //       // name: rootState.opentera.localClient.name,
      //       // data: rootState.opentera.localClient.data,
      //       // room: rootState.opentera.localClient.room
      //       name: rootState.localClient.name,
      //       data: rootState.localClient.data,
      //       room: rootState.localClient.room
      //     }, {root: true});
      //     resolve();
      //   });
      // });
      return new Promise<void>(resolve => {
        state.streamClient.connect().then(() => resolve());
      });
    },

    initAndConnect(context: any, payload: SignalingServerConfirguration) {
      return new Promise<void>((resolve, reject) => {
        if (context.state.streamClient === null && !context.state.isInitPending) {
        
          context.commit("setBeforeunloadEventHandler", () => {
            setTemporarySessionCookie(payload);
          });

          window.addEventListener("beforeunload", context.state.beforeunloadEventHandler);

          // Check if there is a cookie with the login information
          let cookie = getCookie(SESSION_COOKIE);
    
          if (cookie) // Check for empty string
            cookie = JSON.parse(cookie);

          if (cookie) { // Check for null
            payload = cookie as SignalingServerConfirguration;
          } else {
            payload = {
              name: payload.name ? payload.name : "Undefined",
              data: payload.data ? payload.data : {},
              room: payload.room ? payload.room : "chat",
              password: payload.password
            }
          }

          context.dispatch("initialize", payload).then(() => {
            context.dispatch("connectStreamClient").then(() => resolve());
          })

        } else {
          reject(new BusyException("Already connect or in process of connecting"));
        }
      });
    },

    destroy(context: any) {
      window.removeEventListener("beforeunload", context.state.beforeunloadEventHandler);
    }
  },

  modules: {
    //localClient: ClientStore
  }
};

export default Opentera;
