<template>
  <div>
    <header class="header">
      <slot name="header"></slot>
    </header>
    <main class="main">
      <router-view
        v-on:call-all="callAll"
        v-on:hang-up-all="hangUpAll">
      </router-view>
    </main>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import useLocalStream from "../composables/OpenteraWrapper/useLocalStream";
import useStreamClient from "../composables/OpenteraWrapper/useStreamClient";

export default {
  name: "opentera-wrapper",
  props: {
    name: String,
    data: Object,
    room: String
  },
  setup(props) {
    const { localStream } = useLocalStream();

    const { clientList, streamClient, connect } = useStreamClient(props, localStream);

    onMounted(connect);

    return {
      localStream,
      clientList,
      streamClient,
      connect
    };
  },
  methods: {
    callAll() {
      this.streamClient.callAll();
    },
    hangUpAll() {
      this.streamClient.hangUpAll();
    }
  }
};
</script>

<style>
:root {
  --header-height: 56px
}
.header {
  position: absolute;
  top: 0;
  z-index: 3;
  width: 100%;
  height: var(--header-height);
}
.main {
  position: absolute;
  top: --header-height;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - --header-height);
}
</style>
