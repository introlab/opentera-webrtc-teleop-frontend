<template>
  <div class="client-container">
        <span>{{ participant.name }}</span>
        <button type="button" class="icon-button right-side">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16">
                <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
                <path fill-rule="evenodd" d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
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
export default {
    name: "participants-options",
    props: {
        participant: Object
    }
}
</script>

<style>
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
    border: 1px solid transparent;
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