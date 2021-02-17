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
    isCameraOn: false
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
  actions: {},
  modules: {}
};

export default ClientStore;
