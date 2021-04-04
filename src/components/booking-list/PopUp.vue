<template>
  <div class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content text-center">
        <div class="modal-header">
          <h5 class="modal-title mx-auto">{{ title }}</h5>
        </div>

        <div class="modal-body">
          <p>{{ body }}</p>
        </div>

        <div
          v-if="popupType == 'confirm'"
          class="modal-footer mx-auto border-0 p-0 w-100"
        >
          <button
            type="button"
            class="btn btn-success w-50 m-0 rounded-0"
            @click="$emit('reject')"
          >
            {{ noButton }}
          </button>
          <button
            type="button"
            class="btn btn-danger w-50 m-0 rounded-0"
            @click="$emit('accept')"
          >
            {{ yesButton }}
          </button>
        </div>
        <div
          v-else-if="popupType == 'message'"
          class="modal-footer mx-auto border-0 p-0 w-100"
        >
          <button
            type="button"
            class="btn btn-success w-100 m-0 rounded-0"
            @click="$emit('ok')"
          >
            {{ $t("globals.ok") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopUP",
  props: ["body", "title", "yesButton", "noButton", "popupType"]
};
</script>
