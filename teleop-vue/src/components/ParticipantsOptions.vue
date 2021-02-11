<template>
  <div class="client-container">
        <span>{{ participant.name }}</span>
        <button type="button" class="icon-button right-side" v-on:click="micEvent">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16" v-if="!isMuted">
                <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
                <path fill-rule="evenodd" d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic-mute-fill" viewBox="0 0 16 16" v-if="isMuted">
                <path fill-rule="evenodd" d="M12.734 9.613A4.995 4.995 0 0 0 13 8V7a.5.5 0 0 0-1 0v1c0 .274-.027.54-.08.799l.814.814zm-2.522 1.72A4 4 0 0 1 4 8V7a.5.5 0 0 0-1 0v1a5 5 0 0 0 4.5 4.975V15h-3a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-3v-2.025a4.973 4.973 0 0 0 2.43-.923l-.718-.719zM11 7.88V3a3 3 0 0 0-5.842-.963L11 7.879zM5 6.12l4.486 4.486A3 3 0 0 1 5 8V6.121zm8.646 7.234l-12-12 .708-.708 12 12-.708.707z"/>
            </svg>
            <!-- <img src="../assets/mic-fill.svg" class="icon" alt="Mic"> -->
        </button>
        <button type="button" class="icon-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
            
            <!-- <img src="../assets/three-dots.svg" class="icon" alt="Options"> -->
        </button>
    </div>
</template>

<script>
import useButtons from "../composables/ParticipantsOptions/useButtons";

export default {
    name: "participants-options",
    props: {
        participant: Object
    },
    setup() {
        const { micEvent, isMuted } = useButtons();

        return {
            micEvent,
            isMuted
        }
    }
}
</script>

<style scoped>
.client-container {
    position: relative;
    display: inline-flex;
    justify-content: start;
    align-content: center;
    padding: 0 1rem;
    width: 100%;
    background-color: inherit;
    transition: filter 150ms ease-in-out, -webkit-filter 150ms ease-in-out;
}
.client-container:hover {
    -webkit-filter: brightness(160%);
    filter: brightness(160%);
}
.right-side {
    position: absolute;
    right: 1rem;
}
.icon-button {
    display: inline-block;
    color: inherit;
    border: 1px solid transparent !important;
    background-color: transparent;
}
.icon-button:focus {
    outline: none;
}
.icon-button > svg {
    transition: filter 150ms ease-in-out, -webkit-filter 150ms ease-in-out;
}
.icon-button:hover > svg {
    -webkit-filter: drop-shadow(0.125rem 0.25rem 0.1rem rgba(0, 0, 0, 1));
    filter: drop-shadow(0.125rem 0.25rem 0.1rem rgba(0, 0, 0, 1));
}
</style>