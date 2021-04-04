<template>
  <div class="col-lg-6 col-md-6 col-sm-8">
    <div class="border shadow bg-white mb-5 py-5">
      <h1>
        <img
          class="success-image"
          src="@/assets/scooter.png"
          alt="Image not found"
        />
      </h1>
      <h3 class="text-success mt-4 text-bold">
        {{ $t("success.message") }}
      </h3>

      <Alert
        v-if="message"
        class="alert-danger success-alert w-75 mt-4"
        :dimissable="false"
        :message="message"
      />
      <router-link
        :to="{ name: 'Booking List' }"
        class="btn btn-success btn-lg w-75 mt-2"
      >
        {{ $t("success.button") }}
      </router-link>
    </div>
  </div>
</template>

<script>
import Alert from "@/components/global/Alert";

export default {
  name: "Success",
  props: ["message"],
  components: { Alert },
  mounted() {
    Alert.methods.show("success-alert");
  }
};
</script>
