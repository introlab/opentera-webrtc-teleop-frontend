<template>
  <div class="popup" v-if="shown">
    <div class="popup-inner">
      <div>
        <slot></slot>
      </div>
      <span class="popup-buttons">
        <action-button
          class="popup-button"
          :label="cancelLabel"
          @click="cancelPressed"
        />
        <action-button
          class="popup-button"
          :label="okLabel"
          :disabled="!okEnabled"
          @click="okPressed"
        />
      </span>
    </div>
  </div>
</template>

<script>
import ActionButton from "@/components/ActionButton/ActionButton.vue";

export default {
  name: "popup",
  components: {
    ActionButton,
  },
  props: {
    okLabel: {
      type: String,
      required: false,
      default: "OK",
    },
    cancelLabel: {
      type: String,
      required: false,
      default: "Cancel",
    },
    okEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    shown: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    cancelPressed() {
      this.$emit("cancel");
    },
    okPressed() {
      this.$emit("ok");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Popup.scss";
</style>
