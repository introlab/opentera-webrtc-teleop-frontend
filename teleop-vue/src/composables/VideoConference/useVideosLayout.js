// src/composables/VideoConference/useVideosLayout.js

import { computed } from "vue";

export default function(clientList) {

    const getNumberOfClients = () => {
      return clientList ? clientList.value.length : 0;
    }
    
    const getNumberOfColumns = () => {
        let nClients = getNumberOfClients();
        if (nClients === 0)
          return 0;

        for (let i = 1; i < 8; i++){
          if (nClients > Math.pow(i-1, 2) && nClients <= Math.pow(i, 2))
            return i;
        }
        alert("More than 64 for user the GUI can't handle as many");
        return 8;
    };

    const getNumberOfRows = () => {
      let nClients = getNumberOfClients();
      if (nClients === 0)
        return 0;

      return Math.floor((nClients - 1) / nColumns.value) + 1
    }

    const nColumns = computed(getNumberOfColumns);
    const nRows = computed(getNumberOfRows);

    return { nColumns, nRows };
};
