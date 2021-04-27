// src/components/ButtonConference/useButtons.ts

import { computed } from "vue";
import { useStore } from "vuex";

export default function() {
    const store = useStore();
    const localClient = store.state.localClient;
    const namespace = "localClient/"

    const isInCall = computed(() => localClient.isInCall);
    const isMuted = computed(() => localClient.isMuted);
    const isCameraOn = computed(() =>localClient.isCameraOn);
    const showParticipants = computed(() => store.state.localClient.openteraVideoConf.showParticipants);

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

    const toggleParticipantsList = () => store.commit("localClient/openteraVideoConf/toggleParticipantsList");

    return {
        isInCall,
        isMuted,
        isCameraOn,
        showParticipants,

        toggleCall,
        toggleMute,
        toggleCamera,
        toggleParticipantsList
    }
}