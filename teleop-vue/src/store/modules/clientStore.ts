// src/store/modules/opentera/clientStore.ts

import { getCookie, SESSION_COOKIE } from "@/config/cookie";
import { StreamClientStore, DataChannelClientStore } from "./opentera";
import { Client, ClientContext, ClientState, SignalingServerConfiguration } from "./opentera/types";
import { copyAttributes } from "./opentera/utils";

const ClientStore = {
  namespaced: true,
  state: {
    id: undefined,
    name: undefined,
    data: undefined,
    room: undefined,
    stream: undefined,
    isInCall: false,
    isMuted: false,
    isCameraOn: true,
  } as ClientState,
  mutations: {
    setClient(state: Client, payload: Client) {
      copyAttributes(state, payload);
    },

    setCallState(state: Client, isInCall: boolean) {
      state.isInCall = isInCall;
    },

    setMuteState(state: Client, isMuted: boolean) {
      state.isMuted = isMuted;
    },

    setCameraState(state: Client, isCameraOn: boolean) {
      state.isCameraOn = isCameraOn;
    },
  },
  actions: {
    async start(context: ClientContext, payload: SignalingServerConfiguration) {
      context.commit("setClient", {
        id: undefined,
        name: payload.name ? payload.name : "Undefined",
        data: payload.data,
        room: undefined,
      });

      // Create different configuration for different room
      const videoConfSignalingServerConfiguration: SignalingServerConfiguration = {
        name: payload.name,
        data: payload.data,
        room: "VideoConf",
        password: payload.password,
      };

      const cameraXSignalingServerConfiguration: SignalingServerConfiguration = {
        name: payload.name,
        data: payload.data,
        room: "CameraX",
        password: payload.password,
      };

      const mapSignalingServerConfiguration: SignalingServerConfiguration = {
        name: payload.name,
        data: payload.data,
        room: "Map",
        password: payload.password,
      };

      const teleopSignalingServerConfiguration: SignalingServerConfiguration = {
        name: payload.name,
        data: payload.data,
        room: "Teleop",
        password: payload.password,
      };

      // Temporary name persistence on refreshing the page
      // TODO: remove cookie
      let cookie = getCookie(SESSION_COOKIE);
      if (cookie) {
        cookie = JSON.parse(cookie);
        if (cookie) {
          context.commit("setClient", {
            name: (cookie as SignalingServerConfiguration).name,
          });
        }
      }

      try {
        await context.dispatch(
          "openteraVideoConf/start",
          videoConfSignalingServerConfiguration
        );
        await context.dispatch(
          "openteraCameraX/start",
          cameraXSignalingServerConfiguration
        );
        await context.dispatch(
          "openteraMap/start",
          mapSignalingServerConfiguration
        );
        await context.dispatch(
          "openteraTeleop/start",
          teleopSignalingServerConfiguration
        );
      } catch (err) {
        if(process.env.NODE_ENV != "production")
        {
          // eslint-disable-next-line no-console
          console.log(err);
        } 
        throw err;
      }
      // TODO: Messaging signaling client
    },
  
    toggleCamera(context: ClientContext) {
      return new Promise<void>((resolve, reject) => {
        if (!context.state.openteraVideoConf.localStream) {
          reject(
            new Error(
              "Unable to toggle the camera options, you are not streaming."
            )
          );
          return;
        }

        context.commit("setCameraState", !context.state.isCameraOn);
        context.state.openteraVideoConf.localStream
          .getVideoTracks()
          .forEach((track: MediaStreamTrack) => {
            track.enabled = context.state.isCameraOn ?? false;
          });
        resolve();
      });
    },
  },
  modules: {
    openteraVideoConf: new StreamClientStore(true).getModule(),
    openteraCameraX: new StreamClientStore(false).getModule(),
    openteraMap: new StreamClientStore(false).getModule(),
    openteraTeleop: new DataChannelClientStore().getModule(),
  },
};

export default ClientStore;
