// src/composables/OpenteraWrapper/useStreamClient.js

import { computed, ref, toRefs } from "vue";
import { useStore } from "vuex";

import openteraWebrtcWebClient from "opentera-webrtc-web-client";

export default function(props, localStream) {
  const store = useStore();
  const { name, data, room } = toRefs(props);

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
    streamClient.value.onRoomClientsChange = clients => {
      store.commit("opentera/setClientInRoom", clients)
    };
    // Accept or not the incoming call
    streamClient.value.callAcceptor = () => {
      // TODO
      return true;
    }
    streamClient.value.onAddRemoteStream = (id, name, clientData, stream) => {
      store.commit("opentera/pushClientInCall", { id, name, clientData, stream });
    };
    // eslint-disable-next-line
    streamClient.value.onClientConnect = (id, name, clientData) => {
      store.commit("opentera/setCallState", true);
    };
    // eslint-disable-next-line
    streamClient.value.onClientDisconnect = (id, name, clientData) => {
      store.commit("opentera/removeClientInCallById", id);
      if (store.state.opentera.clientsInCall.length <= 0)
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

    // Save this client state
    store.commit("opentera/setThisClient", { id: streamClient.value.id, name: name, data: data, room: room });
  };

  const clientList = computed(() => store.state.opentera.clientList);

  return { clientList, streamClient, connect };
}
