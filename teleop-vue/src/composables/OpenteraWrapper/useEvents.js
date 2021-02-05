// src/composables/OpenteraWrapper/useEvents.js

import { computed, watch} from "vue";
import { useStore } from "vuex";

export default function(streamClient) {
    const store = useStore();

    const callAll = () => {
        streamClient.value.callAll();
    };

    const hangUpAll = () => {
        streamClient.value.hangUpAll();
    };

    // eslint-disable-next-line
    const callEvent =(newValue, oldValue) => {
        newValue ? callAll() : hangUpAll();
    }

    const isInCall = computed(() => store.state.opentera.isInCall);
    watch(isInCall, callEvent);
}