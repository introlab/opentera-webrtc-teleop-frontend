<template>
    <div class="container-fluid" v-on:mousemove="showToolbar">
        <div class="container-fluid">
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
        <transition name="participants">
            <participants-list v-if="showParticipants"
                v-bind:clients-in-call="clientsInCall"
                v-bind:clients-in-room="clientsInRoom">
            </participants-list>
        </transition>
    </div>
</template>

<script>
import { ref } from "vue";

import useToolbar from "./useToolbar";
import useVideoLayout from "./useVideoOverlay";

import { VideoConference } from "@/components/VideoConference";
import { ButtonConference } from '@/components/ButtonConference';
import { ParticipantsList } from "@/components/ParticipantsList";

export default {
    name: "conference-view",
    components: {
        VideoConference,
        ButtonConference,
        ParticipantsList
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
        },
        showParticipants() {
            return this.$store.state.opentera.showParticipants;
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "./ConferenceView.scss";
</style>