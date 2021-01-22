<template>
  <opentera-wrapper-component/>
</template>

<script>
import OpenteraWrapperComponent from "./components/OpenteraWrapperComponent"

export default {
  name: "App",
  components: {
    OpenteraWrapperComponent
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
  margin-top: 60px;
}
</style>
