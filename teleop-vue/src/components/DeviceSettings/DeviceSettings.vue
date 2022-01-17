<template>
  <div class="mask" />
  <div class="modal" v-click-away="toggleShowSettings">
    <h3>Device Settings</h3>
    <div class="row">
      <p style="margin-right: 1rem">Select audio device:</p>
      <select v-model="audioSelected" id="audioSelector">
        <option
          v-for="device in microphones"
          v-bind:value="device.deviceId"
          v-bind:key="device.deviceId"
        >
          {{ device.label }}
        </option>
      </select>
    </div>
    <div class="row">
      <p style="margin-right: 1rem">Select video device:</p>
      <select v-model="videoSelected" id="videoSelector">
        <option
          v-for="device in cameras"
          v-bind:value="device.deviceId"
          v-bind:key="device.deviceId"
        >
          {{ device.label }}
        </option>
      </select>
    </div>
    <video
      style="width: 300px; background-color: black"
      ref="testVideoRef"
      class="mirror-y"
    ></video>
    <div class="row">
      <button @click="toggleShowSettings">Cancel</button>
      <button @click="onNewDevice">Apply</button>
    </div>
  </div>
</template>

<script>
import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import { useCameras } from "./useCameras";
import { useMicrophones } from "./useMicrophones";
import { computed } from "@vue/runtime-core";
import {
  fetchLocalStream,
  initStreamConfiguration,
} from "@/store/modules/opentera";

export default {
  data() {
    return {
      audioSelected: this.microphone.deviceId,
      videoSelected: this.camera.deviceId,
    };
  },
  setup() {
    const { camera, cameras } = useCameras();
    const { microphone, microphones } = useMicrophones();

    const camerasLabels = computed(() => {
      cameras.value.map((device) => device.label);
    });

    const microphonesLabels = computed(() => {
      microphones.value.map((device) => device.label);
    });

    return {
      camera,
      cameras,
      camerasLabels,
      microphone,
      microphones,
      microphonesLabels,
    };
  },
  computed: {
    localStream() {
      return this.$store.state.localClient.openteraVideoConf.localStream;
    },
  },
  methods: {
    async onNewDevice() {
      this.microphone = this.audioSelected;
      this.camera = this.videoSelected;
      this.$store.commit(
        "localClient/openteraVideoConf/setLocalStream",
        await fetchLocalStream({
          video: { deviceId: { exact: this.videoSelected } },
          audio: { deviceId: { exact: this.audioSelected } },
        })
      );
      await this.reconnect();
      this.toggleShowSettings();
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
    toggleShowSettings() {
      this.$store.commit("localClient/openteraVideoConf/toggleShowSettings");
    },
    async connectStreamPreview() {
      const testVideoRef = this.$refs.testVideoRef;
      testVideoRef.muted = true;
      testVideoRef.srcObject = await fetchLocalStream({
        video: { deviceId: { exact: this.videoSelected } },
        audio: { deviceId: { exact: this.microphone.deviceId } },
      });
      testVideoRef.autoplay = true;
    },
  },
  watch: {
    async videoSelected() {
      await this.connectStreamPreview();
    },
    cameras() {
      this.videoSelected = this.cameras[0].deviceId;
    },
    microphones() {
      this.audioSelected = this.microphones[0].deviceId;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./DeviceSettings.scss";
</style>
