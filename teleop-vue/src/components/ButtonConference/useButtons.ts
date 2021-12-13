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
  const isRobotMuted = computed(
    () => store.state.localClient.openteraTeleop.status.isMuted
  );
  const isRobotCameraOn = computed(
    () => store.state.localClient.openteraTeleop.status.isCameraOn
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
    store.commit("localClient/openteraVideoConf/toggleShowSettings"); // TODO: move to localClient store instead?
  };
  const toggleRobotMute = () => {
    store.commit("localClient/openteraTeleop/toggleRobotMute");
    if (store.state.localClient.openteraTeleop.client) {
      store.state.localClient.openteraTeleop.client.sendToAll(
        JSON.stringify({
          type: "mute",
          value: store.state.localClient.openteraTeleop.status.isMuted
        })
      );
    }
  };
  const toggleRobotCamera = () => {
    store.commit("localClient/openteraTeleop/toggleRobotCamera");
    if (store.state.localClient.openteraTeleop.client) {
      store.state.localClient.openteraTeleop.client.sendToAll(
        JSON.stringify({
          type: "enableCamera",
          value: store.state.localClient.openteraTeleop.status.isCameraOn
        })
      );
    }
  };

  return {
    isMuted,
    isCameraOn,
    showParticipants,
    cameraDisplayMode,
    showControls,
    showSettings,
    isRobotMuted,
    isRobotCameraOn,

    toggleMute,
    toggleCamera,
    toggleParticipantsList,
    toggleCameraDisplayMode,
    toggleShowControls,
    toggleShowSettings,
    toggleRobotCamera,
    toggleRobotMute
  };
}
