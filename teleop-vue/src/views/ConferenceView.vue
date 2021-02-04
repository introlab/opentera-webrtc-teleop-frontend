<template>
  <div class="full-height">
    <div class="flex-outer-container full-height bg-dark">
      <div class="flex-inner-container full-height">
        <video-conference
          overlay-video-id="overlayVideo"
          v-bind:client-list="clientList"
          v-bind:is-fullscreen="true"
          v-bind:show-overlay-video="true"
        >
        </video-conference>
      </div>
    </div>
    <button-conference 
        v-on:call-all="callAll"
        v-on:hang-up-all="hangUpAll">
    </button-conference>
  </div>
</template>

<script>
import VideoConference from "../components/VideoConference";
import ButtonConference from "../components/ButtonConference";

export default {
    name: "conference-view",
    components: {
        VideoConference,
        ButtonConference
    },
    emits : [
        "callAll",
        "hangUpAll"
    ],
    methods: {
        callAll() {
            this.$emit("callAll");
        },
        hangUpAll() {
            this.$emit("hangUpAll");
        }
    },
    computed: {
        clientList() {
            return this.$store.state.opentera.clientList;
        }
    }
}
</script>

<style>
.flex-outer-container {
    position: relative;
    display: flex;
    background-clip: border-box;
}
.flex-inner-container {
    flex: 1 1 auto;
    padding: 1rem 1rem;
}
.full-height {
    height: 100%;
}
.button-controler {
    position: absolute;
    align-content: center;
    right: 50%;
    left: 50%;
    margin: 10px;
    padding: 5px 5px;
    z-index: 1;
}
</style>