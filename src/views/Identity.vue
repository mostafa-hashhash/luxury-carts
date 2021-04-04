<template>
  <div class="text-center pt-3 bg-light">
    <Modal :message="error.message" :title="error.title" />
    <Loading :message="loader.message" :hidden="loader.hide" />

    <div class="modal-view">
      <OTP
        v-if="otp.show"
        :email="otp.email"
        :password="otp.password"
        :id="otp.tempId"
        @auth="saveAuthResponse"
      />

      <div v-else class="container" :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'">
        <div class="row">
          <div
            class="col-md-6 col-sm-12"
            :class="{
              'border-right': $i18n.locale == 'en',
              'border-left': $i18n.locale == 'ar'
            }"
          >
            <h3 class="pb-3">{{ $t("login.button") }}</h3>

            <form
              @submit.prevent="login($event.submitter)"
              id="loginForm"
              class="m-auto w-75"
            >
              <Alert
                :message="alert.message"
                :dismissable="alert.dismissable"
                class="alert-danger login-alert"
              />
              <div class="form-group">
                <input
                  v-model.trim="$v.loginData.email.$model"
                  type="text"
                  class="form-control"
                  title="Invalid email address"
                  :placeholder="$t('login.email')"
                  :class="{ 'border-danger': $v.loginData.email.$error }"
                />
                <FieldError
                  v-if="
                    $v.loginData.email.$error && !$v.loginData.email.required
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.required'),
                      className: 'text-danger'
                    }
                  ]"
                />
                <FieldError
                  v-if="$v.loginData.email.$error && !$v.loginData.email.email"
                  :errorList="[
                    {
                      msg: $t('validation.errors.invalidEmail'),
                      className: 'text-primary'
                    }
                  ]"
                />
              </div>

              <div class="form-group">
                <input
                  v-model="$v.loginData.password.$model"
                  type="password"
                  class="form-control"
                  :placeholder="$t('login.password')"
                  :class="{ 'border-danger': $v.loginData.password.$error }"
                />
                <FieldError
                  v-if="
                    $v.loginData.password.$error &&
                      !$v.loginData.password.required
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.required'),
                      className: 'text-primary'
                    }
                  ]"
                />
              </div>

              <div class="my-4">
                <button type="submit" class="btn btn-primary w-100">
                  {{ $t("login.button") }}
                </button>

                <router-link
                  class="d-block text-center text-dark my-3"
                  :to="`/${$i18n.locale}/identity/reset-password`"
                >
                  {{ $t("login.forget") }}
                </router-link>
              </div>
            </form>
          </div>

          <div
            class="col-md-6 col-sm-12"
            :class="{
              'border-left': $i18n.locale == 'en',
              'border-right': $i18n.locale == 'ar'
            }"
          >
            <h3 class="pb-3">{{ $t("register.button") }}</h3>
            <form
              @submit.prevent="register($event.submitter)"
              class="w-75 m-auto"
            >
              <Alert
                :message="alert.message"
                :dismissable="alert.dismissable"
                class="alert-danger register-alert"
              />
              <div class="form-row form-group">
                <div class="col">
                  <input
                    class="form-control"
                    v-model="$v.registerData.firstName.$model"
                    :placeholder="$t('register.firstName')"
                    :class="{
                      'border-danger': $v.registerData.firstName.$error
                    }"
                  />
                  <FieldError
                    v-if="
                      $v.registerData.firstName.$error &&
                        !$v.registerData.firstName.required
                    "
                    :errorList="[
                      {
                        msg: $t('validation.errors.required'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                  <FieldError
                    v-if="
                      $v.registerData.firstName.$error &&
                        !$v.registerData.firstName.alpha
                    "
                    :errorList="[
                      {
                        msg: $t('validation.errors.usernameAlpha'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                  <FieldError
                    v-if="
                      $v.registerData.firstName.$error &&
                        !$v.registerData.firstName.minLength
                    "
                    :errorList="[
                      {
                        msg: $t('validation.errors.minLength'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                  <FieldError
                    v-if="
                      $v.registerData.firstName.$error &&
                        !$v.registerData.firstName.maxLength
                    "
                    :errorList="[
                      {
                        msg: $t('validation.errors.maxLength'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                </div>
                <div class="col">
                  <input
                    class="form-control"
                    v-model="$v.registerData.lastName.$model"
                    :placeholder="$t('register.lastName')"
                    :class="{
                      'border-danger': $v.registerData.lastName.$error
                    }"
                  />
                  <FieldError
                    v-if="
                      $v.registerData.lastName.$error &&
                        !$v.registerData.lastName.required
                    "
                    :errorList="[
                      {
                        msg: $t('validation.errors.required'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                  <FieldError
                    v-if="
                      $v.registerData.lastName.$error &&
                        !$v.registerData.lastName.alpha
                    "
                    :errorList="[
                      {
                        msg: $t('validation.errors.usernameAlpha'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                  <FieldError
                    v-if="
                      $v.registerData.lastName.$error &&
                        !$v.registerData.lastName.minLength
                    "
                    :errorList="[
                      {
                        msg: $t('validation.errors.minLength'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                  <FieldError
                    v-if="
                      $v.registerData.lastName.$error &&
                        !$v.registerData.lastName.maxLength
                    "
                    :errorList="[
                      {
                        msg: $t('validation.errors.maxLength'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                </div>
              </div>

              <div class="form-group">
                <VSelect
                  :searchable="false"
                  class="bg-white rounded"
                  :placeholder="$t('register.country')"
                  :options="countryList"
                  :label="`${$i18n.locale}`"
                  @input="setCountry"
                  :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
                />
              </div>

              <div class="form-group form-row" dir="ltr">
                <div class="mx-1">
                  <vue-country-code
                    class="bg-white rounded border h-100 d-flex"
                    @onSelect="setCode"
                    :preferredCountries="[
                      'sa',
                      'eg',
                      'ae',
                      'qa',
                      'ye',
                      'sy',
                      'om',
                      'iq',
                      'kw',
                      'bh',
                      'jo',
                      'tr'
                    ]"
                  >
                  </vue-country-code>
                </div>
                <div class="col-2">
                  <div
                    class="bg-white rounded border h-100 d-flex justify-content-center align-items-center"
                  >
                    <span> +{{ registerData.mobileCode }} </span>
                  </div>
                </div>
                <div class="col">
                  <input
                    :class="{
                      'border-danger': $v.registerData.mobileNo.$error,
                      'text-left': $i18n.locale == 'en',
                      'text-right':
                        $i18n.locale == 'ar' && !registerData.mobileNo
                    }"
                    class="form-control rounded"
                    :placeholder="$t('register.mob')"
                    aria-label="Mobile Number"
                    v-model="$v.registerData.mobileNo.$model"
                  />
                </div>
                <div class="col-12">
                  <FieldError
                    v-if="
                      $v.registerData.mobileNo.$error &&
                        !$v.registerData.mobileNo.required
                    "
                    :errorList="[
                      {
                        msg: $t('validation.errors.required'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                  <FieldError
                    v-if="
                      $v.registerData.mobileNo.$error &&
                        !$v.registerData.mobileNo.numeric
                    "
                    :errorList="[
                      {
                        msg: $t('validation.errors.numeric'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                  <FieldError
                    v-if="
                      $v.registerData.mobileNo.$error &&
                        (!$v.registerData.mobileNo.minLength ||
                          !$v.registerData.mobileNo.maxLength ||
                          !$v.registerData.mobileNo.saudi)
                    "
                    :errorList="[
                      {
                        msg: $t('validation.errors.invalidMobile'),
                        className: 'text-danger'
                      }
                    ]"
                  />
                </div>
              </div>

              <div class="form-group">
                <input
                  class="form-control"
                  :class="{ 'border-danger': $v.registerData.nid.$error }"
                  v-model="$v.registerData.nid.$model"
                  :placeholder="$t('register.nid')"
                />
                <FieldError
                  v-if="
                    $v.registerData.nid.$error && !$v.registerData.nid.required
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.required'),
                      className: 'text-danger'
                    }
                  ]"
                />
                <FieldError
                  v-if="
                    $v.registerData.nid.$error &&
                      !$v.registerData.nid.hasSpecials
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.hasSpecials'),
                      className: 'text-danger'
                    }
                  ]"
                />
                <FieldError
                  v-if="
                    $v.registerData.nid.$error &&
                      (!$v.registerData.nid.minLength ||
                        !$v.registerData.nid.maxLength)
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.invalidNID'),
                      className: 'text-danger'
                    }
                  ]"
                />
              </div>

              <div class="form-group">
                <input
                  type="email"
                  class="form-control"
                  v-model="$v.registerData.email.$model"
                  :class="{ 'border-danger': $v.registerData.email.$error }"
                  :placeholder="$t('login.email')"
                />
                <FieldError
                  v-if="
                    $v.registerData.email.$error &&
                      !$v.registerData.email.required
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.required'),
                      className: 'text-danger'
                    }
                  ]"
                />
                <FieldError
                  v-if="
                    $v.registerData.email.$error && !$v.registerData.email.email
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.invalidEmail'),
                      className: 'text-danger'
                    }
                  ]"
                />
              </div>

              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  v-model="$v.registerData.password.$model"
                  :class="{ 'border-danger': $v.registerData.password.$error }"
                  :placeholder="$t('login.password')"
                />
                <FieldError
                  v-if="
                    $v.registerData.password.$error &&
                      !$v.registerData.password.required
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.required'),
                      className: 'text-danger'
                    }
                  ]"
                />
                <FieldError
                  v-if="
                    $v.registerData.password.$error &&
                      !$v.registerData.password.strongPass
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.weakPassword'),
                      className: 'text-danger'
                    }
                  ]"
                />
                <FieldError
                  v-if="
                    $v.registerData.password.$error &&
                      !$v.registerData.password.maxLength
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.maxLength'),
                      className: 'text-danger'
                    }
                  ]"
                />
                <FieldError
                  v-if="
                    $v.registerData.password.$error &&
                      !$v.registerData.password.minLength
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.minLength'),
                      className: 'text-danger'
                    }
                  ]"
                />
              </div>

              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  v-model="$v.registerData.confirmPassword.$model"
                  :class="{
                    'border-danger': $v.registerData.confirmPassword.$error
                  }"
                  :placeholder="$t('register.confirm')"
                />
                <FieldError
                  v-if="
                    $v.registerData.confirmPassword.$error &&
                      !$v.registerData.confirmPassword.required
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.required'),
                      className: 'text-danger'
                    }
                  ]"
                />
                <FieldError
                  v-if="
                    $v.registerData.confirmPassword.$error &&
                      !$v.registerData.confirmPassword.sameAs
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.passwordMatch'),
                      className: 'text-danger'
                    }
                  ]"
                />
              </div>

              <div
                class="main-container__column material-checkbox-group_danger"
              >
                <input
                  type="checkbox"
                  id="userAgreement"
                  v-model="registerData.userAgreement"
                  name="userAgreement"
                  class="material-checkbox"
                />
                <label
                  :class="{ animate: $v.registerData.userAgreement.$error }"
                  class="material-checkbox-group__label"
                  for="userAgreement"
                  id="agreementChackBox"
                >
                  {{ $t("register.label") }}
                  <router-link
                    class="text-primary"
                    :to="`/${$i18n.locale}/privacy-policy`"
                    >{{ $t("foo.policy") }}</router-link
                  >
                  {{ $t("login.and") }}
                  <router-link
                    class="text-primary"
                    :to="`/${$i18n.locale}/terms-and-conditions`"
                    >{{ $t("foo.terms") }}</router-link
                  >
                </label>
              </div>

              <div class="main-container__column">
                <button type="submit" class="btn btn-primary w-100 my-3">
                  {{ $t("register.button") }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer classList="bg-dark" />
  </div>
</template>

<script>
const saudi = function(value) {
  if (this.registerData.mobileCode == 966 && value.length != 10) return false;

  return true;
};

import Footer from "@/components/global/Footer.vue";
import $ from "jquery";
import API from "@/apis.js";
import VSelect from "vue-select";
import Loading from "@/components/global/Loading";
import utils from "@/utils";
import Modal from "@/components/error/Modal";
import Alert from "@/components/global/Alert";
import FieldError from "@/components/error/FieldError";
import OTP from "@/components/identity/OTP";

API.defAxios();

import {
  required,
  email,
  minLength,
  maxLength,
  helpers,
  numeric,
  integer,
  sameAs
} from "vuelidate/lib/validators";
import NProgress from "nprogress";

// eslint-disable-next-line
const alpha = helpers.regex("alpha", /^([^\u0000-\u007F]|[A-Za-z])+$/);

const strongPass = helpers.regex(
  "strongPass",
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*])(?=.{5,})/
);

const hasSpecials = helpers.regex(
  "hasSpecials",
  /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/
);

export default {
  name: "Identity",
  data() {
    return {
      otp: {
        show: false,
        tempId: "",
        email: "",
        password: ""
      },
      error: {
        message: "error message",
        title: "error title"
      },
      alert: {
        message: "",
        dismissable: false
      },
      loader: {
        message: undefined,
        hide: false
      },
      loginData: {
        email: "",
        password: ""
      },
      registerData: {
        firstName: "",
        lastName: "",
        country: "",
        mobileNo: "",
        mobileCode: "",
        nid: "",
        email: "",
        password: "",
        confirmPassword: "",
        userAgreement: false
      },
      countryList: []
    };
  },
  validations: {
    loginData: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    },
    registerData: {
      firstName: {
        required,
        alpha,
        minLength: minLength(2),
        maxLength: maxLength(15)
      },
      lastName: {
        required,
        alpha,
        minLength: minLength(2),
        maxLength: maxLength(15)
      },
      mobileNo: {
        required,
        numeric,
        integer,
        saudi,
        minLength: minLength(9),
        maxLength: maxLength(15)
      },
      mobileCode: { required },
      nid: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(9),
        hasSpecials
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(15),
        strongPass
      },
      confirmPassword: {
        required,
        sameAs: sameAs(function() {
          return this.registerData.password;
        })
      },
      userAgreement: {
        required,
        checked: value => value === true
      }
    }
  },
  methods: {
    showAlert(msg, alertName) {
      this.alert.message = msg;
      Alert.methods.show(alertName);
    },

    showMessage(msg, title) {
      this.error.message = msg;
      this.error.title = title;
      Modal.methods.toggle();
    },

    setCountry(value) {
      this.registerData.country = value.id;
    },

    setCode({ dialCode }) {
      this.registerData.mobileCode = dialCode;
    },

    login(btn = null) {
      this.$v.loginData.$touch();
      if (this.$v.loginData.$invalid) {
        this.showAlert(this.$t("errors.requiredFieldsMissing"), "login-alert");
        return;
      }
      if (btn) utils.toggleButtonLoading(btn);

      API.Login(
        {
          userId: this.loginData.email,
          password: this.loginData.password,
          apiVersion: 2
        },
        r => {
          if (btn) utils.toggleButtonLoading(btn);

          this.saveAuthResponse(r);
        },
        e => {
          utils.toggleButtonLoading(btn);
          if (e.response.data.errorCode == "UnAuthorized") {
            this.showAlert(e.response.data.errorMessage, "login-alert");
          }

          if (e.response.data.errorCode == "ExceededNoOFTries") {
            this.showAlert(e.response.data.errorMessage, "login-alert");
          }

          if (e.response.data.errorCode == "OtpRequired") {
            this.setOtpData("login", e.response.data.data.otp.tempUserId);
          }
          NProgress.done();
        }
      );
    },

    register(btn) {
      this.$v.registerData.$touch();
      if (this.$v.registerData.$invalid) {
        this.showAlert(
          this.$t("errors.requiredFieldsMissing"),
          "register-alert"
        );
        return;
      }
      utils.toggleButtonLoading(btn);

      let regEmail = this.registerData.email;
      let regPassword = this.registerData.password;

      API.Register(
        {
          userId: this.registerData.email,
          password: this.registerData.password,
          apiVersion: 2,
          additionals: {
            mobile_no:
              this.registerData.mobileCode + this.registerData.mobileNo,
            mail: this.registerData.email,
            first_name: this.registerData.firstName,
            last_name: this.registerData.lastName,
            country: this.registerData.country,
            national_id: this.registerData.nid
          }
        },
        () => {
          utils.toggleButtonLoading(btn);

          this.loginData.email = regEmail;
          this.loginData.password = regPassword;
          this.login();
        },
        e => {
          utils.toggleButtonLoading(btn);
          this.showAlert(e.response.data.errorMessage, "register-alert");
          $("button").prop("disabled", false);
          NProgress.done();

          this.setOtpData("register", e.response.data.data.otp.tempUserId);
        }
      );
    },

    saveAuthResponse(r) {
      localStorage.setItem(
        "user_token",
        JSON.stringify(r.data.data.user.token)
      );
      localStorage.setItem("userInfo", JSON.stringify(r.data.data.user));
      localStorage.setItem("user_fullName", r.data.data.user.fullName);
      localStorage.setItem("identity", r.data.data.user.customerGroup);

      window.vm.app.reloadNavbar();
      this.$router.push({ name: "Home" });
    },

    setOtpData(initiator, id) {
      this.otp = {
        email:
          initiator == "login" ? this.loginData.email : this.registerData.email,
        password:
          initiator == "login"
            ? this.loginData.password
            : this.registerData.password,
        tempId: id,
        show: true
      };
    },

    getCountries() {
      this.loader.hide = false;
      API.Settings(
        r => {
          var countries = r.data.data.countries;
          for (let country of countries) {
            this.countryList.push({
              id: country.id,
              ar: country.name.ar,
              en: country.name.en,
              countryCode: country.countryCode,
              fieldValidations: country.fieldValidations
            });
          }
          this.loader.hide = true;
        },
        e => {
          this.showAlert(e.response.data.errorMessage);
          this.loader.hide = true;
        }
      );
    },

    reCalculateHeight() {
      $(".modal-view").css(
        "min-height",
        window.innerHeight - ($("nav").height() + $("footer").height())
      );
    }
  },

  components: { Footer, VSelect, Loading, Modal, Alert, FieldError, OTP },

  mounted: function() {
    this.reCalculateHeight();
    window.addEventListener("resize", this.reCalculateHeight);

    document.title = this.$t("nav.login");

    this.loader.hide = false;

    if (localStorage.getItem("user_token")) this.$router.push({ name: `Home` });
    else {
      this.getCountries();
    }
  },

  beforeUpdate: function() {
    document.title = this.$t("nav.login");
  }
};
</script>

<style lang="scss">
.material-checkbox-group {
  display: inline-block;
}

.error .vs__dropdown-toggle {
  border-color: #dc3545;
}
</style>
