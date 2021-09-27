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
      <video ref="video" class="map-video" v-on:click="onMapClick" autoplay />
    </div>
  </div>
  <div class="mask" v-if="isExpanded"></div>
</template>

<script>
import { SvgIcon } from "@/components/SvgIcon";
import { VideoParticipant } from "@/components/VideoParticipant";

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
  computed: {
    mapClientStream() {
      if (this.$store.state.localClient.openteraMap.clientsInCall.length > 0) {
        return this.$store.state.localClient.openteraMap.clientsInCall[0]
          .stream;
      } else {
        return null;
      }
    }
  },
  watch: {
    mapClientStream(newStream) {
      this.$refs.video.srcObject = newStream;
    }
  },
  mounted() {
    this.$refs.video.srcObject = this.mapClientStream;
  },
  activated() {
    this.$refs.video.srcObject = this.mapClientStream;
    this.$refs.video.autoplay = true;
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
    onMapClick(event) {
      if (this.isExpanded) {
        console.log("Map click");
        const target = event.target;
        const rect = target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        console.log("Coord: x=" + x + " y=" + y);
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
