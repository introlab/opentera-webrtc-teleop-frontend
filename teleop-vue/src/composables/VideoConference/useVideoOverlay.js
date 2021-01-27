// src/composables/VideoConference/useVideoOverlay.js

import { onMounted } from "vue";
import openteraWebrtcWebClient from "opentera-webrtc-web-client";

export default function(overlayVideoRef) {

    // Setup local video
    const initLocalVideo = () => {
        let overlayVideo = overlayVideoRef.value;
        overlayVideo.muted = true;
        openteraWebrtcWebClient.devices.getDefaultStream().then(stream => {
            overlayVideo.srcObject = stream;
            overlayVideo.autoplay = true;
        });
    }

    onMounted(initLocalVideo);

    return { };
};