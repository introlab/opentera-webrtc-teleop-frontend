<template>
    <opentera-wrapper  v-bind="{ name: 'Client Name', data: {}, room: 'chat'}">
        <template v-slot:header>
            <navigation-bar 
                name="Opentera Developper Interface"
                defaultPath="/dev/dashboard"
                v-bind:links="this.links">
            </navigation-bar>
        </template>
    </opentera-wrapper>
    <!-- <div>
        <navigation-bar 
            name="Opentera Developper Interface"
            defaultPath="/dev/dashboard"
            v-bind:links="this.links">
        </navigation-bar>
        <router-view></router-view>
    </div> -->
</template>

<script>
import store from '../store';
import NavigationBar from '../components/NavigationBar'
import OpenteraWrapper from '../components/OpenteraWrapper'

const devChildrens = store.links.dev.childrens;

export default {
    name: "developer-view",
    data() {
        return {
            links: [
                { name: devChildrens.dashboard.name, params: { name: devChildrens.dashboard.name, params: {} }},
                { name: devChildrens.conference.name, params: { name: devChildrens.conference.name, params: {} }},
                { name: devChildrens.conference.name, params: { name: devChildrens.map.name, params: {} }}
            ]
        }
    },
    components: {
        NavigationBar,
        OpenteraWrapper 
    }    
}
</script>

<style>

</style>