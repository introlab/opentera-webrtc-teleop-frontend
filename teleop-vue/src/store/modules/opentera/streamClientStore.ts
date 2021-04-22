// src/store/modules/opentera/streamClient.ts

import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import { fetchLocalStream } from ".";
import { initRtcConfiguration, initSignalingServerConfiguration, initStreamConfiguration } from "./init";
import { SignalingClientStore } from "./signalingClientStore";
import { Client, SignalingClientContext, SignalingServerConfirguration, StreamClientContext, StreamClientState } from "./types";

export class StreamClientStore extends SignalingClientStore {
    protected state(): StreamClientState {
        return {
            ...super.state(),
            client: null,
            localStream: null,
            showParticipants: false,
            clientsInCall: []
        };
    };

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
                state.clientsInCall = state.clientsInCall.filter(client => client.id !== payload);
            },

            toggleParticipantsList(state: StreamClientState) {
                state.showParticipants = !state.showParticipants;
            }
        };
    };

    protected async initialize(context: StreamClientContext, payload: SignalingServerConfirguration): Promise<void> {
        context.commit("setInitPendingState", true);
        context.commit("setLocalStream", await fetchLocalStream());

        const signalingServerConfirguration = initSignalingServerConfiguration(payload);
        const streamConfiguration = initStreamConfiguration(context.state.localStream as MediaStream);
        const rtcConfiguration = await initRtcConfiguration(payload.password).catch(err => context.state.logger(err));

        context.commit(
            "setClient",
            new openteraWebrtcWebClient.StreamClient(
            signalingServerConfirguration,
            streamConfiguration,
            rtcConfiguration,
            context.state.logger
            )
        );

        context.dispatch("connectClientEvents");
        context.commit("setInitPendingState", false);
    }

    protected connectClientEvents(context: SignalingClientContext) {
        super.connectClientEvents(context);
        context.state.client.onAddRemoteStream = (id: string, name: string, clientData: Record<string, any>, stream: MediaStream) => {
            context.commit("addClientInCall", { id: id, name: name, data: clientData, stream: stream });
        };
    }

    protected onClientDisconnect(context: SignalingClientContext, id: string, name: string, clientData: Record<string, any>) {
        super.onClientDisconnect(context, id, name, clientData);
        context.commit("removeClientIncallById", id);
    }
}