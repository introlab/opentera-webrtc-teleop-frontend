<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <TestClient msg="OpenTera Test for WebRTC VUE components" />
</template>

<script>
import TestClient from "./components/TestClient.vue";

export default {
  name: "App",
  components: {
    TestClient
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
