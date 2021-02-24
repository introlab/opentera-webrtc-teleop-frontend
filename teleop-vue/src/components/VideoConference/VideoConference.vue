<template>
    <div>
        <media-query query="(min-width: 992px) or ((min-width: 600px) and (max-width: 991.98px) and (orientation: landscape))">
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
        <media-query query="(min-width: 600px) and (max-width: 991.98px) and (orientation: portrait)">
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
                    v-bind:id="clientsList[0].id"
                    v-bind:name="clientsList[0].name"
                    v-bind:stream="clientsList[0].stream"
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
    }
}
</script>

<style lang="scss" scoped>
    @import "./VideoConference.scss";
</style>