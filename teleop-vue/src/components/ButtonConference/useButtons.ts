// src/components/ButtonConference/useButtons.ts

import { computed } from "vue";
import { useStore } from "vuex";

export default function() {
  const store = useStore();
  const localClient = store.state.localClient;
  const namespace = "localClient/";

  const isMuted = computed(() => localClient.isMuted);
  const isCameraOn = computed(() => localClient.isCameraOn);
  const showParticipants = computed(
    () => store.state.localClient.openteraVideoConf.showParticipants
  );
  const cameraDisplayMode = computed(
    () => store.state.localClient.openteraVideoConf.cameraDisplayMode
  );

  const toggleMute = () =>
    store.dispatch(namespace + "toggleMute").catch(error => {
      // TODO
      alert(error.message);
    });

  const toggleCamera = () =>
    store.dispatch(namespace + "toggleCamera").catch(error => {
      // TODO
      alert(error.message);
    });

  const toggleParticipantsList = () =>
    store.commit("localClient/openteraVideoConf/toggleParticipantsList");

  const toggleCameraDisplayMode = () =>
    store.commit("localClient/openteraVideoConf/toggleCameraDisplayMode");

  return {
    isMuted,
    isCameraOn,
    showParticipants,
    cameraDisplayMode,

    toggleMute,
    toggleCamera,
    toggleParticipantsList,
    toggleCameraDisplayMode
  };
}
