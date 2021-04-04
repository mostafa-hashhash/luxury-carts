<template>
  <div class="details-input pb-5" id="detailsInputs">
    <Loading :message="loader.message" :hidden="loader.hide" />
    <Modal :message="error.message" :title="error.title" />
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-md-8 col-sm-12 col-lg-5">
          <form
            @submit.prevent="submitBooking($event.submitter)"
            id="frmBookingDetails"
          >
            <div v-if="identity == 'Third Party'" class="form-group">
              <div class="w-100 my-3">
                <input
                  class="form-control text-sm"
                  :placeholder="$t('register.nid')"
                  v-model="$v.bookingData.nid.$model"
                  :class="{ 'border-danger': $v.bookingData.nid.$error }"
                />
                <FieldError
                  v-if="
                    $v.bookingData.nid.$error && !$v.bookingData.nid.required
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
                    $v.bookingData.nid.$error &&
                      (!$v.bookingData.nid.minLength ||
                        !$v.bookingData.nid.maxLength)
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.invalidNID'),
                      className: 'text-danger'
                    }
                  ]"
                />
                <FieldError
                  v-if="
                    $v.bookingData.nid.$error && !$v.bookingData.nid.hasSpecials
                  "
                  :errorList="[
                    {
                      msg: $t('validation.errors.hasSpecials'),
                      className: 'text-danger'
                    }
                  ]"
                />
              </div>
            </div>

            <div class="form-group">
              <date-pick
                class="w-100"
                v-model="$v.bookingData.fromdatetime.$model"
                :pickTime="true"
                :use12HourClock="true"
                :format="'YYYY-MM-DD HH:mm'"
                :displayFormat="'YYYY.MM.DD H:mm A'"
                :isDateDisabled="availableDate"
                :months="months"
                :weekdays="weekdays"
                :startWeekOnSunday="true"
                :setTimeCaption="$t('setTime')"
                nextMonthCaption=""
                prevMonthCaption=""
                @input="checkDataIsCompleteGetPricing"
              >
                <template v-slot:default="{ toggle, inputValue }">
                  <div
                    class="btn-group w-100 rounded"
                    style="overflow: hidden"
                    @click.prevent="toggle"
                    role="group"
                  >
                    <button
                      type="button"
                      class="btn btn-primary rounded-0"
                      :class="{
                        'border-danger': $v.bookingData.fromdatetime.$error
                      }"
                    >
                      <i class="fas fa-calendar-alt"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-light w-100 p-1 rounded-0"
                      :class="{
                        'border-danger': $v.bookingData.fromdatetime.$error
                      }"
                    >
                      {{ inputValue || $t("details.from") }}
                    </button>
                  </div>
                </template>
              </date-pick>
              <FieldError
                v-if="
                  $v.bookingData.fromdatetime.$error &&
                    !$v.bookingData.fromdatetime.required
                "
                class="text-primary"
                :errorList="[
                  {
                    msg: $t('validation.errors.required')
                  }
                ]"
              />
              <FieldError
                v-if="
                  $v.bookingData.fromdatetime.$error &&
                    !$v.bookingData.fromdatetime.inThePast
                "
                class="text-primary"
                :errorList="[
                  {
                    msg: $t('validation.errors.pastDate')
                  }
                ]"
              />
            </div>

            <div class="form-group text-center">
              <div
                class="d-inline-block text-lg mx-3"
                :dir="$i18n.locale == 'en' ? 'rtl' : 'ltr'"
              >
                <label for="old"> {{ $t("details.old") }} </label>
                <input
                  type="checkbox"
                  class="mx-2"
                  name="old"
                  id="old"
                  v-model="bookingData.elderly"
                  @change="checkDataIsCompleteGetPricing"
                />
              </div>

              <div
                class="d-inline-block text-lg mx-3"
                :dir="$i18n.locale == 'en' ? 'rtl' : 'ltr'"
              >
                <label for="special"> {{ $t("details.special") }} </label>
                <input
                  type="checkbox"
                  class="mx-2"
                  name="special"
                  id="special"
                  v-model="bookingData.specialNeeds"
                  @change="checkDataIsCompleteGetPricing"
                />
              </div>
            </div>

            <div class="form-group" v-if="this.bookingData.specialNeeds">
              <input
                type="file"
                name="special-needs-cert"
                id="specialNeedsCert"
                hidden
                @change="uploadFile"
                accept="image/*"
              />
              <label
                id="specialNeedsCertLabel"
                for="specialNeedsCert"
                class="row no-gutters w-100 px-2 py-1 rounded"
                :class="{
                  'bg-light border-0 text-dark':
                    bookingData.specialNeedsCert.status != 'new'
                }"
              >
                <div
                  class="col"
                  :class="{
                    'text-right': $i18n.locale == 'ar',
                    'text-left': $i18n.locale == 'en'
                  }"
                >
                  <span
                    v-if="bookingData.specialNeedsCert.fileName != ''"
                    class="d-block"
                  >
                    {{ bookingData.specialNeedsCert.fileName }}
                  </span>
                  <span v-else class="d-block">
                    {{ $t("details.uploadSpecialCert") }}
                  </span>
                </div>

                <div class="col-1">
                  <span
                    class="upload-icon-container mx-auto"
                    v-if="bookingData.specialNeedsCert.status == 'new'"
                  >
                    <span class="text-dark">
                      <i class="fas fa-plus"></i>
                    </span>
                  </span>
                  <span
                    class="upload-icon-container mx-auto"
                    v-if="bookingData.specialNeedsCert.status == 'uploading'"
                  >
                    <span class="text-primary">
                      <i class="fas fa-spin fa-circle-notch"></i>
                    </span>
                  </span>
                  <span
                    class="upload-icon-container mx-auto"
                    v-if="bookingData.specialNeedsCert.status == 'error'"
                  >
                    <span class="text-danger">
                      <i class="fas fa-exclamation-triangle"></i>
                    </span>
                  </span>
                  <span
                    class="upload-icon-container mx-auto"
                    v-if="bookingData.specialNeedsCert.status == 'success'"
                  >
                    <span class="text-success">
                      <i class="fas fa-check"></i>
                    </span>
                  </span>
                </div>
              </label>
            </div>

            <div class="form-group">
              <VSelect
                :searchable="false"
                :options="vehicle_location"
                label="addressTitle"
                class="bg-light rounded"
                :class="{ error: $v.bookingData.location.$error }"
                :placeholder="$t('details.location')"
                :reduce="option => option.id"
                v-model="$v.bookingData.location.$model"
                :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
                @input="checkDataIsCompleteGetPricing"
              />
              <FieldError
                v-if="
                  $v.bookingData.location.$error &&
                    !$v.bookingData.location.required
                "
                class="text-primary"
                :errorList="[
                  {
                    msg: $t('validation.errors.required')
                  }
                ]"
              />
            </div>

            <div class="form-group">
              <v-select
                multiple
                :searchable="false"
                :placeholder="$t('details.addons.title')"
                :options="vehicle_addons"
                class="bg-light rounded"
                :getOptionLabel="
                  option =>
                    `${option.title} ${option.price.rate} ${option.currency.name}`
                "
                v-model="bookingData.addonsId"
                :reduce="option => option.id"
                :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
                @input="checkDataIsCompleteGetPricing"
              >
                <template #option="{ price, title, currency }">
                  {{ title }}
                  <br />
                  <cite>
                    {{ $t("details.addons.price") }}
                    {{ `${price.rate} ${currency.name}` }}
                    <span v-if="price.discount">
                      - {{ $t("details.addons.discount") }}
                      {{ price.discount + currency.name }}
                    </span>
                    <br />
                    <span>{{ $t("driverMsg") }}</span>
                  </cite>
                </template>
              </v-select>
            </div>

            <div class="form-group">
              <VSelect
                :searchable="false"
                v-model="$v.bookingData.type.$model"
                :options="vehicle_type"
                label="type"
                id="vehicle-type-select"
                class="bg-light rounded d-inline-block w-100"
                :class="{ error: $v.bookingData.type.$error }"
                :placeholder="$t('details.type')"
                :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
                :reduce="option => option.id"
                @input="checkDataIsCompleteGetPricing"
              />
              <FieldError
                v-if="
                  $v.bookingData.type.$error && !$v.bookingData.type.required
                "
                class="text-primary"
                :errorList="[
                  {
                    msg: $t('validation.errors.required')
                  }
                ]"
              />
              <FieldError
                v-if="
                  $v.bookingData.type.$error && !$v.bookingData.type.hasDriver
                "
                class="text-primary"
                :errorList="[
                  {
                    msg: $t('validation.errors.hasDriver')
                  }
                ]"
              />
            </div>

            <div class="form-group">
              <VSelect
                :searchable="false"
                v-model="$v.bookingData.paymentMethod.$model"
                class="bg-light rounded"
                :class="{ error: $v.bookingData.paymentMethod.$error }"
                :options="vehicle_payments"
                label="title"
                :placeholder="$t('details.payment')"
                :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
                :reduce="option => option.id"
              />
              <FieldError
                v-if="
                  $v.bookingData.paymentMethod.$error &&
                    !$v.bookingData.paymentMethod.hasDriver
                "
                class="text-primary"
                :errorList="[
                  {
                    msg: $t('validation.errors.required')
                  }
                ]"
              />
            </div>

            <div class="form-group">
              <!--
              <p class="book-msg">
                {{ $t("details.msg1") }} {{ pickUpRange }}
                {{ $t("details.msg2") }}
              </p>
              -->

              <p class="book-msg">
                {{ $t("details.agree") }}
                <router-link
                  class="text-primary"
                  :to="{ name: 'Privacy Policy' }"
                >
                  {{ $t("foo.policy") }}
                </router-link>

                {{ $t("login.and") }}
                <router-link
                  class="text-primary"
                  :to="{ name: 'TermsConditions' }"
                >
                  {{ $t("foo.terms") }}
                </router-link>
              </p>
            </div>

            <div
              v-if="bookingData.loadingPricing"
              id="price"
              class="d-flex justify-content-center align-items-center"
            >
              <Loader />
            </div>
            <div
              v-else
              v-show="bookingData.price"
              class="w-100 mx-auto"
              :class="{
                'text-right': $i18n.locale == 'ar',
                'text-left': $i18n.locale == 'en'
              }"
              id="price"
            >
              <div class="row mt-3">
                <div class="col w-75">
                  {{ $t("details.price") }}
                </div>
                <div
                  class="col-5 w-25"
                  :class="{
                    'text-right': $i18n.locale == 'en',
                    'text-left': $i18n.locale == 'ar'
                  }"
                >
                  {{ bookingData.price }}
                  {{ bookingData.currency.title }}
                </div>
                <br />
              </div>

              <div class="discount row">
                <div class="col w-75">
                  {{ $t("details.discount") }}
                </div>
                <div
                  class="col-5 w-25"
                  :class="{
                    'text-right': $i18n.locale == 'en',
                    'text-left': $i18n.locale == 'ar'
                  }"
                >
                  {{ bookingData.discount }}
                  {{ bookingData.currency.title }}
                </div>
              </div>

              <div class="discount row">
                <div class="col w-75">
                  {{ $t("details.discountPercentage") }}
                </div>
                <div
                  class="col-5 w-25"
                  :class="{
                    'text-right': $i18n.locale == 'en',
                    'text-left': $i18n.locale == 'ar'
                  }"
                >
                  {{ bookingData.discountPercentage }} %
                </div>
              </div>

              <div class="discount row">
                <div class="col w-75">
                  {{ $t("details.vat") }}
                </div>
                <div
                  class="col-5 w-25"
                  :class="{
                    'text-right': $i18n.locale == 'en',
                    'text-left': $i18n.locale == 'ar'
                  }"
                >
                  {{ bookingData.vat }}
                  {{ bookingData.currency.title }}
                </div>
              </div>

              <div class="row mt-3">
                <div class="col w-75">
                  {{ $t("details.total") }}
                </div>
                <div
                  class="col-5 w-25"
                  :class="{
                    'text-right': $i18n.locale == 'en',
                    'text-left': $i18n.locale == 'ar'
                  }"
                >
                  {{ bookingData.total }}
                  {{ bookingData.currency.title }}
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 btn-lg confirm">
              {{ $t("details.button") }}
            </button>
          </form>
        </div>
        <div class="col"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DatePick from "vue-date-pick";
import $ from "jquery";
import Modal from "@/components/error/Modal";
import API from "@/apis.js";
import VSelect from "vue-select";
import {
  required,
  maxLength,
  minLength,
  helpers
} from "vuelidate/lib/validators";
import NProgress from "nprogress";
import Loader from "vue-loading-spinner/src/components/Gauge";
import Loading from "@/components/global/Loading";
import utils from "@/utils";
import FieldError from "@/components/error/FieldError";

API.defAxios();
const identity = localStorage.getItem("identity");

const hasDriver = function(value, vm) {
  if (vm.addonsId.includes("Driver")) {
    if (value == "One Seat") {
      return false;
    }
  }
  return true;
};

const inThePast = function(value) {
  if (new Date(value) < new Date()) return false;

  return true;
};

const hasSpecials = helpers.regex(
  "hasSpecials",
  /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/
);

export default {
  name: "DetailsInput",
  data() {
    return {
      error: {
        message: "error message",
        title: "error title"
      },
      loader: {
        message: undefined,
        hide: true
      },
      bookingData: {
        specialNeedsCert: {
          fileName: "",
          status: "new"
        },
        specialNeedsCertFileId: "",
        fromdatetime: "",
        location: "",
        type: "",
        price: 0,
        discount: 0,
        vat: 0,
        discountPercentage: 0,
        total: 0,
        currency: "",
        elderly: false,
        specialNeeds: false,
        addonsId: [],
        paymentMethod: "",
        nid: "",
        success: true,
        loadingPricing: false
      },
      months: this.$t("details.months"),
      weekdays: this.$t("details.weekDays"),
      datetime: {
        right: true,
        overlay: true,
        required: true,
        min: "",
        max: ""
      },
      vehicle_type: [],
      vehicle_location: [],
      vehicle_payments: [],
      vehicle_addons: [],
      pickUpRange: "",
      bookingMaxDate: "",
      identity: ""
    };
  },
  components: { DatePick, VSelect, Loader, Loading, FieldError, Modal },
  validations: {
    bookingData: {
      fromdatetime: { required, inThePast },
      nid: {
        required: identity == "Third Party" ? required : true,
        maxLength: identity == "Third Party" ? maxLength(9) : true,
        minLength: identity == "Third Party" ? minLength(6) : true,
        hasSpecials: identity == "Third Party" ? hasSpecials : true
      },
      location: { required },
      type: {
        required,
        hasDriver
      },
      price: { required },
      paymentMethod: { required }
    }
  },
  methods: {
    uploadFile(e) {
      var f = e.target.files[0];
      this.bookingData.specialNeedsCert.fileName = f.name;
      this.bookingData.specialNeedsCert.status = "uploading";
      API.attachFile(
        f,
        r => {
          this.bookingData.specialNeedsCertFileId = r.data.data.id;
          this.bookingData.specialNeedsCert.status = "success";
        },
        e => {
          console.log("Error: ", e.request.response);
          this.bookingData.specialNeedsCert.status = "error";
        }
      );
    },
    showErrorMessage() {
      // TODO: remove this method.
      // I'll keep it to help in revamping/enhancing th FieldError Component
      this.$v.bookingData.type.$touch();
      if (!this.$v.bookingData.type.$error) {
        $("#vehicle-type-select").popover("hide");
        return;
      }

      if (!this.$v.bookingData.type.hasDriver) {
        $("#vehicle-type-select").attr(
          "data-content",
          this.$t("details.errorMessages.invalidType")
        );
        $("#vehicle-type-select").attr("data-toggle", "popover");
        if (this.$i18n.locale == "ar") {
          $('[data-toggle="popover"]').popover({
            trigger: "manual",
            template: `
              <div class="popover text-right" role="tooltip">
                <div class="arrow"></div>
                <h3 class="popover-header"></h3>
                <div class="popover-body text-danger"></div>
              </div>
            `
          });
        }
        $("#vehicle-type-select").popover("show");
      }
    },
    showAlert(msg, title) {
      this.error.message = msg;
      this.error.title = title;
      Modal.methods.toggle();
      return false;
    },
    availableDate(date) {
      return (
        date < new Date(this.datetime.min + "T00:00:00") ||
        date > new Date(this.datetime.max + "T00:00:00")
      );
    },

    submitBooking(btn) {
      utils.toggleButtonLoading(btn);
      this.$v.bookingData.$touch();
      if (this.$v.$error) {
        utils.toggleButtonLoading(btn);
        return;
      }
      this.saveDetails();

      this.$router.push({ name: "Confirmation" });
    },

    format(option) {
      let x = this.$v.bookingData.fromdatetime.$model;

      let date = new Date(x);

      if (!x) {
        return;
      }

      if (option == "pricing") return date.toISOString().split("T")[0];
      else if (option == "utc") return date.toISOString();
    },

    getPricing() {
      this.$v.bookingData.type.$touch();
      if (this.$v.bookingData.type.$error) {
        return;
      }

      this.bookingData.loadingPricing = true;
      const params = {
        AddOn: encodeURIComponent(this.bookingData.addonsId || []),
        from: this.format("pricing"),
        vehicleType: this.bookingData.type,
        location: this.bookingData.location,
        apiVersion: 2,
        withSpecialNeeds: this.bookingData.specialNeeds,
        isElderly: this.bookingData.elderly
      };
      API.PricingDetails(
        params,
        r => {
          this.bookingData.loadingPricing = false;
          this.bookingData.price = parseFloat(
            r.data.data.grandTotal
          ).toPrecision(4);
          this.bookingData.currency = r.data.data.currency;
          this.bookingData.discount = parseFloat(
            r.data.data.discountValue
          ).toPrecision(4);
          this.bookingData.discountPercentage = parseFloat(
            r.data.data.appliedDiscount
          ).toPrecision(4);
          this.bookingData.vat = parseFloat(r.data.data.vat).toPrecision(4);
          this.bookingData.total = parseFloat(
            r.data.data.paymentDue
          ).toPrecision(4);
        },
        err => {
          // TODO: replace loading indicator of price with error message
          this.bookingData.loadingPricing = false;

          NProgress.done();
          $("button").prop("disabled", false);
          console.log(err.response.data);
        }
      );
    },

    checkDataIsCompleteGetPricing() {
      if (
        this.bookingData.fromdatetime &&
        this.bookingData.type &&
        this.bookingData.location
      )
        this.getPricing();

      return false;
    },

    checkSelectedFromAvailability() {
      let current = new Date();
      let from = new Date(this.bookingData.fromdatetime);

      this.bookingData.validFrom = from > current;

      return this.bookingData.validFrom;
    },

    saveDetails() {
      sessionStorage.setItem("from", this.format("utc"));
      sessionStorage.setItem("vechileType", this.bookingData.type);
      sessionStorage.setItem(
        "specialNeedsCertFileId",
        this.bookingData.specialNeedsCertFileId
      );
      sessionStorage.setItem("location", this.bookingData.location);
      sessionStorage.setItem("paymentMethod", this.bookingData.paymentMethod);
      sessionStorage.setItem("price", this.bookingData.total);
      sessionStorage.setItem("currency", this.bookingData.currency.id);
      sessionStorage.setItem(
        "addonsList",
        JSON.stringify(this.bookingData.addonsId)
      );
      sessionStorage.setItem("specialNeeds", this.bookingData.specialNeeds);
      sessionStorage.setItem("elderly", this.bookingData.elderly);
      sessionStorage.setItem("referenceNumber", this.bookingData.nid);
    },

    updateBookingRange() {
      let min = new Date();
      this.datetime.min = min.toISOString().split("T")[0];

      let max = new Date();
      max.setDate(max.getDate() + this.bookingMaxDate);
      this.datetime.max = max.toISOString().split("T")[0];
    },

    getMetaData() {
      this.loader.hide = false;
      API.MetaData(
        r => {
          this.vehicle_type = r.data.data.vehicleTypes;
          this.vehicle_location = r.data.data.vehicleLocations;
          this.vehicle_addons = r.data.data.addOns;
          this.vehicle_payments = r.data.data.paymentMethods;
          this.bookingMaxDate = r.data.data.bookingMaxDateInDays;

          var x = r.data.data.pickUpMaxTimeInHours;

          this.pickUpRange =
            x >= 24
              ? `${x / 24} ${this.$t("pickup.day")}`
              : `${x} ${this.$t("pickup.hour")}`;

          this.updateBookingRange();
          this.loader.hide = true;
          return;
        },
        e => {
          this.loader.hide = true;
          this.showAlert(e.response.data.errorMessage, this.$t("error"));
          return;
        }
      );
    }
  },

  mounted: function() {
    API.defAxios();
    this.identity = localStorage.getItem("identity");

    if (!localStorage.getItem("user_token")) {
      this.$router.push({ name: `Identity` });
      return;
    }
    this.getMetaData();
  }
};
</script>

<style lang="scss">
$vdpColor: #ec463e;
@import "vue-date-pick/src/vueDatePick.scss";

.text-sm {
  font-size: 0.98em;
}

#frmBookingDetails {
  text-align: center;
}

#price {
  font-size: 25px;
  font-weight: bold;
  margin: 10px;
}

.discount {
  font-size: 20px !important;
  font-weight: normal;
}

.book-msg {
  font-weight: bold;
  padding: 0px 5px;
  text-align: center;
}

#price {
  .spinner::after {
    background: #ec463e;
  }
}

.vdpTimeControls {
  direction: ltr;
}

#specialNeedsCertLabel {
  border: 2px dashed #fff;
  cursor: pointer;
}
.upload-icon-container {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: white;
  color: #3d3d3d !important;
}
</style>
