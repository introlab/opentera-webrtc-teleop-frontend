// src/components/ButtonConference/useButtons.ts

import { computed } from "vue";
import { useStore } from "vuex";

export default function() {
    const store = useStore();
    const localClient = store.state.opentera.localClient;
    const namespace = "opentera/localClient/"

    const isInCall = computed(() => localClient.isInCall);
    const isMuted = computed(() => localClient.isMuted);
    const isCameraOn = computed(() =>localClient.isCameraOn);

    const toggleCall = () => store.commit(namespace + "setCallState", !localClient.isInCall);
    const toggleMute = () => store.commit(namespace + "setMuteState", !localClient.isMuted);
    const toggleCamera = () => store.commit(namespace + "setCameraState", !localClient.isCameraOn);

    return {
        isInCall,
        isMuted,
        isCameraOn,

        toggleCall,
        toggleMute,
        toggleCamera
    }
}