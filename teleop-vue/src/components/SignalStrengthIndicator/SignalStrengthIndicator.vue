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
      signalBars: 3,
      signalStrength: 0
    };
  },
  methods: {
    onSignalStrengthChanged(newSignalStrength) {
      this.signalStrength = newSignalStrength;
      this.signalBars = Math.ceil((this.signalStrength / 100) * 5);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./SignalStrengthIndicator.scss";
</style>
