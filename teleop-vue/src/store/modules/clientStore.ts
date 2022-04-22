// src/store/modules/opentera/clientStore.ts

import { getCookie, SESSION_COOKIE } from "@/config/cookie";
import { StreamClientStore, DataChannelClientStore, RosbridgeDataChannelClientStore } from "./opentera";
import { Client, SignalingServerConfiguration } from "./opentera/types";
import { copyAttributes } from "./opentera/utils";
import Ros from "@/ros/Ros";

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
    isCameraOn: true,
  }),
  mutations: {
    setClient(state: Client, payload: Client) {
      copyAttributes(state, payload);
    },

    setRos(state: Client, payload: Ros) {
      if (!state.data) {
        state.data = {};
      }
      state.data.ros = payload;
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
    async start(context: any, payload: SignalingServerConfiguration) {
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

      const messagingSignalingServerConfiguration: SignalingServerConfiguration = {
        name: payload.name,
        data: payload.data,
        room: "Messaging",
        password: payload.password,
      };

      const teleopSignalingServerConfiguration: SignalingServerConfiguration = {
        name: payload.name,
        data: payload.data,
        room: "Teleop",
        password: payload.password,
      };

      const rosbridgeSignalingServerConfiguration: SignalingServerConfiguration = {
        name: payload.name,
        data: payload.data,
        room: "rosbridge",
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
        console.log("VIDEO CONF CONNECTED");
        await context.dispatch(
          "openteraCameraX/start",
          cameraXSignalingServerConfiguration
        );
        console.log("CAMERA X CONNECTED");
        await context.dispatch(
          "openteraMap/start",
          mapSignalingServerConfiguration
        );
        console.log("MAP CONNECTED");
        await context.dispatch(
          "openteraTeleop/start",
          teleopSignalingServerConfiguration
        );
        console.log("TELEOP CONNECTED");
        await context.dispatch(
          "openteraRosbridge/init",
          rosbridgeSignalingServerConfiguration
        );
        context.commit("setRos", new Ros({
          transportLibrary: context.state.openteraRosbridge.client,
        }));
        await context.dispatch(
          "openteraRosbridge/connect",
        );
        console.log("ROSBRIDGE CONNECTED");
      } catch (err) {
        console.log(err);
        throw err;
      }
      // TODO: Messaging signaling client
    },

    toggleMute(context: any) {
      return new Promise<void>((resolve, reject) => {
        if (!context.state.openteraVideoConf.localStream) {
          reject(
            new Error(
              "Unable to toggle the mic options, you are not streaming."
            )
          );
          return;
        }

        context.commit("setMuteState", !context.state.isMuted);
        context.state.openteraVideoConf.localStream
          .getAudioTracks()
          .forEach((track: any) => {
            track.enabled = !context.state.isMuted;
          });
        resolve();
      });
    },

    toggleCamera(context: any) {
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
          .forEach((track: any) => {
            track.enabled = context.state.isCameraOn;
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
    openteraRosbridge: new RosbridgeDataChannelClientStore().getModule(),
  },
};

export default ClientStore;
