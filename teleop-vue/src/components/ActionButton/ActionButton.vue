<template>
  <button class="action-button" type="button" v-on:click="onClick">
    <div>{{ label }}</div>
  </button>
</template>

<script>
export default {
  name: "action-button",
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    onClick() {
      this.$emit("clicked");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./ActionButton.scss";
</style>
