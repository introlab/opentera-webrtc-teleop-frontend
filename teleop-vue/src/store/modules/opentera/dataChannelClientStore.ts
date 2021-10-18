// src/store/modules/opentera/dataChannelClientStore.ts

import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import {
  initSignalingServerConfiguration,
  initRtcConfiguration,
  initDataChannelConfiguration
} from "./init";
import { SignalingClientStore } from "./signalingClientStore";
import {
  DataChannelClientContext,
  DataChannelClientState,
  SignalingServerConfiguration
} from "./types";

export class DataChannelClientStore extends SignalingClientStore {
  protected state(): DataChannelClientState {
    return {
      ...super.state(),
      client: null,
      onMessageEventHandler: null,
      batteryLevel: 0,
      signalStrength: 0,
      waypointReached: 0
    };
  }

  protected mutations() {
    return {
      ...super.mutations(),

      setMessageEventHandler(state: DataChannelClientState, payload: Function) {
        state.onMessageEventHandler = payload;
      },
      changeBatteryLevel(state: DataChannelClientState, payload: number) {
        state.batteryLevel = payload;
      },
      changeSignalStrength(state: DataChannelClientState, payload: number) {
        state.signalStrength = payload;
      },
      changeWaypointReached(state: DataChannelClientState, payload: number) {
        state.waypointReached = payload;
      }
    };
  }

  protected actions() {
    return {
      ...super.actions()
    };
  }

  protected async initialize(
    context: DataChannelClientContext,
    payload: SignalingServerConfiguration
  ): Promise<void> {
    context.commit("setInitPendingState", true);

    const signalingServerConfiguration = initSignalingServerConfiguration(
      payload
    );
    const dataChannelConfiguration = initDataChannelConfiguration();
    const rtcConfiguration = await initRtcConfiguration(
      payload.password
    ).catch(err => context.state.logger(err));

    context.commit(
      "setClient",
      new openteraWebrtcWebClient.DataChannelClient(
        signalingServerConfiguration,
        dataChannelConfiguration,
        rtcConfiguration,
        context.state.logger
      )
    );

    context.dispatch("connectClientEvents");
    context.commit("setInitPendingState", false);
  }

  protected connectClientEvents(context: DataChannelClientContext) {
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
