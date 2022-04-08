<template>
  <div
    class="div"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
    @mousemove="clearTimer"
    @touchstart="touchStart"
    @touchend="touchEnd"
  >
    <button
      class="toggle-button"
      :class="align"
      :style="{ color: color, 'text-align': align }"
      @click="togglePinned"
    >
      <span v-if="align === 'right'">{{ label }}</span>
      <span v-show="!hidden && hoverShown && !pinnedShown" class="icon"
        >&#x1F4CC;</span
      >
      <span v-show="!hidden && pinnedShown" class="icon">&#x1431;</span>
      <span v-show="hidden" class="icon">&#x142F;</span
      ><span v-if="align === 'left'">{{ label }}</span></button
    ><br />
    <div v-show="!hidden" class="inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "dropdown-menu",
  props: {
    label: {
      type: String,
      required: false,
      default: "",
    },
    color: {
      type: String,
      required: false,
      default: "#FFF",
    },
    align: {
      type: String,
      required: false,
      default: "left",
    },
    hoverTimeout: {
      type: Number,
      required: false,
      default: 400,
    },
  },
  data() {
    return {
      pinnedShown: false,
      hoverShown: false,
      timer: null,
      isTouched: false,
      enteredAsTouch: false,
    };
  },
  computed: {
    hidden() {
      return !this.pinnedShown && !this.hoverShown;
    },
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    resetTimer(timeout) {
      this.clearTimer();
      this.timer = setTimeout(this.timerTimeout, timeout, timeout);
    },
    mouseEnter() {
      if (this.isTouched) {
        this.enteredAsTouch = true;
        return;
      }
      this.enteredAsTouch = false;
      this.hoverShown = true;
      this.clearTimer();
    },
    timerTimeout(timeout) {
      const a = document.querySelector("#div:hover");
      if (a === null) {
        this.hoverShown = false;
      } else {
        this.timer = setTimeout(this.timerTimeout, timeout, timeout);
      }
    },
    mouseLeave(event) {
      if (this.enteredAsTouch) {
        return;
      }
      // Needed to fix a bug on Firefox where hovering above a <select> dropdown menu triggers the mouseleave event
      if (event.relatedTarget === null) {
        event.stopPropagation();
        this.resetTimer(2 * this.hoverTimeout);
      } else {
        this.resetTimer(this.hoverTimeout);
      }
    },
    togglePinned(event) {
      this.pinnedShown = !this.pinnedShown;
      if (event.pointerType === "mouse") {
        this.clearTimer();
      }
    },
    touchStart() {
      this.isTouched = true;
    },
    touchEnd() {
      setTimeout(() => {
        this.isTouched = false;
      }, 800);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./DropdownMenu.scss";
</style>
