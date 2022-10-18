// src/components/ParticipantsList/components/ParticipantsOptions/useButtons.ts

import { computed } from "vue";
import { useStore } from "vuex";
import { Client } from "@/store/modules/opentera";

export default function() {
  const store = useStore();

  const toggleMute = (participant: Client) => {
    if(participant == store.state.localClient){
      const slider = (document.getElementById("sessionMicVolumeSlider") as HTMLInputElement);
      slider.value = slider.value === "0" ? "1" : "0";
      store.commit("localClient/openteraVideoConf/setSessionMicVolume", parseFloat(slider.value));
    } else {
      const slider = (document.getElementById("robotMicVolumeSlider") as HTMLInputElement);
      slider.value = slider.value === "0" ? "1" : "0";
      store.commit("localClient/openteraTeleop/setRobotMicVolume", parseFloat(slider.value)); 
      if (store.state.localClient.openteraTeleop.client) {
        store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({
            type: "micVolume",
            value: store.state.localClient.openteraTeleop.status.micVolume,
          })
        );
      }
    }
  }

  const sessionMicVolume = computed(
    () => store.state.localClient.openteraVideoConf.micVolume
  );
  const robotMicVolume = computed(
    () => store.state.localClient.openteraTeleop.status.micVolume
  );
  const localClient = computed(
    () => store.state.localClient
  );

  return {
    toggleMute,
    sessionMicVolume,
    robotMicVolume,
    localClient
  };
}
