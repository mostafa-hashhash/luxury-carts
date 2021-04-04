<template>
  <div
    class="alert mx-auto my-3 fade show"
    role="alert"
    :class="{
      'text-right': $i18n.locale == 'ar',
      'text-left': $i18n.locale == 'en',
      'alert-dismissible': dismissable
    }"
  >
    {{ message }}
    <button
      v-if="dismissable"
      type="button"
      class="close"
      data-dismiss="alert"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "Alert",
  props: ["message", "dismissable"],
  methods: {
    show(className) {
      $(`.alert`).hide();
      $(`.${className}`).show();
    },
    hide(className) {
      $(`.${className}`).hide();
    }
  },
  mounted() {
    this.hide("alert");
  }
};
</script>
