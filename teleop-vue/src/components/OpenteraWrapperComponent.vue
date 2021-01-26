<template>
    <div>
        <div class="card">
            <div class="card-body">
                <video-conference-component
                    overlay-video-id="overlayVideo"
                    v-bind:clients-video="clients"
                    v-bind:show-overlay-video="true">
                </video-conference-component>
            </div>
        </div>
        <button v-on:click="connect">Connect</button>
        <button v-on:click="callAll">Call all</button>
        <button v-on:click="hangUpAll">Hang up</button>
    </div>
</template>

<script>
import VideoConferenceComponent from "./VideoConferenceComponent"

import openteraWebrtcWebClient from "opentera-webrtc-web-client";

export default {
    name: 'opentera-wrapper-component',
    components: {
        VideoConferenceComponent
    },
    data() {
        return {
            clients : [],
            localStream : null,
            streamClient : null
        }
    },
    methods: {
        async connect()  {
            const SignalingServerConfiguration = {
                url: "http://localhost:8080/",
                //url: 'http://localhost/',
                name: "TestClient.vue",
                data: {}, // Client custom data
                room: "chat"
            };
            const StreamConfiguration = {
                localStream: this.localStream,
                isSendOnly: false
            };
            const RtcConfiguration = {
                // See: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCConfiguration_dictionary
                iceServers: [
                    {
                        urls: "stun:stun.l.google.com:19302"
                    }
                ]
            };
            let logger = (...args) => console.log(...args);

            this.streamClient = new openteraWebrtcWebClient.StreamClient(
                SignalingServerConfiguration,
                StreamConfiguration,
                RtcConfiguration,
                logger
            );
            this.connectStreamClientEvents();

            await this.streamClient.connect();
        },
        connectStreamClientEvents() {
            this.streamClient.onSignalingConnectionOpen = () => {
                // TODO
            };
            this.streamClient.onSignalingConnectionClose = async () => {
                // TODO
            };
            this.streamClient.onSignalingConnectionError = message => {
                alert(message);
            };
            // eslint-disable-next-line
            this.streamClient.onRoomClientsChange = client => {
                // TODO
            };
            this.streamClient.onAddRemoteStream = (id, name, clientData, stream) => {
                this.clients.push({id, name, stream});
            };
            // eslint-disable-next-line
            this.streamClient.onClientDisconnect = (id, name, clientData) => {
                this.clients = this.clients.filter(item => item.id !== id);
            };
        },
        callAll() {
            this.streamClient.callAll();
        },
        hangUpAll() {
            this.streamClient.hangUpAll();
        }
    },
    mounted() {
        // Setup local stream 
        openteraWebrtcWebClient.devices.getDefaultStream().then(stream => {
            this.localStream = stream;
        });
    }
}
</script>

<style>

</style>