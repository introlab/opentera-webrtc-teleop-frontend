<template>
  <select v-bind:name="name" v-bind:id="name" v-on:change="onChange(this)">
    <option
      v-for="opt in options"
      v-bind:value="opt.value"
      v-bind:key="opt.value"
      >{{ opt.text }}</option
    >
  </select>
</template>

<script>
export default {
  name: "dropdown",
  props: {
    name: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data: {
    recent: null,
  },
  data() {
    return {};
  },
  methods: {
    onChange(event) {
      alert(event.source.value);
      alert(event.target.value);
      this.recent = event.source.value;
      this.$emit("changed", event.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Dropdown.scss";
</style>
