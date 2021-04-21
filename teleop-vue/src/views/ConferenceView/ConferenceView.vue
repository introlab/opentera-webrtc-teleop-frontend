<template>
    <div class="container-fluid bg-primary-dark" v-on:mousemove="showToolbar">
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

import { BusyException } from "@/store/modules/opentera";

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
    data() {
        return {
            client: null
        }
    },
    props: {
        name: String,
        data: Object,
        room: String,
        password: String
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
            return this.$store.state.localClient.openteraVideoConf.clientsInCall;
        },
        clientsInRoom() {
            return this.$store.state.localClient.openteraVideoConf.clientsInRoom;
        },
        showParticipants() {
            return this.$store.state.localClient.openteraVideoConf.showParticipants;
        }
    },
    beforeMount() {
        this.client = {
            name: this.name,
            data: this.data,
            room: "VideoConf",//this.room,
            password: this.password
        }

        // this.$store.dispatch("openteraVideoConf/initAndConnect", this.client)
        //     .then(() => console.log("CONNECTED")) // Do something after ther connection
        //     .catch(err => {
        //         if (!(err instanceof BusyException))
        //             console.log(err)
        //     });
        this.$store.dispatch("localClient/openteraVideoConf/start", this.client)
            .then(() => console.log("CONNECTED")) // Do something after ther connection
            .catch(err => {
                if (!(err instanceof BusyException))
                    console.log(err)
            });
    },
    activated() {
        // Reactivate the local video when it's render from cache
        const overlayVideo = this.$refs.overlayVideoRef;
        overlayVideo.muted = true;
        overlayVideo.srcObject = this.$store.state.localClient.openteraVideoConf.localStream;
        overlayVideo.autoplay = true;
    },
    unmounted() {
        //this.$store.dispatch("openteraVideoConf/destroy");
        this.$store.dispatch("localClient/destroy");
    }
}
</script>

<style lang="scss" scoped>
    @import "./ConferenceView.scss";
</style>