<template>
  <button class="reset-button" type="button" v-on:click="onClick">
    <div>Reset</div>
  </button>
</template>

<script>
export default {
  name: "reset-button",
  data() {
    return {};
  },
  methods: {
    onClick() {
      this.$emit("resetClicked");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ResetButton.scss";
</style>
