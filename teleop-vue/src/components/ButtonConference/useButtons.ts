// src/components/ButtonConference/useButtons.ts

import { computed } from "vue";
import { useStore } from "vuex";

export default function() {
  const store = useStore();
  const localClient = store.state.localClient;
  const namespace = "localClient/";

  const isCameraOn = computed(() => localClient.isCameraOn);
  const sessionMicVolume = computed(
    () => store.state.localClient.openteraVideoConf.micVolume
  );
  const sessionVolume = computed(
    () => store.state.localClient.openteraVideoConf.volume
  );
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
  const robotMicVolume = computed(
    () => store.state.localClient.openteraTeleop.status.micVolume
  );
  const isRobotCameraOn = computed(
    () => store.state.localClient.openteraTeleop.status.isCameraOn
  );
  const robotVolume = computed(
    () => store.state.localClient.openteraTeleop.status.volume
  );

  const toggleCamera = () =>
    store.dispatch(namespace + "toggleCamera").catch((error) => {
      // TODO
      alert(error.message);
    });

  const setSessionVolume = (toggle: boolean) => {
    const slider = (document.getElementById("sessionVolumeSlider") as HTMLInputElement);
    if(toggle){
      slider.value = slider.value === "0" ? "1" : "0";
    }
    store.commit("localClient/openteraVideoConf/setSessionVolume", parseFloat(slider.value));
  }
  
  const setSessionMicVolume = (toggle: boolean) => {
    const slider = (document.getElementById("sessionMicVolumeSlider") as HTMLInputElement);   
    if(toggle){
      slider.value = slider.value === "0" ? "1" : "0";
    }
    store.commit("localClient/openteraVideoConf/setSessionMicVolume", parseFloat(slider.value));
  }

  const toggleParticipantsList = () =>
    store.commit("localClient/openteraVideoConf/toggleParticipantsList");

  const toggleCameraDisplayMode = () =>
    store.commit("localClient/openteraVideoConf/toggleCameraDisplayMode"); // TODO: move to localClient store instead?

  const toggleShowControls = () =>
    store.commit("localClient/openteraVideoConf/toggleShowControls"); // TODO: move to localClient store instead?

  const toggleShowSettings = () => {
    store.commit("localClient/openteraVideoConf/toggleShowSettings"); // TODO: move to localClient store instead?
};
  const toggleRobotCamera = () => {
    store.commit("localClient/openteraTeleop/toggleRobotCamera");
    if (store.state.localClient.openteraTeleop.client) {
      store.state.localClient.openteraTeleop.client.sendToAll(
        JSON.stringify({
          type: "enableCamera",
          value: store.state.localClient.openteraTeleop.status.isCameraOn,
        })
      );
    }
  };
  const setRobotMicVolume = (toggle: boolean) => {
    const slider = (document.getElementById("robotMicVolumeSlider") as HTMLInputElement);
    if(toggle){
      slider.value = slider.value === "0" ? "1" : "0";
    }
    store.commit("localClient/openteraTeleop/setRobotMicVolume", parseFloat(slider.value));
      if (store.state.localClient.openteraTeleop.client) {
        store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({
            type: "micVolume",
            value: store.state.localClient.openteraTeleop.status.micVolume,
          })
        );
      }
  };
  const setRobotVolume = (toggle: boolean) => {
    const slider = (document.getElementById("robotVolumeSlider") as HTMLInputElement);
    if(toggle){
      slider.value = slider.value === "0" ? "1" : "0";
    }
    store.commit("localClient/openteraTeleop/setRobotVolume", parseFloat(slider.value));
    if (store.state.localClient.openteraTeleop.client) {
      store.state.localClient.openteraTeleop.client.sendToAll(
        JSON.stringify({
          type: "volume",
          value: store.state.localClient.openteraTeleop.status.volume,
        })
      );
    }
  };
  return {
    isCameraOn,
    sessionMicVolume,
    sessionVolume,
    showParticipants,
    cameraDisplayMode,
    showControls,
    showSettings,
    robotMicVolume,
    isRobotCameraOn,
    robotVolume,

    toggleCamera,
    setSessionMicVolume,
    setSessionVolume,
    toggleParticipantsList,
    toggleCameraDisplayMode,
    toggleShowControls,
    toggleShowSettings,
    toggleRobotCamera,
    setRobotMicVolume,
    setRobotVolume
  };
}
