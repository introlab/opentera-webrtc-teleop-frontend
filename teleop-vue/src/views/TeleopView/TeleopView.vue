<template>
  <div class="container-fluid bg-primary-dark" v-on:mousemove="showToolbar">
    <div class="fluid pad">
        <div v-if="videoConfClientStream !== null || cameraXClientStream !== null" class="fluid col-flexbox">
            <div class="row50 gutter">
                <!-- <div style="background: red;">1</div> -->
                <video-participant
                    id="videoconf"
                    name="VideoConf"
                    v-bind:stream="videoConfClientStream"
                    v-bind:show-name="true">
                </video-participant> 
            </div>
            <div class="row50 gutter">
                <!-- <div style="background: red;">2</div> -->
                <video-participant
                    id="camerax"
                    name="CameraX"
                    v-bind:stream="cameraXClientStream"
                    v-bind:show-name="true">
                </video-participant> 
            </div>
            <div class="row50 gutter center-left">
                <joystick width="150" height="150" class="telepresence-joystick"
                    v-bind:absolute-max-x="1" v-bind:absolute-max-y="1"
                    v-on:joystickPositionChange="onJoystickPositionChange"/>
            </div>
        </div>
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

import useToolbar from "@/views/ConferenceView/useToolbar";
import useVideoLayout from "@/views/ConferenceView/useVideoOverlay";

import { VideoParticipant } from "@/components/VideoParticipant";
import { ButtonConference } from '@/components/ButtonConference';
import { ParticipantsList } from "@/components/ParticipantsList";
import Joystick from '../../components/Joystick/Joystick.vue';

export default {
    name: "teleop-view",
    data() {
      return {
        chatTextArea: null,
      }
    },
    components: {
        VideoParticipant,
        ButtonConference,
        ParticipantsList,
        Joystick
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
        videoConfClientStream() {
            if (this.$store.state.localClient.openteraVideoConf.clientsInCall.length > 0) {
                return this.$store.state.localClient.openteraVideoConf.clientsInCall[0].stream;
            }
            else {
                return null;
            }
        },
        cameraXClientStream() {
            if (this.$store.state.localClient.openteraCameraX.clientsInCall.length > 0) {
                return this.$store.state.localClient.openteraCameraX.clientsInCall[0].stream;
            }
            else {
                return null;
            }
        },
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
    activated() {
        // Reactivate the local video when it's render from cache
        const overlayVideo = this.$refs.overlayVideoRef;
        overlayVideo.muted = true;
        overlayVideo.srcObject = this.$store.state.localClient.openteraVideoConf.localStream;
        overlayVideo.autoplay = true;
    },
    methods: {
      onJoystickPositionChange(event) {
          if (this.$store.state.localClient.openteraTeleop.client)
            this.$store.state.localClient.openteraTeleop.client.sendToAll(JSON.stringify(event));
      }
    },
    beforeMount() {
        this.$store.commit("localClient/openteraTeleop/setMessageEventHandler", (id, name, clientData, message) => {
            // TODO
        })
    }
}
</script>

<style scoped>
    @import "./TeleopView.scss";
</style>