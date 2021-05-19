// src/store/modules/opentera/clientStore.ts

import { getCookie, SESSION_COOKIE } from "@/config/cookie";
import { StreamClientStore, DataChannelClientStore } from "./opentera";
import { Client, SignalingServerConfirguration } from "./opentera/types";
import { copyAttributes } from "./opentera/utils";

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
    async start(context: any, payload: SignalingServerConfirguration) {
      
      context.commit("setClient", {
        id: undefined,
        name: payload.name,
        data: payload.data,
        room: undefined
      });

      // Create different configuration for different room
      const videoConfSignalingServerConfirguaration: SignalingServerConfirguration = {
        name: payload.name + "-" + "VideoConf",
        data: payload.data,
        room: "VideoConf",
        password: payload.password
      };
      
      const cameraXSignalingServerConfirguaration: SignalingServerConfirguration = {
        name: payload.name + "-" + "CameraX",
        data: payload.data,
        room: "CameraX",
        password: payload.password
      }
      
      const mapSignalingServerConfirguaration: SignalingServerConfirguration = {
        name: payload.name + "-" + "Map",
        data: payload.data,
        room: "Map",
        password: payload.password
      };
      
      const messagingSignalingServerConfirguaration: SignalingServerConfirguration = {
        name: payload.name + "-" + "Messaging",
        data: payload.data,
        room: "Messaging",
        password: payload.password
      };
      
      const teleopSignalingServerConfirguaration: SignalingServerConfirguration = {
        name: payload.name + "-" + "Teleop",
        data: payload.data,
        room: "Teleop",
        password: payload.password
      };

      // Temporary name persitence on refreshing the page
      let cookie = getCookie(SESSION_COOKIE);
      if (cookie) {
        cookie = JSON.parse(cookie);
        if (cookie) {
          context.commit("setClient", {
            name: (cookie as SignalingServerConfirguration).name
          })
        }
      }

      context.dispatch("openteraVideoConf/start", videoConfSignalingServerConfirguaration).then(() => console.log("VIDEO CONF CONNECTED"));
      context.dispatch("openteraCameraX/start", cameraXSignalingServerConfirguaration).then(() => console.log("CAMERA X CONNECTED"));
      context.dispatch("openteraTeleop/start", teleopSignalingServerConfirguaration).then(() => console.log("TELEOP CONNECTED"));
    },

    // TODO: Make call functions more consistent
    // A function for each type of call? A big function to call everyone?
    // Make it better.
    toggleCall(context: any) {
      return new Promise<void>((resolve, reject) => {
        
        if (!context.state.openteraVideoConf.client) {
          reject(new Error("Unable to call, you are not connected."));
          return;
        }

        if (context.state.openteraVideoConf.clientsInRoom.length < 2) {
          reject(new Error("There are no participants to call."));
          return;
        }
        
        context.commit("setCallState", !context.state.isInCall);
        
        context.state.isInCall ? context.state.openteraVideoConf.client.callAll() : context.state.openteraVideoConf.client.hangUpAll();
        context.state.isInCall ? context.state.openteraCameraX.client.callAll() : context.state.openteraCameraX.client.hangUpAll();
        context.state.isInCall ? context.state.openteraTeleop.client.callAll() : context.state.openteraTeleop.client.hangUpAll();
        resolve();
      })
    },

    toggleMute(context: any) {
      return new Promise<void>((resolve, reject) => {
        if (!context.state.openteraVideoConf.localStream) {
          reject(new Error("Unable to toggle the mic options, you are not streaming."));
          return;
        }

        context.commit("setMuteState", !context.state.isMuted);
        context.state.openteraVideoConf.localStream.getAudioTracks().forEach((track: any) => {
          track.enabled = !context.state.isMuted;
        });
        resolve();
      });
    },

    toggleCamera(context: any) {
      return new Promise<void>((resolve, reject) => {
        if (!context.state.openteraVideoConf.localStream) {
          reject(new Error("Unable to toggle the camera options, you are not streaming."));
          return;
        }

        context.commit("setCameraState", !context.state.isCameraOn);
        context.state.openteraVideoConf.localStream.getVideoTracks().forEach((track: any) => {
          track.enabled = context.state.isCameraOn;
        });
        resolve();
      });
    }
  },
  modules: {
    openteraVideoConf: new StreamClientStore(true).getModule(),
    openteraCameraX: new StreamClientStore(false).getModule(),
    openteraTeleop: new DataChannelClientStore().getModule()
  }
};

export default ClientStore;
