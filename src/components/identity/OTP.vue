<template>
  <div class="mt-5">
    <Alert
      :message="alert.message"
      :dismissable="alert.dismissable"
      class="otp-alert col-lg-6 col-md-6 col-sm-7"
      :class="alert.classList"
    />

    <div class="px-5 py-5 mx-auto col-lg-6 col-md-6 col-sm-7 bg-white border">
      <h5 class="m-2 mb-2">
        {{ $t("otp.title") }}
      </h5>

      <p class="mb-4">{{ $t("otp.paragraph") }}</p>

      <OtpInput
        ref="otpInput"
        input-classes="otp-input"
        class="ltr d-flex justify-content-center"
        separator="-"
        :num-inputs="4"
        :should-auto-focus="true"
        :is-input-num="true"
        @on-complete="verifyOTP"
      />

      <div class="mt-3">
        <div v-if="canCount && resendCounter > 0">
          {{ count() }} {{ $t("otp.wait") }} {{ resendCounter }}
        </div>
        <div v-if="canCount && resendCounter <= 0">
          <button @click="resendCode" class="p-0 border-0" id="resendButton">
            {{ $t("otp.resend") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Alert from "@/components/global/Alert";
import OtpInput from "@bachdgvn/vue-otp-input";
import API from "@/apis.js";

export default {
  name: "OTP",

  data() {
    return {
      otp: "",
      resendCounter: 60,
      counterInterval: "",
      canCount: true,
      alert: {
        message: "",
        dismissable: true,
        classList: ""
      }
    };
  },

  props: ["email", "password", "id"],

  components: { OtpInput, Alert },

  methods: {
    showMessage(msg, classList) {
      this.alert.message = msg;
      this.alert.classList = classList;
      Alert.methods.show("otp-alert");
    },

    clearOTP() {
      this.$refs.otpInput.clearInput();
    },

    verifyOTP(otp) {
      API.Login(
        {
          userTempId: this.id,
          pinCode: otp,
          mode: "Otp",
          apiVersion: 2
        },
        r => {
          this.$emit("auth", r);
        },
        () => {
          this.showMessage(this.$t("otp.error"), "alert-danger");
          this.clearOTP();
        }
      );
    },

    resendCode() {
      if (this.resendCounter < 1) {
        this.resendCounter = 60;
        API.Login(
          {
            userId: this.email,
            password: this.password,
            apiVersion: 2
          },
          () => {
            //
          },
          e => {
            if (e.response.data.data) {
              this.showMessage(this.$t("otp.resendSuccess"), "alert-secondary");
              this.id = e.response.data.data.otp.tempUserId;
              this.canCount = true;
            } else {
              this.showMessage(e.response.data.errorMessage, "alert-danger");
              this.canCount = false;
            }
          }
        );
      }
    },

    count() {
      if (this.resendCounter >= 1) this.decreaseResendCounter();
    },

    decreaseResendCounter() {
      this.startInterval();
    },

    startInterval() {
      this.counterInterval = setInterval(() => {
        this.resendCounter--;
      }, 1000);
    },

    stopInterval() {
      clearInterval(this.counterInterval);
    }
  },

  beforeUpdate: function() {
    this.stopInterval();
  }
};
</script>

<style lang="scss">
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 1px;
  border: 1px solid rgba(0, 0, 0, 0.09);
  text-align: center;
  &.error {
    border: 1px solid red !important;
  }
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

#resendButton {
  text-decoration: underline;
  background: transparent;
  color: #ec4315;
}
</style>
