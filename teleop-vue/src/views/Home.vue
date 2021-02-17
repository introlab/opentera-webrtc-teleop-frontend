<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <button @click="callAll">CallAll</button>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";

import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld
  },
  setup() {
    const store = useStore();
    store.dispatch("opentera/initialize", { name: "Gab", data: {}, room: "chat" }).then(() =>
      store.dispatch("opentera/connectStreamClient").then(() => console.log("CONNECTED: ", store.state.opentera.localClient))
    );
    

    const callAll = () => {
      store.state.opentera.streamClient.callAll();
    }

    return {
      callAll
    }
  }
});
</script>
