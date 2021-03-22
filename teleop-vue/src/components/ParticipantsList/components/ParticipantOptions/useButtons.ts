// src/components/ParticipantsList/components/ParticipantsOptions/useButtons.ts

import { computed } from "vue";
import { useStore } from "vuex";

export default function() {
    const store = useStore();

    const toggleMute = () => store.dispatch("opentera/localClient/toggleMute").catch(error => {
        // TODO
         alert(error.message);
    });
    
    const isMuted = computed(() => store.state.opentera.localClient.isMuted);

    return {
        toggleMute,
        isMuted
    }
}