<template>
  <div
    class="widget"
    v-bind:class="{ big: isExpanded, small: !isExpanded }"
    v-click-away="onClickAway"
  >
    <div class="header">
      <div class="title">Map</div>
      <button
        class="icon-button left expand-button-icon"
        type="button"
        v-on:click="toggleExpand"
      >
        <svg-icon v-show="isExpanded" icon="minimize"></svg-icon>
        <svg-icon v-show="!isExpanded" icon="expand"></svg-icon>
      </button>
    </div>
    <div
      class="body"
      v-on:click="onClickBody"
      v-bind:class="{ pointer: isExpanded }"
    >
      <video class="video" autoplay loop muted>
        <source src="./movie.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
  <div class="mask" v-if="isExpanded"></div>
</template>

<script>
import { SvgIcon } from "@/components/SvgIcon";

export default {
  name: "expandable-widget",
  components: {
    SvgIcon
  },
  data() {
    return {
      isExpanded: false
    };
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    onClickBody() {
      if (!this.isExpanded) {
        this.isExpanded = true;
      }
    },
    onClickAway() {
      if (this.isExpanded) {
        this.isExpanded = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ExpandableWidget.scss";
</style>
