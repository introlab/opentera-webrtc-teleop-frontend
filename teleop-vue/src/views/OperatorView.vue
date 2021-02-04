<template>
  <opentera-wrapper v-bind="{ name: 'Client Name', data: {}, room: 'chat' }">
    <template v-slot:header>
      <navigation-bar
        name="Opentera Operator Interface"
        defaultPath="/operator"
        v-bind:links="[]">
      </navigation-bar>
    </template>
  </opentera-wrapper>
</template>

<script>
import NavigationBar from "../components/NavigationBar";
import OpenteraWrapper from "../components/OpenteraWrapper";

export default {
    name: "operator-view",
    components: {
        NavigationBar,
        OpenteraWrapper
    }
};
</script>

<style></style>