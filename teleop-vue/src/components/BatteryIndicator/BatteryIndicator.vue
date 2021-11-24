<template>
  <div class="battery-indicator">
    <div class="battery">
      <div class="top"></div>
      <div class="outer">
        <svg-icon icon="charging" class="charging" v-if="isCharging" />
        <div
          v-else
          v-for="n in nbOfChargeBars"
          v-bind:key="n"
          class="inner"
          v-bind:class="{
            hidden: n <= nbOfChargeBars - chargeBars,
            charging: isCharging
          }"
        />
      </div>
    </div>
    <div class="percentage-box">
      <div class="percentage">{{ batteryLevel }}%</div>
    </div>
  </div>
</template>

<script>
import { SvgIcon } from "@/components/SvgIcon";

export default {
  name: "battery-indicator",
  components: {
    SvgIcon
  },
  data() {
    return {
      chargeBars: 0,
      nbOfChargeBars: 6
    };
  },
  computed: {
    batteryLevel() {
      return Math.floor(
        this.$store.state.localClient.openteraTeleop.status.batteryLevel
      );
    },
    isCharging() {
      return this.$store.state.localClient.openteraTeleop.status.isCharging;
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
