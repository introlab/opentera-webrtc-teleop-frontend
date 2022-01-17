// src/components/ParticipantsList/components/ParticipantsOptions/useButtons.ts

import { computed } from "vue";
import { useStore } from "vuex";

export default function() {
  const store = useStore();

  const toggleMute = () =>
    store.dispatch("localClient/toggleMute").catch((error) => {
      // TODO
      alert(error.message);
    });

  const isMuted = computed(() => store.state.localClient.isMuted);

  return {
    toggleMute,
    isMuted,
  };
}
