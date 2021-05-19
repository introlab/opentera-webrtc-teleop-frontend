// src/store/modules/opentera/dataChannelClientStore.ts

import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import { initSignalingServerConfiguration, initRtcConfiguration, initDataChannelConfiguration } from "./init";
import { SignalingClientStore } from "./signalingClientStore";
import { DataChannelClientContext, DataChannelClientState, SignalingServerConfirguration } from "./types";

export class DataChannelClientStore extends SignalingClientStore {
    protected state(): DataChannelClientState {
        return {
            ...super.state(),
            client: null,
            onMessageEventHandler: null
        };
    };

    protected mutations() {
        return {
            ...super.mutations(),

            setMessageEventHandler(state: DataChannelClientState, payload: Function) {
                state.onMessageEventHandler = payload;
            }
        };
    };

    protected actions() {
        return {
            ...super.actions()
        }
    };

    protected async initialize(context: DataChannelClientContext, payload: SignalingServerConfirguration): Promise<void> {
        context.commit("setInitPendingState", true);

        const signalingServerConfirguration = initSignalingServerConfiguration(payload);
        const dataChannelConfiguration = initDataChannelConfiguration();
        const rtcConfiguration = await initRtcConfiguration(payload.password).catch(err => context.state.logger(err));

        context.commit(
            "setClient",
            new openteraWebrtcWebClient.DataChannelClient(
            signalingServerConfirguration,
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
        context.state.client.onDataChannelOpen = (id: string, name: string, clientData: Record<string, any>) => {
            // TODO
        };
        context.state.client.onDataChannelClose = (id: string, name: string, clientData: Record<string, any>) => {
            // TODO
        };
        context.state.client.onDataChannelMessage = (id: string, name: string, clientData: Record<string, any>, message: any) => {
            if (context.state.onMessageEventHandler) {
                context.state.onMessageEventHandler(id, name, clientData, message);
            }
        };
    }
}
