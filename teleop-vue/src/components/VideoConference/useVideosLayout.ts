// src/components/VideoConference/useVideosLayout.ts

import { computed, Ref} from "vue";

import { Client } from "@/store/modules/opentera";

export default function(clientsList: Ref<Client[]>) {
    
    const getNumbersOfClients = () : number => {
        return clientsList ? clientsList.value.length : 0;
    };

    // Compute the number of columns
    const getNumberOfColumns = () : number => {
        const nClients = getNumbersOfClients();
        if (nClients === 0) return 0;

        for (let i = 1; i < 4; i++) {
            if (nClients > Math.pow(i - 1, 2) && nClients <= Math.pow(i, 2)) return i;
        }
        
        alert("Can't display more than 16 user at the time");
        return 4;
    };

    const nColumns = computed(getNumberOfColumns);

    // Compute the number of rows
    const getNumberOfRows = () : number => {
        const nClients = getNumbersOfClients();
        if (nClients === 0) return 0;

        return Math.floor((nClients - 1) / nColumns.value) + 1;
    }

    const nRows = computed(getNumberOfRows);

    return {
        nColumns,
        nRows
    }
}