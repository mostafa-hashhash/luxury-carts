<template>
  <div class="container pb-5" id="failure">
    <div class="row">
      <div class="col"></div>
      <div class="col-md-5">
        <div class="border bg-white mx-auto p-4">
          <h1>
            <i class="fas fa-exclamation-triangle text-primary"></i>
          </h1>
          <h2>Booking Error</h2>
          <p class="text-muted mt-4">
            Something went wrong while booking, please try again.
          </p>
        </div>
        <button
          @click.passive="tryAgain"
          class="btn btn-lg btn-outline-primary my-3 w-100"
          :to="{ name: 'Home' }"
        >
          Try Again
        </button>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "TryAgain",
  methods: {
    tryAgain(e) {
      $("button, a, router-link").prop("disabled", true);
      $(e.target).blur();
      alert("We should try again now.");
    }
  }
};
</script>
