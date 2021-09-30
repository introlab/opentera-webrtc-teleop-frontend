<template>
  <button class="stop-button" type="button" v-on:click="onStop">
    <div>Stop</div>
  </button>
</template>

<script>
export default {
  name: "stop-button",
  data() {
    return {
      showNav: false
    };
  },
  methods: {
    onStop() {
      console.log("Clicked stop");
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "stop", state: true })
        );
        console.log("Sent stop message");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./StopButton.scss";
</style>
