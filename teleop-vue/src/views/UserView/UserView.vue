<template>
  <default-template
    brand="Opentera User Interface"
    route="user"
    v-bind:client="{ name: name, data: data, room: room, password: password }"
  />
</template>

<script>
import { DefaultTemplate } from "@/components/DefaultTemplate";

export default {
  name: "user-view",
  components: {
    DefaultTemplate,
  },
  props: {
    name: String,
    data: Object,
    room: String,
    password: String,
  },
};
</script>

<style>
@import "./UserView.scss";
</style>
