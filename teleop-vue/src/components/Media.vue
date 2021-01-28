<template>
  <div>
      <slot v-if="matches"/>
  </div>
</template>

<script>
export default {
    name: 'media',
    props: {
        query: {
            type: String,
            required: true
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            matches: this.visible,
            mediaQueryList: null
        };
    },
    methods: {
        updateMatches() {
            this.matches = this.mediaQueryList.matches;
        }
    },
    mounted() {
        this.mediaQueryList = window.matchMedia(this.query)
        this.updateMatches();
        this.mediaQueryList.addListener(this.updateMatches);

    },
    beforeUnmount() { 
        if (this.mediaQueryList)
            this.mediaQueryList.removeListener(this.updateMatches);
    }
}
</script>

<style>

</style>