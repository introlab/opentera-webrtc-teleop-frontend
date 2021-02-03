<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" v-bind:to="this.defaultPath">{{this.name}}</router-link>
      <button class="navbar-toggler" type="button" v-on:click="navToggler">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="flex-container navbar-collapse" v-show="this.showNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-for="link in links" v-bind:key="link.name">
            <router-link
              class="nav-link text-align-left"
              v-bind:to="link">
              {{ link.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navigation-bar",
  data() {
    return {
      showNav: false
    };
  },
  props: {
    name: {
      type: String,
      default: "NavBar"
    },
    links: {
      type: Array,
      required: true
    },
    defaultPath: {
      type: String,
      default: "/"
    }
  },
  methods: {
    navToggler() {
      this.showNav = this.showNav ? false : true;
    }
  }
};
</script>

<style>
.flex-container {
  display: flex;
}
.text-align-left {
  text-align: left !important;
}
</style>
