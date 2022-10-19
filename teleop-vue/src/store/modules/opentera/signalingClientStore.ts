// src/store/modules/opentera/signalingClientStore.ts

import { getCookie, SESSION_COOKIE, setCookie } from "@/config/cookie";
import openteraWebrtcWebClient from "opentera-webrtc-web-client";

import {
  Client,
  Logger,
  RoomClient,
  SignalingClientContext,
  SignalingClientRoom,
  SignalingServerConfiguration,
} from "./types";

export abstract class SignalingClientStore {
  protected state(): SignalingClientRoom {
    return {
      isInitPending: false,
      beforeunloadEventHandler: ()=>null,
      logger: (...args) => {
        if(process.env.NODE_ENV !== "production")
        {
          // eslint-disable-next-line no-console
          console.log(...args)
        } 
      },
      client: undefined,
      clientsInRoom: [],
      numberClientsInCall: 0,
      inCallState: false,
    };
  }

  protected getters() {
    return {};
  }

  protected mutations() {
    return {
      setInitPendingState(state: SignalingClientRoom, payload: boolean) {
        state.isInitPending = payload;
      },

      setBeforeunloadEventHandler(
        state: SignalingClientRoom,
        payload: Function
      ) {
        state.beforeunloadEventHandler = payload as EventListener;
      },

      setClient(
        state: SignalingClientRoom,
        payload: openteraWebrtcWebClient.SignalingClient
      ) {
        if (state.client !== null) {
          delete state.client;
        }
        state.client = payload;
      },

      setLogger(state: SignalingClientRoom, payload: Logger) {
        state.logger = payload;
      },

      updateClientsInRoom(
        state: SignalingClientRoom,
        payload: Array<RoomClient>
      ) {
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
      },
    };
  }

  protected actions() {
    /* eslint-disable @typescript-eslint/no-this-alias */
    const self = this;
    return {
      async connectClientEvents(context: SignalingClientContext) {
        await self.connectClientEvents(context);
      },

      async start(context: SignalingClientContext, config: SignalingServerConfiguration) {
        try {
          config = await SignalingClientStore.cookieHandler(context, config);
          await context.dispatch("initialize", config);
          await context.dispatch("connectClient");
        } catch (err) {
          if(process.env.NODE_ENV !== "production")
          {
            // eslint-disable-next-line no-console
            console.log(err);
          } 
          throw err;
        }
      },

      initialize(
        context: SignalingClientContext,
        config: SignalingServerConfiguration
      ) {
        return new Promise<void>((resolve) => {
          self.initialize(context, config).then(() => resolve());
        });
      },

      connectClient({ state }: { state: SignalingClientRoom }) {
        return new Promise<void>((resolve) => {
          state.client.connect().then(() => resolve());
        });
      },

      destroy(context: SignalingClientContext) {
        self.destroy(context);
      },

      // TODO: make function to hang up all rooms
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      callRoom(context: SignalingClientContext, room: string) {
        if (!context.state.inCallState) {
          context.state.client.callAll();
        }
      },
    };
  }

  protected modules() {
    return {};
  }

  protected static async cookieHandler(
    context: SignalingClientContext,
    config: SignalingServerConfiguration
  ): Promise<SignalingServerConfiguration> {
    // TODO: handle errors
    if (
      window.sessionStorage.getItem(config.room ? config.room : "chat") !==
      "busy"
    ) {
      window.sessionStorage.setItem(config.room ? config.room : "chat", "busy");

      context.commit("setBeforeunloadEventHandler", () => {
        setCookie(
          config.room + "-" + SESSION_COOKIE,
          JSON.stringify(config),
          5
        );
        setCookie(SESSION_COOKIE, JSON.stringify(config), 5);
        window.sessionStorage.removeItem(config.room ? config.room : "chat");
      });

      window.addEventListener(
        "beforeunload",
        context.state.beforeunloadEventHandler
      );

      // Check if there is a cookie with the login information
      let cookie = getCookie(config.room + "-" + SESSION_COOKIE);

      if (cookie)
        // Check for empty string
        cookie = JSON.parse(cookie);

      if (cookie) {
        // Check for null
        config = cookie as SignalingServerConfiguration;
      } else {
        config = {
          name: config.name ? config.name : "Undefined",
          data: config.data ? config.data : {},
          room: config.room ? config.room : "chat",
          password: config.password,
        };
      }
    }
    return config;
  }

  protected async connectClientEvents(context: SignalingClientContext) {
    context.state.client.onSignalingConnectionOpen = async () => {
      this.onSignalingConnectionOpen(context);
    };
    context.state.client.onSignalingConnectionClose = async () => {
      this.onSignalingConnectionClose(context);
    };
    context.state.client.onSignalingConnectionError = (message: string) => {
      this.onSignalingConnectionError(context, message);
    };
    context.state.client.onRoomClientsChange = (
      clients: Array<Record<string, Client>>
    ) => {
      this.onRoomClientsChange(context, clients);
    };
    context.state.client.onClientConnect = (
      /* eslint-disable */
      id: string,
      name: string,
      clientData: Record<string, any>
      /* eslint-enable */
      ) => {
      this.onClientConnect(context);
    };
    context.state.client.onClientDisconnect = (
      /* eslint-disable */
      id: string,
      name: string,
      clientData: Record<string, any>
      /* eslint-enable */
      ) => {
      this.onClientDisconnect(context, id)
    };
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onSignalingConnectionOpen(context: SignalingClientContext): void {
    // TODO
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onSignalingConnectionClose(context: SignalingClientContext): void {
    // TODO
  }

  protected onSignalingConnectionError(
    context: SignalingClientContext,
    message: string
  ): void {
    // TODO
    this.destroy(context); // remove the beforeunload event listener
    alert(message);
  }

  protected onRoomClientsChange(
    context: SignalingClientContext,
    clients: Array<Record<string, Client>>
  ) {
    context.commit("updateClientsInRoom", clients);
    if (clients.length >= 2) {
      context.dispatch(
        "callRoom",
        context.state.client._signalingServerConfiguration.room
      );
    }
  }

  protected onClientConnect(
    context: SignalingClientContext,
  ) {
    context.commit("incrementClientsInCall");
    context.commit("setCallState", true);
    context.commit("localClient/setCallState", true, { root: true });
  }

  protected onClientDisconnect(
    context: SignalingClientContext,
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: string
  ) {
    context.commit("decrementClientInCall");
    if (context.state.numberClientsInCall <= 0) {
      context.commit("setCallState", false);
      context.commit("localClient/setCallState", false, { root: true });
    }
  }

  protected destroy(context: SignalingClientContext): void {
    window.removeEventListener(
      "beforeunload",
      context.state.beforeunloadEventHandler as { (): void }
    );
  }

  protected abstract initialize(
    context: SignalingClientContext,
    payload: SignalingServerConfiguration
  ): Promise<void>;

  public getModule() {
    return {
      namespaced: true,
      state: this.state(),
      getters: this.getters(),
      mutations: this.mutations(),
      actions: this.actions(),
      modules: this.modules(),
    };
  }
}
