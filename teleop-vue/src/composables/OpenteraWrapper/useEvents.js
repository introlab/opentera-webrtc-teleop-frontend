// src/composables/OpenteraWrapper/useEvents.js

import { computed, watch} from "vue";
import { useStore } from "vuex";

export default function(streamClient, localStream) {
    const store = useStore();

    const callAll = () => {
        streamClient.value.callAll();
    };

    const hangUpAll = () => {
        streamClient.value.hangUpAll();
    };

    const setMuteIsActive = isActive => {
        localStream.value.getAudioTracks().forEach(track => {
            track.enabled = isActive;
        });
    }

    const setCameraIsActive = isActive => {
        localStream.value.getVideoTracks().forEach(track => {
            track.enabled = isActive;
        })
    }

    // eslint-disable-next-line
    const callEvent =(newValue, oldValue) => {
        newValue ? callAll() : hangUpAll();
    }
    const isInCall = computed(() => store.state.opentera.isInCall);
    watch(isInCall, callEvent);

    // eslint-disable-next-line
    const muteEvent =(newValue, oldValue) => {
        setMuteIsActive(!newValue);
    }
    const isMuted = computed(() => store.state.opentera.isMuted);
    watch(isMuted, muteEvent);

    // eslint-disable-next-line
    const cameraEvent =(newValue, oldValue) => {
        setCameraIsActive(!newValue);
    }
    const isCameraOff = computed(() => store.state.opentera.isCameraOff);
    watch(isCameraOff, cameraEvent);
}