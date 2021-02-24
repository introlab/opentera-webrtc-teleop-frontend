// src/views/ConferenceView/useVideoOverlay.ts

import { computed, onMounted, Ref, watch } from "vue";
import { useStore } from "vuex";

export default function(overlayVideoRef : Ref<HTMLVideoElement>) {
    const store = useStore();

    // Setup local video
    const _initLocalVideo = () => {
        const overlayVideo = overlayVideoRef.value;
        overlayVideo.muted = true;
        overlayVideo.srcObject = store.state.opentera.localStream;
        overlayVideo.autoplay = true;
    };

    const stream = computed(() => store.state.opentera.localStream);
    watch(stream, _initLocalVideo);

    onMounted(_initLocalVideo);

    return {};
}