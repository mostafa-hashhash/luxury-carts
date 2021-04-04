<template>
  <div class="reset">
    <div
      id="sectionPasswordReset"
      class="container"
      :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
    >
      <PageTitle
        :title="$t('reset.title')"
        :describtion="$t('reset.desc')"
        classList="text-center"
      />
      <div>
        <div class="row">
          <div class="col"></div>
          <div class="col-md-6 col-sm-12">
            <Alert
              :message="alert.message"
              :dismissable="alert.dismissable"
              :class="alert.className"
              class="password-reset-alert"
            />

            <form
              class="my-3 pb-5 mb-5"
              @submit.prevent="frmSubmit($event.submitter)"
            >
              <input
                v-model="$v.email.$model"
                type="text"
                class="form-control"
                :placeholder="$t('login.email')"
                :class="{ 'border-danger': $v.email.$error }"
              />
              <FieldError
                v-if="$v.email.$error && !$v.email.email"
                :errorList="[
                  {
                    msg: $t('validation.errors.invalidEmail'),
                    className: 'text-danger'
                  }
                ]"
              />
              <FieldError
                v-if="$v.email.$error && !$v.email.required"
                :errorList="[
                  {
                    msg: $t('validation.errors.required'),
                    className: 'text-danger'
                  }
                ]"
              />
              <button class="btn btn-primary btn-lg w-100 my-4" type="submit">
                {{ $t("reset.button") }}
              </button>
            </form>
          </div>
          <div class="col "></div>
        </div>
      </div>
    </div>
    <Footer classList="bg-dark" />
  </div>
</template>

<script>
import PageTitle from "@/components/global/PageTitle.vue";
import Footer from "@/components/global/Footer.vue";
import Alert from "@/components/global/Alert";
import API from "@/apis.js";
import NProgress from "nprogress";
import { required, email } from "vuelidate/lib/validators";
import utils from "@/utils";
import FieldError from "@/components/error/FieldError";
import $ from "jquery";

export default {
  name: "PasswordReset",
  data() {
    return {
      email: "",
      alert: {
        message: "",
        dismissable: true,
        className: ""
      }
    };
  },
  validations: {
    email: {
      required,
      email
    }
  },
  methods: {
    showAlert(msg, className) {
      this.alert.message = msg;
      this.alert.className = className;
      Alert.methods.show("password-reset-alert");
      return false;
    },
    frmSubmit(btn) {
      utils.toggleButtonLoading(btn);
      this.$v.$touch();
      if (this.$v.$invalid) {
        utils.toggleButtonLoading(btn);
        return;
      }
      this.reset(btn);
    },
    reset(btn) {
      API.ResetPassword(
        {
          userId: this.email,
          Mode: "Email"
        },
        () => {
          utils.toggleButtonLoading(btn);
          this.showAlert(
            this.$t("passwordReset.successMessage"),
            "alert-success"
          );
        },
        () => {
          utils.toggleButtonLoading(btn);
          this.showAlert(this.$t("errors.genericError"), "alert-danger");
          NProgress.done();
        }
      );
    },

    reCalculateHeight() {
      $("#sectionPasswordReset").css(
        "min-height",
        window.innerHeight - ($("nav").height() + $("footer").height())
      );
    }
  },

  beforeUpdate: function() {
    document.title = this.$t("reset.title");
  },

  mounted: function() {
    this.reCalculateHeight();
    window.addEventListener("resize", this.reCalculateHeight);

    document.title = this.$t("reset.title");
  },

  components: { PageTitle, Footer, Alert, FieldError }
};
</script>

<style lang="scss">
#sectionPasswordReset {
  min-height: 71.5vh;
  position: relative;
}

.reset {
  background-color: #f2f2f2 !important;
}
</style>
