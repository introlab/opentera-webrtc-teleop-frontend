// src/store/modules/opentera/signalingClientStore.ts

import { getCookie, SESSION_COOKIE, setCookie } from "@/config/cookie";
import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import { BusyException } from ".";

import { Logger, RoomClient, SignalingClientContext, SignalingClientRoom, SignalingServerConfirguration } from "./types";

export abstract class SignalingClientStore {
    protected state(): SignalingClientRoom {
        return {
            isInitPending: false,
            beforeunloadEventHandler: null,
            logger: (...args) => console.log(...args),
            client: undefined,
            clientsInRoom: [],
            //clientsInCall: []
            numberClientsInCall: 0,
            inCallState: false
        };
    };

    protected getters() {
        return {};
    };

    protected mutations() {
        return {
            setInitPendingState(state: SignalingClientRoom, payload: boolean) {
                state.isInitPending = payload;
            },
        
            setBeforeunloadEventHandler(state: SignalingClientRoom, payload: Function) {
                state.beforeunloadEventHandler = payload;
            },

            setClient(state: SignalingClientRoom, payload: openteraWebrtcWebClient.SignalingClient) {
                state.client = payload;
            },
        
            setLogger(state: SignalingClientRoom, payload: Logger) {
                state.logger = payload;
            },
        
            updateClientsInRoom(state: SignalingClientRoom, payload: Array<RoomClient>) {
                state.clientsInRoom = payload;
            },
        
            incrementClientsInCall(state: SignalingClientRoom) {
                state.numberClientsInCall++;
            },
        
            decrementClientInCall(state: SignalingClientRoom) {
                state.numberClientsInCall--;
            },
        
            setCallAcceptor(state: SignalingClientRoom, payload: () => boolean) {
                state.client.callAcceptor = payload;
            },

            setCallState(state: SignalingClientRoom, payload: boolean) {
                state.inCallState = payload;
            }
        };
    };

    protected actions() {
        /* eslint-disable @typescript-eslint/no-this-alias */
        const self = this;
        return {
            connectClientEvents(context: SignalingClientContext) {
                self.connectClientEvents(context);
            },

            start(context: any, config: SignalingServerConfirguration) {
                return new Promise<void>((resolve, reject)=> {
                    SignalingClientStore.cookieHandler(context, config)
                        .then((config: SignalingServerConfirguration) => {
                            context.dispatch("initialize", config).then(() => {
                                context.dispatch("connectClient").then(() => resolve());
                            });
                        })
                        .catch((err: BusyException) => {
                            reject(err);
                        });
                });
            },

            initialize(context: SignalingClientContext, config: SignalingServerConfirguration) {
                return new Promise<void>(resolve => {
                    self.initialize(context, config).then(() => resolve());
                });
            },

            connectClient({ state }: {state: SignalingClientRoom}) {
                return new Promise<void>(resolve => {
                    state.client.connect().then(() => resolve());
                });
            },

            destroy(context: any) {
                self.destroy(context);
            }
        };
    };

    protected modules() {
        return {};
    };

    protected static cookieHandler(context: any, config: SignalingServerConfirguration): Promise<SignalingServerConfirguration> {
        return new Promise<SignalingServerConfirguration>((resolve, reject) => {
            if (window.sessionStorage.getItem(config.room ? config.room : "chat") !== "busy") {

                window.sessionStorage.setItem(config.room ? config.room : "chat", "busy");
            
                context.commit("setBeforeunloadEventHandler", () => {
                    setCookie(config.room + "-" + SESSION_COOKIE, JSON.stringify(config), 5);
                    setCookie(SESSION_COOKIE, JSON.stringify(config), 5)
                    window.sessionStorage.removeItem(config.room ? config.room : "chat");
                });

                window.addEventListener("beforeunload", context.state.beforeunloadEventHandler);

                // Check if there is a cookie with the login information
                let cookie = getCookie(config.room + "-" + SESSION_COOKIE);
        
                if (cookie) // Check for empty string
                    cookie = JSON.parse(cookie);

                if (cookie) { // Check for null
                    config = cookie as SignalingServerConfirguration;
                } else {
                    config = {
                        name: config.name ? config.name : "Undefined",
                        data: config.data ? config.data : {},
                        room: config.room ? config.room : "chat",
                        password: config.password
                    }
                }

                resolve(config);
    
            } else {
                reject(new BusyException("Already connect or in process of connecting"));
            }
        });
    }

    protected connectClientEvents(context: SignalingClientContext) {
        context.state.client.onSignalingConnectionOpen = () => {
            this.onSignalingConnectionOpen(context);
        };
        context.state.client.onSignalingConnectionClose = async () => {
            this.onSignalingConnectionClose(context);
        };
        context.state.client.onSignalingConnectionError = (message: string) => {
            this.onSignalingConnectionError(context, message);
        };
        context.state.client.onRoomClientsChange = (clients: Array<Record<string, any>>) => {
            this.onRoomClientsChange(context, clients);
        };
        context.state.client.onClientConnect = (id: string, name: string, clientData: Record<string, any>) => {
            this.onClientConnect(context, id, name, clientData);
        };
        context.state.client.onClientDisconnect = (id: string, name: string, clientData: Record<string, any>) => {
            this.onClientDisconnect(context, id, name, clientData)
        };
    }

    protected onSignalingConnectionOpen(context: SignalingClientContext) : void {
        // TODO
    }

    protected onSignalingConnectionClose(context: SignalingClientContext) : void {
        // TODO
    }

    protected onSignalingConnectionError(context: SignalingClientContext, message: string) : void {
        // TODO
        this.destroy(context); // remove the beforeunload event listener
        alert(message);
    }

    protected onRoomClientsChange(context: SignalingClientContext, clients: Array<Record<string, any>>) {
        context.commit("updateClientsInRoom", clients);
    }

    protected onClientConnect(context: SignalingClientContext, id: string, name: string, clientData: Record<string, any>) {
        context.commit("incrementClientsInCall");
        context.commit("setCallState", true);
        context.commit("localClient/setCallState", true, {root : true});
    }

    protected onClientDisconnect(context: SignalingClientContext, id: string, name: string, clientData: Record<string, any>) {
        context.commit("decrementClientInCall");
        if (context.state.numberClientsInCall <= 0) {
            context.commit("setCallState", false);
            context.commit("localClient/setCallState", false, {root : true});
        }
    }

    protected destroy(context: SignalingClientContext) : void {
        window.removeEventListener("beforeunload", context.state.beforeunloadEventHandler as {():void});
    }

    protected abstract initialize(context: SignalingClientContext, payload: SignalingServerConfirguration): Promise<void>;

    public getModule() {
        return {
            namespaced: true,
            state: this.state(),
            getters: this.getters(),
            mutations: this.mutations(),
            actions: this.actions(),
            modules: this.modules()
        }
    }
}
