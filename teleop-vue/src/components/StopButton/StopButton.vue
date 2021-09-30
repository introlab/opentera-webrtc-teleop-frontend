<template>
  <button class="stop-button" type="button" v-on:click="onStop">
    <div>Stop</div>
  </button>
</template>

<script>
export default {
  name: "stop-button",
  data() {
    return {};
  },
  methods: {
    onStop() {
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "stop", state: true })
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./StopButton.scss";
</style>
