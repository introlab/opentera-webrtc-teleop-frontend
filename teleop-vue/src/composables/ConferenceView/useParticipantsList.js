// src/composables/ConferenceView/useParticipantsList.js

import { computed } from "vue";
import { useStore } from "vuex";


export default function() {
    const store = useStore();

    const closeParticipantsEvent = () => store.commit("conferenceView/showParticipants", !store.state.conferenceView.showParticipants);

    const showParticipants = computed(() => store.state.conferenceView.showParticipants);

    return {
        closeParticipantsEvent,
        showParticipants
    };
}