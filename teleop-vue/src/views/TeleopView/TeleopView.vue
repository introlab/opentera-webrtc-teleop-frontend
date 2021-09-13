<template>
  <div class="container-fluid bg-primary-dark" v-on:mousemove="showToolbar">
    <div class="fluid pad">
        <div v-if="videoConfClientStream !== null || cameraXClientStream !== null" class="fluid col-flexbox">
            <div class="row50 gutter">
                <video-participant
                    id="videoconf"
                    name="Front Camera"
                    v-bind:stream="videoConfClientStream"
                    v-bind:show-name="true">
                </video-participant> 
            </div>
            <div class="row50 gutter">
                <video-participant
                    id="camerax"
                    name="Bottom camera"
                    v-bind:stream="cameraXClientStream"
                    v-bind:show-name="true">
                </video-participant> 
            </div>
            <div class="row50 gutter center-left">
                <joystick width="150" height="150" class="telepresence-joystick"
                    v-bind:absolute-max-x="maxCmdValue" v-bind:absolute-max-y="maxCmdValue"
                    v-on:joystickPositionChange="updateCmdVel"/>
            </div>
            <keyboard-teleop 
                v-bind:absolute-max-x="maxCmdValue" 
                v-bind:absolute-max-y="maxCmdValue"
                v-on:keyboadCmdEvent="updateCmdVel"/>
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
import { Joystick } from '@/components/Joystick';
import KeyboardTeleop from "../../components/KeyboardTeleop/KeyboardTeleop.vue"

export default {
    name: "teleop-view",
    data() {
      return {
        chatTextArea: null,
        cmd: {x: 0, y: 0},  // Global velocity command to be sent to the robot
        maxCmdValue: 1,
      }
    },
    components: {
        VideoParticipant,
        ButtonConference,
        ParticipantsList,
        Joystick,
        KeyboardTeleop
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
    created() {
        this.init();
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
        init: function() {
            setInterval(function() {
                this.sendCmdVel({x: this.x, y: this.y});
            }.bind(this), 100) // 100 ms
        },
        updateCmdVel (newCmd) {
            // Update the global velocity command with the command from the keyboard or joystick
            // TODO: prioritize one of the two sources over the other.
            this.cmd = newCmd;
        },
        sendCmdVel() {
            // Send the global velocity command at a constant rate
            if (this.$store.state.localClient.openteraTeleop.client){
                this.$store.state.localClient.openteraTeleop.client.sendToAll(JSON.stringify(this.cmd));
            }
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