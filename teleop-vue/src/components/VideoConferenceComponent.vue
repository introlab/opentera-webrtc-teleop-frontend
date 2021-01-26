<template>
  <div class="video-with-overlay-container">
    <div class="video-with-overlay-video-overlay">
      <video class="video-with-overlay-video mirror-y" v-bind:id="overlayVideoId" v-show="showOverlayVideo"></video>
    </div>
    <div class="container-fluid grid-padding">
      <div class="row g-2" v-bind:class="'row-cols-' + columnsToDisplay">
        <div class="col" v-for="client in clientsVideo" v-bind:key="client.id">
          <base-video-component v-bind:id="client.id" v-bind:name="client.name" v-bind:stream="client.stream" v-bind:show-name="true"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseVideoComponent from "./BaseVideoComponent"

import openteraWebrtcWebClient from "opentera-webrtc-web-client";

export default {
    name: 'video-conference-component',
    components: {
        BaseVideoComponent
    },
    data() {
        return {
            overlayVideo : null
        }
    },
    props: {
        overlayVideoId : String,
        showOverlayVideo : Boolean,
        clientsVideo: {
            type: Array
        }
    },
    computed: {
      // Compute the quantity of columns to display with the number of clients
      columnsToDisplay() {
        let nClients = this.clientsVideo.length;
        if (nClients === 0)
          return 0;

        for (let i = 1; i < 8; i++){
          if (nClients > Math.pow(i-1, 2) && nClients <= Math.pow(i, 2))
            return i;
        }
        alert("More than 64 for user the GUI can't handle as many");
        return 8;
      }
    },
    mounted() {
        // Setup local video
        this.overlayVideo = document.getElementById(this.overlayVideoId);
        this.overlayVideo.muted = true;
        this.overlayVideo.classList.add("mirror-y");
        openteraWebrtcWebClient.devices.getDefaultStream().then(stream => {
            this.overlayVideo.srcObject = stream;
            this.overlayVideo.autoplay = true;
        });
    }
}
</script>

<style>
.video-with-overlay-container {
  display: inline-block;
  position: relative;
}
.video-with-overlay-video-overlay {
  position: absolute;
  right: 0px;
  bottom: 0px;
  margin: 10px;
  padding: 5px 5px;
  width: 20%;
  height: 20%;
  z-index: 1;
}
.video-with-overlay-video {
  width: 100%;
  height: 100%;
}
.mirror-y {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}
.grid-padding {
  padding: .75rem .75rem .75rem .75rem;
}
</style>