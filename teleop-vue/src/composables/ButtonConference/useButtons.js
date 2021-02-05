// src/composables/ButtonConference/useButtons.js

import { ref, watch, computed } from "vue";
import { useStore } from "vuex";

export default function() {
    const store = useStore();

    const callImg = ref(require("../../assets/telephone-inbound.svg"));
    const micImg = ref(require("../../assets/mic-fill.svg"));
    const cameraImg = ref(require("../../assets/camera-video-fill.svg"));

    // eslint-disable-next-line
    const _updateCallImg = (newValue, oldValue) => {
        if (newValue)
            callImg.value = require("../../assets/telephone-outbound-fill.svg");
        else
            callImg.value = require("../../assets/telephone-inbound.svg");
    }

    // eslint-disable-next-line
    const _updateMicImg = (newValue, oldValue) => {
        if (newValue)
            micImg.value = require("../../assets/mic-mute-fill.svg");
        else
            micImg.value = require("../../assets/mic-fill.svg");
    }

    // eslint-disable-next-line
    const _updateCameraImg = (newValue, oldValue) => {
        if (newValue)
            cameraImg.value = require("../../assets/camera-video-off-fill.svg");
        else
            cameraImg.value = require("../../assets/camera-video-fill.svg");
    }

    const callEvent = () => store.commit("opentera/setCallState", !store.state.opentera.isInCall);
    const micEvent = () => store.commit("opentera/setMuteState", !store.state.opentera.isMuted);
    const cameraEvent = () => store.commit("opentera/setCameraState", !store.state.opentera.isCameraOff);

    const isInCall = computed(() => store.state.opentera.isInCall);
    watch(isInCall, _updateCallImg);

    const isMuted = computed(() => store.state.opentera.isMuted);
    watch(isMuted, _updateMicImg);

    const isCameraOff = computed(() => store.state.opentera.isCameraOff);
    watch(isCameraOff, _updateCameraImg);

    return {
        callImg,
        micImg,
        cameraImg,

        callEvent,
        micEvent,
        cameraEvent
    }
}