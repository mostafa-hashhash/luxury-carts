<template>
  <div
    class="modal fade"
    id="errorModal"
    tabindex="-1"
    aria-labelledby="errorModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header p-2 bg-danger text-white">
          <p class="modal-title" id="errorModalLabel">{{ title }}</p>
          <button
            type="button"
            class="close m-0 p-0"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true" class="text-white">&times;</span>
          </button>
        </div>
        <div
          class="modal-body py-4 text-dark"
          :class="{
            'text-left': $i18n.locale == 'en',
            'text-right': $i18n.locale == 'ar'
          }"
        >
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "Modal",
  props: ["title", "message"],
  methods: {
    toggle() {
      $("#errorModal").modal("toggle");
    }
  }
};
</script>
