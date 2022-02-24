// src/store/modules/opentera/dataChannelClientStore.ts

import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import { RobotStatus } from ".";
import {
  initSignalingServerConfiguration,
  initRtcConfiguration,
  initDataChannelConfiguration,
} from "./init";
import { SignalingClientStore } from "./signalingClientStore";
import {
  DataChannelClientContext,
  DataChannelClientState,
  SignalingServerConfiguration,
} from "./types";

export class DataChannelClientStore extends SignalingClientStore {
  protected state(): DataChannelClientState {
    return {
      ...super.state(),
      client: null,
      onMessageEventHandler: null,
      status: {
        isCharging: false,
        batteryVoltage: 0,
        batteryCurrent: 0,
        batteryLevel: 0,
        cpuUsage: 0,
        memUsage: 0,
        diskUsage: 0,
        wifiNetwork: "",
        wifiStrength: 0,
        localIp: "",
        isMuted: false,
        isCameraOn: true,
      },
      waypointReached: 0,
      dockingStatus: "",
      labelHandling: {
        labels: [
          {
            value: "",
            text: "",
          },
        ],
        labelsDesc: {
          "": "",
        },
        changedCb: null,
      },
    };
  }

  protected mutations() {
    return {
      ...super.mutations(),

      setMessageEventHandler(state: DataChannelClientState, payload: Function) {
        state.onMessageEventHandler = payload;
      },
      changeRobotStatus(state: DataChannelClientState, payload: RobotStatus) {
        state.status.isCharging = payload.isCharging;
        state.status.batteryVoltage = payload.batteryVoltage;
        state.status.batteryCurrent = payload.batteryCurrent;
        state.status.batteryLevel = payload.batteryLevel;
        state.status.cpuUsage = payload.cpuUsage;
        state.status.memUsage = payload.memUsage;
        state.status.diskUsage = payload.diskUsage;
        state.status.wifiNetwork = payload.wifiNetwork;
        state.status.wifiStrength = payload.wifiStrength;
        state.status.localIp = payload.localIp;
        state.status.isMuted = payload.isMuted;
        state.status.isCameraOn = payload.isCameraOn;
      },
      changeWaypointReached(state: DataChannelClientState, payload: number) {
        state.waypointReached = payload;
      },
      updateDockingStatus(state: DataChannelClientState, payload: string) {
        state.dockingStatus = payload;
      },
      toggleRobotMute(state: DataChannelClientState) {
        state.status.isMuted = !state.status.isMuted;
      },
      toggleRobotCamera(state: DataChannelClientState) {
        state.status.isCameraOn = !state.status.isCameraOn;
      },
      updateLabels(state: DataChannelClientState, payload: Array<Record<string, string>>) {
        const newLabels = payload.filter((l) => !state.labelHandling.labels.some((l2) => l2.value === l.name));
        const removedLabels = state.labelHandling.labels.filter((l) => l.value !== "" && !payload.some((l2) => l2.name === l.value));
        const commonLabels = payload.filter((l) => state.labelHandling.labels.some((l2) => l2.value === l.name));
        let changed = false;
        for (const label of removedLabels) {
          changed = true;
          state.labelHandling.labels.splice(state.labelHandling.labels.indexOf(label), 1);
          delete state.labelHandling.labelsDesc[label.value];
        }
        for (const label of newLabels) {
          changed = true;
          state.labelHandling.labels.push({ value: label.name, text: label.name });
          state.labelHandling.labelsDesc[label.name] = label.description;
        }
        for (const label of commonLabels) {
          state.labelHandling.labelsDesc[label.name] = label.description;
        }
        if (changed && state.labelHandling.changedCb) {
          state.labelHandling.changedCb();
        }
      },
    };
  }

  protected actions() {
    return {
      ...super.actions(),
    };
  }

  protected async initialize(
    context: DataChannelClientContext,
    payload: SignalingServerConfiguration
  ) {
    context.commit("setInitPendingState", true);

    const signalingServerConfiguration = initSignalingServerConfiguration(
      payload
    );
    const dataChannelConfiguration = initDataChannelConfiguration();
    const rtcConfiguration = await initRtcConfiguration(
      payload.password
    ).catch((err) => context.state.logger(err));

    context.commit(
      "setClient",
      new openteraWebrtcWebClient.DataChannelClient(
        signalingServerConfiguration,
        dataChannelConfiguration,
        rtcConfiguration,
        context.state.logger
      )
    );

    await context.dispatch("connectClientEvents");
    context.commit("setInitPendingState", false);
  }

  protected async connectClientEvents(context: DataChannelClientContext) {
    super.connectClientEvents(context);
    context.state.client.onDataChannelOpen = (
      id: string,
      name: string,
      clientData: Record<string, any>
    ) => {
      // TODO
    };
    context.state.client.onDataChannelClose = (
      id: string,
      name: string,
      clientData: Record<string, any>
    ) => {
      // TODO
    };
    context.state.client.onDataChannelMessage = (
      id: string,
      name: string,
      clientData: Record<string, any>,
      message: string
    ) => {
      if (context.state.onMessageEventHandler) {
        context.state.onMessageEventHandler(id, name, clientData, message);
      }
    };
  }
}
