<template>
    <div>
        <header class="header">
            <navigation-bar
                v-bind:brand="brand"
                v-bind:defaultPath="defaultPath"
                v-bind:links="links">
            </navigation-bar>
        </header>
        <main class="main bg-primary-dark">
            <router-view/>
        </main>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { NavigationBar } from '@/components/NavigationBar';

export default {
    name: "default-template",
    components: {
        NavigationBar
    },
    props: {
        brand: String,
        route: String,
        client: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters([
            "router/getSubRoutes"
        ]),

        links() {
            return this['router/getSubRoutes'](this.route); // see src/store/modules/router.ts
        },

        defaultPath() {
            return this.$store.state.router[this.route].defaultPath;
        }
    },
    created() {
        const name = this.client.name ? this.client.name : "Undefined";
        this.$store.dispatch("opentera/initialize", { name: name, data: {}, room: "chat", password: this.client.password }).then(() => {
            this.$store.dispatch("opentera/connectStreamClient").then(() => console.log("CONNECTED"));
        });
    }
}
</script>

<style lang="scss" scoped>
    @import "./DefaultTemplate.scss";
</style>