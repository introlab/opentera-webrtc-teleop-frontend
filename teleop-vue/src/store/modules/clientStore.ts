// src/store/modules/clientStore.ts

export interface Client {
  id?: string;
  name?: string;
  data?: Record<string, any>; // TODO define data interface
  room?: string;
  stream?: Record<string, any>;
  isInCall: boolean;
  isMuted: boolean;
  isCameraOn: boolean;
}

export function copyAttribute<T, K extends keyof T>(obj1: T, obj2: T, key: K) {
  obj1[key] = obj2[key];
}

export function copyAttributes<T>(copy: T, original: T) {
  for (const key in original) {
    if(original[key as keyof T])
      copyAttribute(copy, original, key as keyof T);
  }
}

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
          track.enabled = context.state.isMuted;
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
