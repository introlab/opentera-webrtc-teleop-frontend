<template>
  <div v-if="matches" class="full-height">
    <slot />
  </div>
</template>

<script>
export default {
  name: "media-query",
  props: {
    query: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      matches: this.visible,
      mediaQueryList: null,
    };
  },
  methods: {
    updateMatches() {
      this.matches = this.mediaQueryList.matches;
    },
  },
  mounted() {
    this.mediaQueryList = window.matchMedia(this.query);
    this.updateMatches();
    this.mediaQueryList.addListener(this.updateMatches);
  },
  beforeUnmount() {
    if (this.mediaQueryList)
      this.mediaQueryList.removeListener(this.updateMatches);
  },
};
</script>

<style scoped>
.full-height {
  height: 100%;
}
</style>
