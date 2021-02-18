<template>
    <navigation-bar
        brand="Opentera Developper Interface"
        v-bind:defaultPath="defaultPath"
        v-bind:links="links">
    </navigation-bar>
</template>

<script>
import { mapState } from "vuex";

import NavigationBar from '@/components/NavigationBar'

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
    }
}
</script>

<style lang="scss" scoped>
    @import "./DevelopperView.scss";
</style>