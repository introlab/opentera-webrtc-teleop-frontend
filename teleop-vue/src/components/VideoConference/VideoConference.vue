<template>
    <div>
        <media-query query="(min-width: 992px), (min-aspect-ratio: 1/1)">
            <div class="container-fluid">
                <div class="row" v-bind:class="'rows-' + nRows + ' cols-' + nColumns">
                    <div
                        class="col"
                        v-for="client in clientsList"
                        v-bind:key="client.id">
                        <video-participant
                            v-bind:id="client.id"
                            v-bind:name="client.name"
                            v-bind:stream="client.stream"
                            v-bind:show-name="true">
                        </video-participant>
                    </div>
                </div>
            </div>
        </media-query>
        <media-query query="(min-width: 600px) and (max-width: 991.98px) and (max-aspect-ratio: 1/1)">
            <div class="container-fluid">
                <div class="row" v-bind:class="'rows-' + nColumns + ' cols-' + nRows">
                    <div
                        class="col"
                        v-for="client in clientsList"
                        v-bind:key="client.id">
                        <video-participant
                            v-bind:id="client.id"
                            v-bind:name="client.name"
                            v-bind:stream="client.stream"
                            v-bind:show-name="true">
                        </video-participant>
                    </div>
                </div>
            </div>
        </media-query>
        <media-query query="(max-width: 599.98px)">
            <div class="container-fluid">
                <video-participant
                    v-bind:id="getPriorisedClient.id"
                    v-bind:name="getPriorisedClient.name"
                    v-bind:stream="getPriorisedClient.stream"
                    v-bind:show-name="true">
                </video-participant>
            </div>
        </media-query>
    </div>
</template>

<script>
import { toRefs } from 'vue';

import useVideoLayout from "./useVideosLayout";
import { VideoParticipant } from "@/components/VideoParticipant";
import { MediaQuery } from "@/components/MediaQuery";

export default {
    name: "video-conference",
    components: {
        MediaQuery,
        VideoParticipant
    },
    props: {
        clientsList: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const { clientsList } = toRefs(props);

        const { nColumns, nRows} = useVideoLayout(clientsList);

        return {
            nColumns,
            nRows
        }
    },
    computed: {
        getPriorisedClient() {
            // TODO: make an algorythm that priorise a client to be shown
            if (this.clientsList > 0) {
                return this.clientsList[0];
            } else {
                return {
                    id: "null",
                    name: "null",
                    stream: null
                };
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "./VideoConference.scss";
</style>