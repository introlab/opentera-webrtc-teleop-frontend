<template>
    <div>
        <header class="header">
            <navigation-bar
                brand="Opentera Developper Interface"
                v-bind:defaultPath="defaultPath"
                v-bind:links="links">
            </navigation-bar>
        </header>
        <main class="main">
            <router-view/>
        </main>
    </div>
</template>

<script>
import { mapState } from "vuex";

import { NavigationBar } from '@/components/NavigationBar'

export default {
    name: "developper-view",
    components: {
        NavigationBar
    },
    computed: {
        ...mapState({
            links: state => {
                const dev = state.router.dev.childrens;
                return [
                    {
                        name: dev.dashboard.name,
                        params: {}
                    },
                    {
                        name: dev.conference.name,
                        params: {}
                    },
                    {
                        name: dev.map.name,
                        params: {}
                    }
                ];
            },
            defaultPath: state => {
                return state.router.dev.defaultPath
            }
        })
    },
    mounted() {
        this.$store.dispatch("opentera/initialize", { name: "Gab", data: {}, room: "chat" }).then(() => {
            this.$store.dispatch("opentera/connectStreamClient").then(() => console.log("CONNECTED"));
        });
    }
}
</script>

<style lang="scss" scoped>
    @import "./DevelopperView.scss";

:root {
  --header-height: 
}
.header {
  position: absolute;
  top: 0;
  z-index: 3;
  width: 100%;
  height: 50px;
  max-height: 56px;
}
.main {
  position: absolute;
  top: 50px;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 50px);
  overflow: hidden;
}
</style>