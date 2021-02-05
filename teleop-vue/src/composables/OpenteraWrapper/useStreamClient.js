// src/composables/OpenteraWrapper/useStreamClient.js

import { computed, ref, toRefs } from "vue";
import { useStore } from "vuex";

import openteraWebrtcWebClient from "opentera-webrtc-web-client";

export default function(props, localStream) {
  const store = useStore();
  const { name, data, room } = toRefs(props);

  const clientList = computed(() => store.state.opentera.clientList);
  const streamClient = ref();

  // Configurations
  const SignalingServerConfiguration = {
    url: "http://127.0.0.1:40075",
    name: name,
    data: data, // Client custom data
    room: room
  };
  const StreamConfiguration = {
    localStream: localStream,
    isSendOnly: false
  };
  const RtcConfiguration = {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCConfiguration_dictionary
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ]
  };
  const logger = (...args) => console.log(...args);

  const connectEvents = () => {
    streamClient.value.onSignalingConnectionOpen = () => {
      // TODO
    };
    streamClient.value.onSignalingConnectionClose = async () => {
      // TODO
    };
    streamClient.value.onSignalingConnectionError = message => {
      alert(message);
    };
    // eslint-disable-next-line
    streamClient.value.onRoomClientsChange = client => {
      // TODO
    };
    // Accept or not the incoming call
    streamClient.value.callAcceptor = () => {
      // TODO
      return true;
    }
    streamClient.value.onAddRemoteStream = (id, name, clientData, stream) => {
      store.commit("opentera/pushClient", { id, name, clientData, stream });
    };
    // eslint-disable-next-line
    streamClient.value.onClientConnect = (id, name, clientData) => {
      store.commit("opentera/setCallState", true);
    };
    // eslint-disable-next-line
    streamClient.value.onClientDisconnect = (id, name, clientData) => {
      store.commit("opentera/removeClientById", id);
      store.commit("opentera/setCallState", false);
    };
  };

  const connect = async () => {
    streamClient.value = new openteraWebrtcWebClient.StreamClient(
      SignalingServerConfiguration,
      StreamConfiguration,
      RtcConfiguration,
      logger
    );

    connectEvents();

    await streamClient.value.connect();
  };

  return { clientList, streamClient, connect };
}
