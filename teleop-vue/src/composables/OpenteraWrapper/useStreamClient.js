// src/composables/OpenteraWrapper/useStreamClient.js

import { ref, toRefs } from "vue";

import openteraWebrtcWebClient from "opentera-webrtc-web-client";

export default function(props, localStream) {
  const { name, data, room } = toRefs(props);

  const clientList = ref([]);
  const streamClient = ref();

  // Configurations
  const SignalingServerConfiguration = {
    url: "http://localhost:8080/",
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
    streamClient.value.onAddRemoteStream = (id, name, clientData, stream) => {
      clientList.value.push({ id, name, stream });
    };
    // eslint-disable-next-line
        streamClient.value.onClientDisconnect = (id, name, clientData) => {
      clientList.value = clientList.value.filter(item => item.id !== id);
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
