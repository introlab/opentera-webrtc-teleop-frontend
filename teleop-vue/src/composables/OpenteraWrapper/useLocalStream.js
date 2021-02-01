// src/composables/OpenteraWrapper/useLocalStream.js

import { onMounted, ref } from "vue";

import openteraWebrtcWebClient from "opentera-webrtc-web-client";

export default function() {
  const localStream = ref();

  // Setup local stream
  const initLocalStream = () => {
    openteraWebrtcWebClient.devices.getDefaultStream().then(stream => {
      localStream.value = stream;
    });
  };

  onMounted(initLocalStream);

  return { localStream };
}
