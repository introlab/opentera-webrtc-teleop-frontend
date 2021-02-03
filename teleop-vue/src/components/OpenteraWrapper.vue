<template>
  <div>
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <router-view 
        v-on:connect="connect"
        v-on:call-all="callAll"
        v-on:hang-up-all="hangUpAll">
      </router-view>
    </main>
  </div>
</template>

<script>
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
.card-body {
  height: 100%;
}
</style>
