<template>
  <div class="video-with-overlay-container">
    <div class="video-with-overlay-video-overlay">
      <video ref="overlayVideoRef" class="video-with-overlay-video mirror-y" v-bind:id="overlayVideoId" v-show="showOverlayVideo"></video>
    </div>
    <div v-if="!clientList.length" class="placeholder-container grid-padding">
      <img class="placeholder-svg" src="../assets/person-bounding-box.svg" alt="Person Icon">
    </div>
    <div v-else class="grid-container grid-padding">
      <div v-if="isFullscreen">
        <!-- Laptops / Desktops  OR landscape tablets / large landscape phone-->
        <media query="(min-width: 992px) or ((min-width: 600px) and (max-width: 991.98px) and (orientation: landscape))">
          <div class="row g-0" v-bind:class="'row-cols-' + nColumns + ' rows-' + nRows" >
            <div class="col" v-for="client in clientList" v-bind:key="client.id">
              <base-video 
                v-bind:id="client.id" 
                v-bind:name="client.name" 
                v-bind:stream="client.stream" 
                v-bind:show-name="true">
              </base-video>
            </div>
          </div>
        </media>
        <!-- portrait tablets / large phones-->
        <media query="(min-width: 600px) and (max-width: 991.98px) and (orientation: portrait)">
          <div class="row g-0" v-bind:class="'row-cols-' + nRows + ' rows-' + nColumns" >
            <div class="col" v-for="client in clientList" v-bind:key="client.id">
              <base-video 
                v-bind:id="client.id" 
                v-bind:name="client.name" 
                v-bind:stream="client.stream" 
                v-bind:show-name="true">
              </base-video>
            </div>
          </div>
        </media>
        <!-- phones -->
        <media query="(max-width: 599.98px)">
          <base-video 
            v-bind:id="this.clientList[0].id" 
            v-bind:name="this.clientList[0].name" 
            v-bind:stream="this.clientList[0].stream" 
            v-bind:show-name="true">
          </base-video>
        </media>
      </div>
      <div v-else>
        <base-video 
          v-bind:id="this.clientList[0].id" 
          v-bind:name="this.clientList[0].name" 
          v-bind:stream="this.clientList[0].stream" 
          v-bind:show-name="true">
        </base-video>
      </div>      
    </div>
  </div>
</template>

<script>
import { ref, toRefs } from "vue";

import Media from './Media';
import BaseVideo from "./BaseVideo";

import useVideoOverlay from "../composables/VideoConference/useVideoOverlay";
import useVideosLayout from "../composables/VideoConference/useVideosLayout";

export default {
    name: 'video-conference',
    components: {
      Media,
      BaseVideo
    },
    props: {
      overlayVideoId : String,
      isFullscreen : Boolean,
      showOverlayVideo : Boolean,
      clientList: {
        type: Array
      }
    },
    setup(props) {
      const { clientList } = toRefs(props);

      const overlayVideoRef = ref(null);
      useVideoOverlay(overlayVideoRef);

      const { nColumns, nRows } = useVideosLayout(clientList);

      return {
        overlayVideoRef,
        nColumns,
        nRows
      };
    }
}
</script>

<style>
.video-with-overlay-container {
  width: 100%;
  height: 100%;
  display: flex;
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
  object-fit: cover;
}
.mirror-y {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}
.grid-container {
  width: 100%;
}
.grid-container > * {
  width: 100%;
  height: 100%;
}
.grid-padding {
  padding: .75rem !important;
}
.placeholder-container {
  background-color: var(--bs-gray-dark);
  width: 100%;
  height: 100%;
}
.placeholder-svg {
  height: 100%;
  width: 100%;
  padding: 5em;
}
.row {
  height: 100%;
}
.row > * {
  padding: .25rem !important;
}
.rows-1 > * {height: 100%;}
.rows-2 > * {height: 50%;}
.rows-3 > * {height: 33.33%;}
.rows-4 > * {height: 25%;}
.rows-5 > * {height: 20%;}
.rows-6 > * {height: 16.66%;}
.rows-7 > * {height: 14.29%;}
.rows-8 > * {height: 12.5%;}
</style>