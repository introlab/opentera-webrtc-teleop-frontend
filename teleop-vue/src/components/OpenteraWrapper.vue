<template>
    <div>
        <div class="shadow card bg-dark">
            <div class="card-body">
                <video-conference
                    overlay-video-id="overlayVideo"
                    v-bind:client-list="clientList"
                    v-bind:show-overlay-video="true">
                </video-conference>
            </div>
        </div>
        <button v-on:click="connect">Connect</button>
        <button v-on:click="callAll">Call all</button>
        <button v-on:click="hangUpAll">Hang up</button>
    </div>
</template>

<script>
import VideoConference from "./VideoConference";

import useLocalStream from "../composables/OpenteraWrapper/useLocalStream";
import useStreamClient from "../composables/OpenteraWrapper/useStreamClient";

export default {
    name: 'opentera-wrapper',
    components: {
        VideoConference
    },
    props: {
        name: String,
        data : Object,
        room: String
    },
    setup(props) {

        const { localStream } = useLocalStream();
        
        const { clientList, streamClient, connect } = useStreamClient(props, localStream);

        return {
            localStream,
            clientList,
            streamClient,
            connect
        }
    },
    methods: {
        callAll() {
            this.streamClient.callAll();
        },
        hangUpAll() {
            this.streamClient.hangUpAll();
        }
    }
}
</script>

<style>

</style>