<template>
  <div>
    <div class="shadow card bg-dark">
      <div class="card-body">
        <video-conference
          overlay-video-id="overlayVideo"
          v-bind:client-list="clientList"
          v-bind:is-fullscreen="true"
          v-bind:show-overlay-video="true"
        >
        </video-conference>
      </div>
    </div>
    <button v-on:click="connect">Connect</button>
    <button v-on:click="callAll">Call all</button>
    <button v-on:click="hangUpAll">Hang up</button>
  </div>
</template>

<script>
import VideoConference from "../components/VideoConference";

export default {
    name: "conference-view",
    components: {
        VideoConference
    },
    emits : [
        "connect",
        "callAll",
        "hangUpAll"
    ],
    methods: {
        connect() {
            this.$emit("connect");
        },
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

</style>