<template>
  <div class="container">
    <div class="row">
      <div class="col"></div>
      <div class="col-md-5">
        <div class="border bg-white pt-5 pb-2">
          <h1 class="d-flex justify-content-center align-items-center">
            <Loader />
          </h1>
          <p class="text-dark mt-5">{{ statusMessage }}</p>
        </div>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
import Loader from "vue-loading-spinner/src/components/Gauge";

export default {
  name: "Loading",
  components: { Loader },
  props: ["statusMessage"]
};
</script>
