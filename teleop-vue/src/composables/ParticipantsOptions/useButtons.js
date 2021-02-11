// src/composables/ParticipantsOptions/useButtons.js

import { computed } from "vue";
import { useStore } from "vuex";

export default function() {
    const store = useStore();

    const micEvent = () => store.commit("opentera/setMuteState", !store.state.opentera.isMuted);
    const isMuted = computed(() => store.state.opentera.isMuted);

    return {
        micEvent,
        isMuted
    }
}