// src/composables/VideoConference/useVideosLayout.js

import { computed } from "vue";

export default function(clientList) {
    
    const getNumberOfColumns = () => {
        if (!clientList)
            return 0

        let nClients = clientList.value.length;
        if (nClients === 0)
          return 0;

        for (let i = 1; i < 8; i++){
          if (nClients > Math.pow(i-1, 2) && nClients <= Math.pow(i, 2))
            return i;
        }
        alert("More than 64 for user the GUI can't handle as many");
        return 8;
    };

    const nColumns = computed(getNumberOfColumns);

    return { nColumns };
};
