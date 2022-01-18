<template>
  <span class="span">
    <label class="label">{{ label }}</label>
    <select
      ref="select"
      class="select"
      v-bind:name="name"
      v-bind:id="name"
      v-on:change="onChange"
    >
      <option
        v-for="opt in options"
        v-bind:value="opt.value"
        v-bind:key="opt.value"
        >{{ opt.text }}</option
      >
    </select>
  </span>
</template>

<script>
export default {
  name: "dropdown",
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      recent: null,
    };
  },
  methods: {
    onChange() {
      this.$emit("changed", { new: this.$refs.select.value, old: this.recent });
      this.recent = this.$refs.select.value;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Dropdown.scss";
</style>
