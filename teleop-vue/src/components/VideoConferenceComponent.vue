<template>
  <div class="video-with-overlay-outer-container">
      <div class="video-with-overlay-inner-container">
          <div class="video-with-overlay-video-overlay">
              <video v-bind:id="overlayVideoId" class="video-with-overlay-video" v-show="showOverlayVideo"></video>
          </div>
          <div v-for="client in clientsVideo" v-bind:key="client.id">
                <base-video-component v-bind:id="client.id" v-bind:name="client.name" v-bind:stream="client.stream" v-bind:show-name="true"/>
          </div>
          <!--video id="fullscreenVideo" class="video-with-overlay-video"></video-->
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
        /* clientsVideo : [{
            id : String,
            name : String,
            stream : {}
        }] */
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
.video-with-overlay-outer-container {
  width: 100%;
  height: 100%;
  text-align: center;
}
.video-with-overlay-inner-container {
  width: 100%;
  height: 100%;
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
</style>