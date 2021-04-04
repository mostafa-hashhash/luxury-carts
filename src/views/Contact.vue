<template>
  <div id="contactUs">
    <Overlay />
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-md-8">
          <div class="text-center" id="contactContent">
            <PageTitle :title="$t('nav.contact')" classList="text-light" />

            <form id="contactForm" @submit.prevent="contact($event.submitter)">
              <Alert
                :message="alert.message"
                :dismissable="alert.dismissable"
                class="contact-alert"
                :class="alert.classList"
              />
              <div class="row">
                <div class="col-12 my-2">
                  <!-- email -->
                  <input
                    v-model="$v.email.$model"
                    type="email"
                    class="form-control"
                    :placeholder="$t('contact.email')"
                    :class="{ 'border-danger': $v.email.$error }"
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
                  <FieldError
                    v-if="$v.email.$error && !$v.email.email"
                    :errorList="[
                      {
                        msg: $t('validation.errors.invalidEmail'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                </div>

                <div class="col-sm-8 col-12 my-2">
                  <input
                    v-model="$v.title.$model"
                    type="text"
                    class="form-control"
                    :placeholder="$t('contact.ftitle')"
                    :class="{ 'border-danger': $v.title.$error }"
                  />
                  <FieldError
                    v-if="$v.title.$error && !$v.title.required"
                    :errorList="[
                      {
                        msg: $t('validation.errors.required'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                  <FieldError
                    v-if="$v.title.$error && !$v.title.minLength"
                    :errorList="[
                      {
                        msg: $t('validation.errors.minLength'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                  <FieldError
                    v-if="$v.title.$error && !$v.title.maxLength"
                    :errorList="[
                      {
                        msg: $t('validation.errors.maxLength'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                </div>

                <div class="col-12 col-sm-4 my-2">
                  <select
                    class="form-control"
                    v-model="$v.type.$model"
                    :class="{ 'border-danger': $v.type.$error }"
                  >
                    <option value="" disabled hidden selected>{{
                      $t("contact.reason")
                    }}</option>
                    <option value="Complaint">{{
                      $t("contact.complaint")
                    }}</option>
                    <option value="Inquiry">{{ $t("contact.inquiry") }}</option>
                    <option value="Suggestion">{{
                      $t("contact.suggestion")
                    }}</option>
                  </select>
                  <FieldError
                    v-if="$v.type.$error && !$v.type.required"
                    :errorList="[
                      {
                        msg: $t('validation.errors.required'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                </div>

                <div class="col-12 my-2">
                  <textarea
                    :placeholder="$t('contact.notes')"
                    v-model="$v.details.$model"
                    name="notes"
                    id="contactNotes"
                    cols="30"
                    rows="10"
                    class="form-control textArea"
                    :class="{ 'border-danger': $v.details.$error }"
                  ></textarea>
                  <FieldError
                    v-if="$v.details.$error && !$v.details.required"
                    :errorList="[
                      {
                        msg: $t('validation.errors.required'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                  <FieldError
                    v-if="$v.details.$error && !$v.details.maxLength"
                    :errorList="[
                      {
                        msg: $t('validation.errors.maxLength'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                </div>
                <div class="col-8 col-lg-6 col-md-8 col-sm-7 mx-auto my-3">
                  <p>{{ $t("foo.label") }}</p>
                  <button type="submit" class="w-100 btn btn-primary btn-lg">
                    {{ $t("contact.button") }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="col"></div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import PageTitle from "@/components/global/PageTitle.vue";
import Footer from "@/components/global/Footer.vue";
import Overlay from "@/components/global/Overlay.vue";
import Alert from "@/components/global/Alert";
import API from "@/apis.js";
import utils from "@/utils";
import FieldError from "@/components/error/FieldError";
import $ from "jquery";

import {
  required,
  email,
  maxLength,
  minLength
} from "vuelidate/lib/validators";

API.defAxios();

export default {
  name: "Contact",
  data() {
    return {
      title: "",
      details: "",
      type: "",
      email: "",
      alert: {
        dismissable: true,
        classList: "",
        message: ""
      }
    };
  },
  validations: {
    title: {
      required,
      maxLength: maxLength(50),
      minLength: minLength(1)
    },
    details: { required, maxLength: maxLength(300) },
    type: { required },
    email: { required, email }
  },

  components: { PageTitle, Footer, Overlay, Alert, FieldError },

  methods: {
    showAlert(msg, classList) {
      this.alert.message = msg;
      this.alert.classList = classList;
      Alert.methods.show("contact-alert");
      return false;
    },

    contact(btn) {
      utils.toggleButtonLoading(btn);

      this.$v.$touch();
      if (this.$v.$error) {
        this.showAlert(this.$t("errors.requiredFieldsMissing"), "alert-danger");
        utils.toggleButtonLoading(btn);
        return;
      }

      API.ContactUs(
        {
          title: this.title,
          details: this.details,
          type: this.type,
          email: this.email
        },
        () => {
          utils.toggleButtonLoading(btn);
          this.showAlert(this.$t("contact.success"), "alert-success");
          document.getElementById("contactForm").reset();
        },
        () => {
          utils.toggleButtonLoading(btn);
          this.showAlert(this.$t("errors.genericError"), "alert-danger");
        }
      );
    },

    reCalculateHeight() {
      $("#contactContent").css(
        "min-height",
        window.innerHeight - ($("nav").height() + $("footer").height())
      );
    }
  },

  beforeUpdate: function() {
    document.title = this.$t("nav.contact");
  },

  mounted: function() {
    this.reCalculateHeight();
    window.addEventListener("resize", this.reCalculateHeight);

    document.title = this.$t("nav.contact");
  }
};
</script>

<style lang="scss">
#contactUs {
  position: relative;
  background-image: url("~@/assets/home.png");
  background-attachment: fixed;
  background-size: cover;
  z-index: 0;
}

.textArea {
  resize: none;
}
</style>
