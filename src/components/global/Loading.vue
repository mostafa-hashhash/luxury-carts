<template>
  <div
    id="loadingIndicator"
    class="d-flex justify-content-center align-items-center bg-dark"
    :class="{ hidden: hidden }"
  >
    <div
      class="card border-0 bg-dark w-25 d-flex justify-content-center align-items-center p-5"
    >
      <Loader />
      <p
        class="text-center mt-5"
        v-if="message != undefined"
        v-html="message"
      ></p>
    </div>
  </div>
</template>

<script>
import Loader from "vue-loading-spinner/src/components/Gauge";

export default {
  name: "Loading",
  components: { Loader },
  props: ["message", "hidden"]
};
</script>

<style lang="scss" scoped>
#loadingIndicator {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  z-index: 99;
  &.hidden {
    display: none !important;
  }
}
</style>
