// src/store/modules/opentera/rosbridgeDataChannelClientStore.ts

import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import {
  initSignalingServerConfiguration,
  initRtcConfiguration,
  initDataChannelConfiguration,
} from "./init";
import { SignalingClientStore } from "./signalingClientStore";
import {
  DataChannelClientContext,
  SignalingClientRoom,
  SignalingServerConfiguration
} from "./types";

export class RosbridgeDataChannelClientStore extends SignalingClientStore {
  protected state(): SignalingClientRoom {
    return {
      ...super.state(),
      client: null,
    };
  }

  protected mutations() {
    return {
      ...super.mutations(),
    };
  }

  protected actions() {
    return {
      ...super.actions(),
      async init(context: any, config: SignalingServerConfiguration) {
        try {
          config = await SignalingClientStore.cookieHandler(context, config);
          await context.dispatch("initialize", config);
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
      async connect(context: any) {
        try {
          await context.dispatch("connectClient");
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
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
