// src/composables/ConferenceView/useParticipantsList.js

import { computed } from "vue";
import { useStore } from "vuex";


export default function() {
    const store = useStore();

    const showParticipants = computed(() => store.state.conferenceView.showParticipants);

    return {
        showParticipants
    };
}