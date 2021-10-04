<template>
  <div class="battery-indicator">
    <div class="battery">
      <div class="top"></div>
      <div class="outer">
        <div
          v-for="n in nbOfChargeBars"
          v-bind:key="n"
          class="inner"
          v-bind:class="{ hidden: n <= nbOfChargeBars - chargeBars }"
        />
      </div>
    </div>
    <div class="percentage-box">
      <div class="percentage">{{ batteryLevel }}%</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chargeBars: 0,
      nbOfChargeBars: 6,
    };
  },
  computed: {
    batteryLevel() {
      return this.$store.state.localClient.openteraTeleop.batteryLevel;
    }
  },
  watch: {
    batteryLevel() {
      this.onBatteryLevelChanged(this.batteryLevel);
    }
  },
  methods: {
    onBatteryLevelChanged(level) {
      this.chargeBars = Math.round((level / 100) * this.nbOfChargeBars);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./BatteryIndicator.scss";
</style>
