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

    const toggleCall = () => store.dispatch(namespace + "toggleCall").catch(error => {
        // TODO
        alert(error.message);
    });

    const toggleMute = () => store.dispatch(namespace + "toggleMute").catch(error => {
        // TODO
         alert(error.message);
    });

    const toggleCamera = () => store.dispatch(namespace + "toggleCamera").catch(error => {
        // TODO
        alert(error.message);
    });

    return {
        isInCall,
        isMuted,
        isCameraOn,

        toggleCall,
        toggleMute,
        toggleCamera
    }
}