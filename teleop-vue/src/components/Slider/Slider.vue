<template>
  <div class="slidercontainer">
    <input
      type="range"
      min="1"
      max="100"
      value="80"
      class="slider"
      id="myRange"
      onkeydown="event.preventDefault()"
      @input="onInput"
    />
    <div class="text">Max speed: {{ speed }}%</div>
  </div>
</template>

<script>
export default {
  name: "slider",
  data() {
    return {
      speed: 0
    };
  },
  emits: ["maxSpeedChangedEvent"],
  mounted() {
    this.onInput();
  },
  methods: {
    onInput() {
      this.speed = document.getElementById("myRange").value;
      this.emitMaxSpeedChanged();
    },
    emitMaxSpeedChanged() {
      this.$emit("maxSpeedChangedEvent", this.speed / 100);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./Slider.scss";
</style>
