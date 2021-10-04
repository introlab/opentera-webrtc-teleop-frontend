// src/store/modules/opentera/clientStore.ts

import { getCookie, SESSION_COOKIE } from "@/config/cookie";
import { StreamClientStore, DataChannelClientStore } from "./opentera";
import { Client, SignalingServerConfiguration } from "./opentera/types";
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
      state.isMuted = isMuted;
    },

    setCameraState(state: Client, isCameraOn: boolean) {
      state.isCameraOn = isCameraOn;
    }
  },
  actions: {
    async start(context: any, payload: SignalingServerConfiguration) {
      context.commit("setClient", {
        id: undefined,
        name: payload.name ? payload.name : "Undefined",
        data: payload.data,
        room: undefined
      });

      // Create different configuration for different room
      const videoConfSignalingServerConfiguration: SignalingServerConfiguration = {
        //TODO: fix typo
        name: payload.name,
        data: payload.data,
        room: "VideoConf",
        password: payload.password
      };

      const cameraXSignalingServerConfiguration: SignalingServerConfiguration = {
        name: payload.name,
        data: payload.data,
        room: "CameraX",
        password: payload.password
      };

      const mapSignalingServerConfiguration: SignalingServerConfiguration = {
        name: payload.name,
        data: payload.data,
        room: "Map",
        password: payload.password
      };

      const messagingSignalingServerConfiguration: SignalingServerConfiguration = {
        name: payload.name,
        data: payload.data,
        room: "Messaging",
        password: payload.password
      };

      const teleopSignalingServerConfiguration: SignalingServerConfiguration = {
        name: payload.name,
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
            name: (cookie as SignalingServerConfiguration).name
          });
        }
      }

      context
        .dispatch(
          "openteraVideoConf/start",
          videoConfSignalingServerConfiguration
        )
        .then(() => console.log("VIDEO CONF CONNECTED"));
      context
        .dispatch("openteraCameraX/start", cameraXSignalingServerConfiguration)
        .then(() => console.log("CAMERA X CONNECTED"));
      context
        .dispatch("openteraTeleop/start", teleopSignalingServerConfiguration)
        .then(() => console.log("TELEOP CONNECTED"));
      // TODO: add Map signaling client and Messaging signaling client
    },

    // TODO: Make call functions more consistent
    // A function for each type of call? A big function to call everyone?
    // Make it better.
    toggleCall(context: any) {
      return new Promise<void>((resolve, reject) => {
        context.commit("setCallState", !context.state.isInCall);

        Promise.all([
          context.dispatch("toggleCallVideoConf").catch((err: any) => {
            return err;
          }),
          context.dispatch("toggleCallCameraX").catch((err: any) => {
            return err;
          }),
          context.dispatch("toggleCallTeleop").catch((err: any) => {
            return err;
          })
        ]).then(errors => {
          errors.forEach(error => {
            if (error) {
              // TODO: Handle error
              console.warn(error);
            }
          });
          resolve();
        });
      });
    },

    toggleCallVideoConf(context: any) {
      return new Promise<void>((resolve, reject) => {
        if (!context.state.openteraVideoConf.client) {
          reject(
            new Error("VideoConf: Unable to call, you are not connected.")
          );
        }

        if (context.state.openteraVideoConf.clientsInRoom.length < 2) {
          reject(new Error("VideoConf: There are no participants to call."));
        }

        context.state.isInCall
          ? context.state.openteraVideoConf.client.callAll()
          : context.state.openteraVideoConf.client.hangUpAll();
        resolve();
      });
    },

    toggleCallCameraX(context: any) {
      return new Promise<void>((resolve, reject) => {
        if (!context.state.openteraCameraX.client) {
          reject(new Error("CameraX: Unable to call, you are not connected."));
        }

        if (context.state.openteraCameraX.clientsInRoom.length < 2) {
          reject(new Error("CameraX: There are no participants to call."));
        }

        context.state.isInCall
          ? context.state.openteraCameraX.client.callAll()
          : context.state.openteraCameraX.client.hangUpAll();
        resolve();
      });
    },

    toggleCallTeleop(context: any) {
      return new Promise<void>((resolve, reject) => {
        if (!context.state.openteraTeleop.client) {
          reject(new Error("Teleop: Unable to call, you are not connected."));
        }

        if (context.state.openteraTeleop.clientsInRoom.length < 2) {
          reject(new Error("Teleop: There are no participants to call."));
        }

        context.state.isInCall
          ? context.state.openteraTeleop.client.callAll()
          : context.state.openteraTeleop.client.hangUpAll();
        resolve();
      });
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
    }
  },
  modules: {
    openteraVideoConf: new StreamClientStore(true).getModule(),
    openteraCameraX: new StreamClientStore(false).getModule(),
    openteraTeleop: new DataChannelClientStore().getModule()
  }
};

export default ClientStore;
