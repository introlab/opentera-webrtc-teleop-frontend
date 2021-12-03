// src/store/modules/opentera/streamClient.ts

import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import { fetchLocalStream } from ".";
import {
  initRtcConfiguration,
  initSignalingServerConfiguration,
  initStreamConfiguration
} from "./init";
import { SignalingClientStore } from "./signalingClientStore";
import {
  Client,
  SignalingClientContext,
  SignalingServerConfiguration,
  StreamClientContext,
  StreamClientState
} from "./types";

export class StreamClientStore extends SignalingClientStore {
  canSendStream: boolean;

  constructor(canSendStream: boolean) {
    super();

    this.canSendStream = canSendStream;
  }

  protected state(): StreamClientState {
    return {
      ...super.state(),
      client: null,
      localStream: null,
      showParticipants: false,
      cameraDisplayMode: 0,
      showControls: true,
      clientsInCall: []
    };
  }

  protected mutations() {
    return {
      ...super.mutations(),

      setLocalStream(state: StreamClientState, payload: MediaStream) {
        state.localStream = payload;
      },

      addClientInCall(state: StreamClientState, payload: Client) {
        state.clientsInCall.push(payload);
      },

      removeClientIncallById(state: StreamClientState, payload: string) {
        state.clientsInCall = state.clientsInCall.filter(
          client => client.id !== payload
        );
      },

      toggleParticipantsList(state: StreamClientState) {
        state.showParticipants = !state.showParticipants;
      },

      toggleCameraDisplayMode(state: StreamClientState) {
        state.cameraDisplayMode = (state.cameraDisplayMode + 1) % 3;
      },

      toggleShowControls(state: StreamClientState) {
        state.showControls = !state.showControls;
      }
    };
  }

  protected async initialize(
    context: StreamClientContext,
    payload: SignalingServerConfiguration
  ) {
    context.commit("setInitPendingState", true);

    if (this.canSendStream) {
      // Commented to allow videoconf to connect without a local feed
      context.commit("setLocalStream", await fetchLocalStream());
    }

    const signalingServerConfiguration = initSignalingServerConfiguration(
      payload
    );
    const streamConfiguration = initStreamConfiguration(
      context.state.localStream as MediaStream
    );
    const rtcConfiguration = await initRtcConfiguration(
      payload.password
    ).catch(err => context.state.logger(err));

    context.commit(
      "setClient",
      new openteraWebrtcWebClient.StreamClient(
        signalingServerConfiguration,
        streamConfiguration,
        rtcConfiguration,
        context.state.logger
      )
    );

    await context.dispatch("connectClientEvents");
    context.commit("setInitPendingState", false);
  }

  protected async connectClientEvents(context: SignalingClientContext) {
    super.connectClientEvents(context);
    context.state.client.onAddRemoteStream = (
      id: string,
      name: string,
      clientData: Record<string, any>,
      stream: MediaStream
    ) => {
      context.commit("addClientInCall", {
        id: id,
        name: name,
        data: clientData,
        stream: stream
      });
    };
  }

  protected onClientDisconnect(
    context: SignalingClientContext,
    id: string,
    name: string,
    clientData: Record<string, any>
  ) {
    super.onClientDisconnect(context, id, name, clientData);
    context.commit("removeClientIncallById", id);
  }
}
