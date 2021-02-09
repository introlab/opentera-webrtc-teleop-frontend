// src/composables/ButtonConference/useRoomsButtons.js

import { ref, watch, computed } from "vue";
import { useStore } from "vuex";

export default function() {
    const store = useStore();

    const participantsIcon = ref(require("../../assets/people-fill.svg"));

    // eslint-disable-next-line
    const _updateParticipantsIcon = (newValue, oldValue) => {
        if (newValue)
            participantsIcon.value = require("../../assets/people.svg");
        else
            participantsIcon.value = require("../../assets/people-fill.svg");
    };

    const participantsEvent = () => store.commit("conferenceView/showParticipants", !store.state.conferenceView.showParticipants);
    const showParticipants = computed(() => store.state.conferenceView.showParticipants);
    watch(showParticipants, _updateParticipantsIcon);

    return {
        participantsIcon,
        participantsEvent
    }
}