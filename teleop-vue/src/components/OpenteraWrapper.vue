<template>
  <div>
    <header class="header">
      <slot name="header"></slot>
    </header>
    <main class="main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { onMounted } from 'vue';

import useLocalStream from "../composables/OpenteraWrapper/useLocalStream";
import useStreamClient from "../composables/OpenteraWrapper/useStreamClient";
import useEvents from "../composables/OpenteraWrapper/useEvents";

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

    useEvents(streamClient);

    onMounted(connect);

    return {
      localStream,
      clientList,
      streamClient,
      connect
    };
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
  max-height: var(--header-height);
}
.main {
  position: absolute;
  top: var(--header-height);
  width: 100%;
  height: 100%;
  max-height: calc(100vh - var(--header-height));
}
</style>
