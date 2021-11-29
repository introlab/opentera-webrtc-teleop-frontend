<template>
  <div class="signal-bars">
    <div class="first-bar bar" v-bind:class="{ good: signalBars >= 1 }" />
    <div class="second-bar bar" v-bind:class="{ good: signalBars >= 2 }" />
    <div class="third-bar bar" v-bind:class="{ good: signalBars >= 3 }" />
    <div class="fourth-bar bar" v-bind:class="{ good: signalBars >= 4 }" />
    <div class="fifth-bar bar" v-bind:class="{ good: signalBars >= 5 }" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      signalBars: 0
    };
  },
  computed: {
    signalStrength() {
      return this.$store.state.localClient.openteraTeleop.status.wifiStrength;
    }
  },
  watch: {
    signalStrength() {
      this.onSignalStrengthChanged(this.signalStrength);
    }
  },
  methods: {
    onSignalStrengthChanged(strength) {
      this.signalBars = Math.ceil((strength / 100) * 5);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./SignalStrengthIndicator.scss";
</style>
