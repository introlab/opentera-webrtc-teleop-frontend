<template>
  <opentera-wrapper v-bind="{ name: 'Client Name', data: {}, room: 'chat' }">
    <template v-slot:header>
      <navigation-bar
        name="Opentera Developper Interface"
        v-bind:defaultPath="defaultPath"
        v-bind:links="links">
      </navigation-bar>
    </template>
  </opentera-wrapper>
</template>

<script>
import { mapState } from "vuex";

import NavigationBar from "../components/NavigationBar";
import OpenteraWrapper from "../components/OpenteraWrapper";

export default {
    name: "developer-view",
    components: {
        NavigationBar,
        OpenteraWrapper
    },
    computed: {
        ...mapState({
            links: state => {
                let dev = state.links.dev.childrens;
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
                return state.links.dev.defaultPath;
            }
        })
    }
};
</script>

<style></style>
