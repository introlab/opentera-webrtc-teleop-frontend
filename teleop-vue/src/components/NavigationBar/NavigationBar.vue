<template>
    <nav class="navbar bg-secondary-dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" v-bind:to="defaultPath">{{brand}} |</router-link>
            <button class="icon-button navbar-toggler" type="button" v-on:click="navToggler">
                <svg-icon class="navbar-toggler-icon" icon="list"></svg-icon>
            </button>
            <div class="flex-container navbar-collapse" v-show="showNav">
                <ul ref="nav" class="navbar-nav">
                    <li v-for="link in links" v-bind:key="link.name">
                        <router-link
                            class="nav-link"
                            v-bind:to="link">
                            {{link.meta.name}}
                        </router-link>
                    </li>
                </ul>
            </div>
            <button class="icon-button navbar-collapse justify-end" type="button" v-show="showNav" v-on:click="null">
                <svg-icon class="navbar-toggler-icon navbar-nav" icon="gear"></svg-icon>
            </button>
        </div>
    </nav>
</template>

<script>
import { SvgIcon } from "@/components/SvgIcon";

export default {
    name: "navigation-bar",
    components: {
        SvgIcon
    },
    data() {
        return {
            showNav: false
        }
    },
    props: {
        brand: {
            type: String,
            required: true
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
            this.showNav = !this.showNav;
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "./NavigationBar.scss";
</style>