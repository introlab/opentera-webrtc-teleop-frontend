// src/composables/ConferenceView/useVideoOverlay.js

import { onMounted } from "vue";
import openteraWebrtcWebClient from "opentera-webrtc-web-client";

export default function(overlayVideoRef) {
  // Setup local video
  const _initLocalVideo = () => {
    let overlayVideo = overlayVideoRef.value;
    overlayVideo.muted = true;
    openteraWebrtcWebClient.devices.getDefaultStream().then(stream => {
      overlayVideo.srcObject = stream;
      overlayVideo.autoplay = true;
    });
  };

  onMounted(_initLocalVideo);

  return {};
}
