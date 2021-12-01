<template>
  <div class="menu-container">
    <button class="icon-button icon">
      <svg-icon class="" icon="gear" v-on:click="toggleShowSettings"></svg-icon>
    </button>
    <div class="menu" v-if="showSettings" v-click-away="onClickAway">
      <div class="menu-item" v-on:click="toggleAudioSettings">
        Select audio source
      </div>
      <div class="menu-item" v-on:click="toggleVideoSettings">
        Select video source
      </div>
    </div>
    <modal v-if="showAudioSettings" v-on:close="toggleAudioSettings">
      <template v-slot:header>
        <h3>Audio Settings</h3>
      </template>
      <template v-slot:body>
        <div
          style="display: flex; flex-direction: column; align-items: center;"
        >
          <h3>Select an audio source:</h3>
          <select v-model="audioSelected">
            <option
              v-for="device in microphones"
              v-bind:value="device.deviceId"
              v-bind:key="device.deviceId"
            >
              {{ device.label }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:footer>
        <div
          style="display: flex; flex-direction: row; justify-content: flex-end;"
        >
          <button class="modal-default-button" @click="toggleAudioSettings">
            Cancel
          </button>
          <button class="modal-default-button" @click="onNewAudio">
            Apply
          </button>
        </div>
      </template>
    </modal>
    <modal v-if="showVideoSettings" v-on:close="toggleVideoSettings">
      <template v-slot:header>
        <h3>Video Settings</h3>
      </template>
      <template v-slot:body>
        <div
          style="display: flex; flex-direction: column; align-items: center;"
        >
          <h3>Select a video source:</h3>
          <select v-model="videoSelected">
            <option
              v-for="device in cameras"
              v-bind:value="device.deviceId"
              v-bind:key="device.deviceId"
            >
              {{ device.label }}
            </option>
          </select>
          <video
            style="width: 300px"
            ref="testVideoRef"
            class="overlay-video mirror-y"
          ></video>
        </div>
      </template>
      <template v-slot:footer>
        <div
          style="display: flex; flex-direction: row; justify-content: flex-end;"
        >
          <button class="modal-default-button" @click="toggleVideoSettings">
            Cancel
          </button>
          <button class="modal-default-button" @click="onNewVideo">
            Apply
          </button>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { SvgIcon } from "@/components/SvgIcon";
import { Modal } from "@/components/Modal";
import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import { useCameras } from "./useCameras";
import { useMicrophones } from "./useMicrophones";
import { computed } from "@vue/runtime-core";
import {
  fetchLocalStream,
  initStreamConfiguration
} from "@/store/modules/opentera";

export default {
  components: {
    SvgIcon,
    Modal
  },
  data() {
    return {
      showSettings: false,
      showAudioSettings: false,
      showVideoSettings: false,
      audioSelected: this.microphone.deviceId,
      videoSelected: this.camera.deviceId
    };
  },
  setup() {
    const { camera, cameras } = useCameras();
    const { microphone, microphones } = useMicrophones();

    const camerasLabels = computed(() => {
      cameras.value.map(device => device.label);
    });

    const microphonesLabels = computed(() => {
      microphones.value.map(device => device.label);
    });

    return {
      camera,
      cameras,
      camerasLabels,
      microphone,
      microphones,
      microphonesLabels
    };
  },
  methods: {
    toggleShowSettings() {
      this.showSettings = !this.showSettings;
    },
    toggleAudioSettings() {
      this.showAudioSettings = !this.showAudioSettings;
      this.showSettings = false;
    },
    toggleVideoSettings() {
      this.showVideoSettings = !this.showVideoSettings;
      this.showSettings = false;
    },
    async onNewAudio() {
      this.microphone = this.audioSelected;
      this.$store.commit(
        "localClient/openteraVideoConf/setLocalStream",
        await fetchLocalStream({
          video: { deviceId: { exact: this.camera.deviceId } },
          audio: { deviceId: { exact: this.audioSelected } }
        })
      );

      await this.reconnect();

      this.toggleAudioSettings();
    },
    async onNewVideo() {
      this.camera = this.videoSelected;
      this.$store.commit(
        "localClient/openteraVideoConf/setLocalStream",
        await fetchLocalStream({
          video: { deviceId: { exact: this.videoSelected } },
          audio: { deviceId: { exact: this.microphone.deviceId } }
        })
      );

      await this.reconnect();

      this.toggleVideoSettings();
    },
    async reconnect() {
      // TODO
      // HACK: Invalid
      // Here we access private member of the class. It's bad.
      // Instead we should create a state of those configuration in our StreamClientStore and in the SignalingClientStore.
      const signalingServerConfiguration = this.$store.state.localClient
        .openteraVideoConf.client._signalingServerConfiguration;
      const streamConfiguration = initStreamConfiguration(
        this.$store.state.localClient.openteraVideoConf.localStream
      );
      const rtcConfiguration = this.$store.state.localClient.openteraVideoConf
        .client._rtcConfiguration;

      this.$store.state.localClient.openteraVideoConf.client.close();
      this.$store.commit(
        "localClient/openteraVideoConf/setClient",
        new openteraWebrtcWebClient.StreamClient(
          signalingServerConfiguration,
          streamConfiguration,
          rtcConfiguration,
          this.$store.state.localClient.openteraVideoConf.logger
        )
      );

      await this.$store.dispatch(
        "localClient/openteraVideoConf/connectClientEvents"
      );
      await this.$store.state.localClient.openteraVideoConf.client.connect();
    },
    onClickAway() {
      this.showSettings = false;
    }
  },
  watch: {
    async videoSelected() {
      const testVideoRef = this.$refs.testVideoRef;
      testVideoRef.muted = true;
      testVideoRef.srcObject = await fetchLocalStream({
        video: { deviceId: { exact: this.videoSelected } },
        audio: { deviceId: { exact: this.microphone.deviceId } }
      });
      testVideoRef.autoplay = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./DeviceSettings.scss";
</style>
