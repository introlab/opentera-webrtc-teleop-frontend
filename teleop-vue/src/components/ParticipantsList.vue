<template>
    <div>
        <h5 v-if="isInCall">Currently in this call</h5>
        <participants-options v-if="isInCall" v-bind:participant="thisClient"/> 
        <participants-options v-for="client in clientsInCall" v-bind:key="client.id" v-bind:participant="client"/>
        <h5 v-if="clientsNotInCall.length > 0 || !isInCall">Currently in the room</h5>
        <participants-options v-if="!isInCall" v-bind:participant="thisClient"/>
        <participants-options v-for="client in clientsNotInCall" v-bind:key="client.id" v-bind:participant="client"/>        
    </div>
</template>

<script>
import ParticipantsOptions from './ParticipantsOptions.vue';
export default {
  components: { ParticipantsOptions },
    name: "participants-list",
    props: {
        clientsInCall: Array,
        clientsInRoom: Array
    },
    computed: {
        clientsNotInCall() {
            return this.clientsInRoom.filter(client => !this.clientsInCall.some(i => i.id === client.id) && client.id !== this.thisClient.id);
        },
        isInCall() {
            return this.$store.state.opentera.isInCall;
        },
        thisClient() {
            return this.$store.state.opentera.thisClient;
        }
    }
}
</script>

<style scoped>
h5 {
    padding: 0 0.5rem;
    text-align: start;
}
</style>