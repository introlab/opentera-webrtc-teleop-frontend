<template>
  <router-link to="/dev">Click on this link to be redirect</router-link>
  <router-view v-slot="{ Component }">
    <keep-alive v-bind:include="/.*-view$/">
       <component v-bind:is="Component"/>
    </keep-alive>
  </router-view>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
