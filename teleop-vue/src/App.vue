<template>
  <opentera-wrapper/>
</template>

<script>
import OpenteraWrapper from "./components/OpenteraWrapper"

export default {
  name: "App",
  components: {
    OpenteraWrapper
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
