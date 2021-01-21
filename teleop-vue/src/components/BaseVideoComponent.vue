<template>
    <div class="base-video-outer-container">
        <div class="base-video-inner-container">
            <div class="base-video-name-layout" v-show="showName">
                <p>{{ name }}</p>
            </div>
            <video autoplay v-bind:id="id"></video>
        </div>
    </div>
</template>

<script>
export default {
    name: 'base-video-component',
    props: {
        id : String,
        name : String,
        stream: {},
        showName : Boolean
    },
    mounted() {
      document.getElementById(this.id).srcObject = this.stream;
    }
}
</script>

<style>
.base-video-outer-container {
  width: 100%;
  height: 100%;
  text-align: center;
}
.base-video-inner-container {
  width: 100%;
  height: 100%;
  display: inline-block;
  position: relative;
}
.base-video-name-layout {
  position: absolute;
  left: 0px;
  bottom: 0px;
  margin: 10px;
  padding: 5px 5px;
  width: 20%;
  height: 20%;
}
</style>