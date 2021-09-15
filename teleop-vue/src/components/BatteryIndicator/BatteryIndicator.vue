<template>
  <div class="battery-indicator">
    <div class="battery">
      <div class="top"></div>
      <div class="outer">
        <div
          v-for="n in nbOfChargeBars"
          v-bind:key="n"
          class="inner"
          v-bind:class="{ hidden: n <= 5 - chargeBars }"
        />
      </div>
    </div>
    <p class="percentage">{{ chargePercentage }}%</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chargeBars: 0,
      nbOfChargeBars: 5,
      chargePercentage: 20
    };
  },
  created() {
    this.onChargePercentageChanged(this.chargePercentage);
  },
  methods: {
    onChargePercentageChanged(newPercentage) {
      this.chargePercentage = newPercentage;
      this.chargeBars = Math.ceil(
        (this.chargePercentage / 100) * this.nbOfChargeBars
      );
    }
  }
};
</script>

<style lang="scss" scoped>
// FIXME: Should not depend on css from parent component
@import "../NavigationBar/NavigationBar.scss";
@import "./BatteryIndicator.scss";
</style>
