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
  const showControls = computed(
    () => store.state.localClient.openteraVideoConf.showControls
  );
  const showSettings = computed(
    () => store.state.localClient.openteraVideoConf.showSettings
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
    store.commit("localClient/openteraVideoConf/toggleCameraDisplayMode"); // TODO: move to localClient store instead?

  const toggleShowControls = () =>
    store.commit("localClient/openteraVideoConf/toggleShowControls"); // TODO: move to localClient store instead?

  const toggleShowSettings = () => {
    console.log("Toggling show settings");
    store.commit("localClient/openteraVideoConf/toggleShowSettings"); // TODO: move to localClient store instead?
  };

  return {
    isMuted,
    isCameraOn,
    showParticipants,
    cameraDisplayMode,
    showControls,
    showSettings,

    toggleMute,
    toggleCamera,
    toggleParticipantsList,
    toggleCameraDisplayMode,
    toggleShowControls,
    toggleShowSettings
  };
}
