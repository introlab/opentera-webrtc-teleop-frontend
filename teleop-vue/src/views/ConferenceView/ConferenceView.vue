<template>
    <div class="container-fluid" v-on:mousemove="showToolbar">
        <div class="container-fluid bg-primary-dark">
            <video-conference 
                v-bind:clients-list="clientsInCall">
            </video-conference>
        </div>
        <div ref="toolbarRef" class="toolbar">
            <video 
                ref="overlayVideoRef"
                id="overlayVideo"
                class="overlay-video mirror-y">
            </video>
            <button-conference/>
        </div>
    </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import useToolbar from "./useToolbar";
import useVideoLayout from "./useVideoOverlay";

import { VideoConference } from "@/components/VideoConference";
import { ButtonConference } from '@/components/ButtonConference';
import { useStore } from 'vuex';

export default {
    name: "conference-view",
    components: {
        VideoConference,
        ButtonConference
    },
    setup() {

        const toolbarRef = ref(null);
        const overlayVideoRef = ref(null);

        useVideoLayout(overlayVideoRef);
        const { showToolbar } = useToolbar(toolbarRef, overlayVideoRef);

        return {
            toolbarRef,
            overlayVideoRef,
            showToolbar
        }
    },
    computed: {
        clientsInCall() {
            return this.$store.state.opentera.clientsInCall;
        },
        clientsInRoom() {
            return this.$store.state.opentera.clientsInRoom;
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "./ConferenceView.scss";
</style>