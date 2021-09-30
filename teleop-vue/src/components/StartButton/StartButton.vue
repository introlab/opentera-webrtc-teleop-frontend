<template>
  <button class="start-button" type="button" v-on:click="onClick">
    <div>Start</div>
  </button>
</template>

<script>
export default {
  name: "start-button",
  data() {
    return {};
  },
  methods: {
    onClick() {
      this.$emit("startClicked");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./StartButton.scss";
</style>
