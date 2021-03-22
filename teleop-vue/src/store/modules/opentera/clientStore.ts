// src/store/modules/opentera/clientStore.ts

import { Client } from "./types";
import { copyAttributes } from "./utils";

const ClientStore = {
  namespaced: true,
  state: (): Client => ({
    id: undefined,
    name: undefined,
    data: undefined,
    room: undefined,
    stream: undefined,
    isInCall: false,
    isMuted: false,
    isCameraOn: true
  }),
  mutations: {
    setClient(state: Client, payload: Client) {
      copyAttributes(state, payload);
    },
    
    setCallState(state: Client, isInCall: boolean) {
      state.isInCall = isInCall;
    },

    setMuteState(state: Client, isMuted: boolean) {
      state.isMuted = isMuted
    },

    setCameraState(state: Client, isCameraOn: boolean) {
      state.isCameraOn = isCameraOn;
    }
  },
  actions: {
    toggleCall(context: any) {
      return new Promise<void>((resolve, reject) => {
        if (!context.rootState.opentera.streamClient) {
          reject(new Error("Unable to call, you are not connected."));
          return;
        }

        if (context.rootState.opentera.clientsInRoom.length < 2) {
          reject(new Error("There are no participants to call."));
          return;
        }
        
        context.commit("setCallState", !context.state.isInCall);
        context.state.isInCall ? context.rootState.opentera.streamClient.callAll() : context.rootState.opentera.streamClient.hangUpAll();
        resolve();
      })
    },

    toggleMute(context: any) {
      return new Promise<void>((resolve, reject) => {
        if (!context.rootState.opentera.localStream) {
          reject(new Error("Unable to toggle the mic options, you are not streaming."));
          return;
        }

        context.commit("setMuteState", !context.state.isMuted);
        context.rootState.opentera.localStream.getAudioTracks().forEach((track: any) => {
          track.enabled = !context.state.isMuted;
        });
        resolve();
      });
    },

    toggleCamera(context: any) {
      return new Promise<void>((resolve, reject) => {
        if (!context.rootState.opentera.localStream) {
          reject(new Error("Unable to toggle the camera options, you are not streaming."));
          return;
        }

        context.commit("setCameraState", !context.state.isCameraOn);
        context.rootState.opentera.localStream.getVideoTracks().forEach((track: any) => {
          track.enabled = context.state.isCameraOn;
        });
        resolve();
      });
    }
  },
  modules: {}
};

export default ClientStore;
