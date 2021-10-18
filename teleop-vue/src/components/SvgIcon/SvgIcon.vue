<template>
  <div ref="svg" v-html="fetchIcon" class="svg-container" />
</template>

<script>
export default {
  name: "svg-icon",
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  computed: {
    fetchIcon() {
      return require(`!!raw-loader!@/assets/${this.icon}.svg`).default;
    }
  },
  mounted() {
    if (this.$refs.svg.firstElementChild.nodeName === "svg") {
      const svgElement = this.$refs.svg.firstElementChild;
      svgElement.setAttribute("width", "100%");
      svgElement.setAttribute("height", "100%");
      svgElement.classList.add("svg-class");
    }
  }
};
</script>

<style lang="scss" scoped>
.svg-container {
  width: 100%;
  height: 100%;
}
</style>
