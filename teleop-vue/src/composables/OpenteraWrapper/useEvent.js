// src/composables/OpenteraWrapper/useStreamClient.js

import { onBeforeMount, onUnmounted} from "vue";
import { useStore } from "vuex";

export default function(streamClient) {
    const store = useStore();
    let unsubscribe = null;

    const callAll = () => {
        streamClient.value.callAll();
    };

    const hangUpAll = () => {
        streamClient.value.hangUpAll();
    };

    const subscribeEvents = () => {
        // eslint-disable-next-line
        unsubscribe = store.subscribe((mutation, state) => {
            switch (mutation.type) {
                case "opentera/callAll":
                    callAll();
                    break;
                case "opentera/hangUpAll":
                    hangUpAll();
                    break;
                default:
                    break;
            }
        })
    };

    const unsubscribeEvents = () => {
        unsubscribe();
    }

    onBeforeMount(subscribeEvents);
    onUnmounted(unsubscribeEvents);
}