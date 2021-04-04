<template>
  <div>
    <div id="accordion">
      <div class="mb-3">
        <div
          class="card"
          :class="{
            'text-right': $i18n.locale == 'ar',
            'text-left': $i18n.locale == 'en'
          }"
        >
          <div class="card-header bg-white" id="headingOne">
            <button
              class="btn p-0 w-100 text-left"
              data-toggle="collapse"
              :data-target="`#${item.id}`"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              <div class="row">
                <div class="col d-flex align-items-center">
                  <h6>
                    <span class="text-bold">{{ $t("card.date") }}: </span
                    >{{ item.from }}
                  </h6>
                </div>
                <div
                  class="col-3 d-flex align-items-center justify-content-center flex-column"
                >
                  <img
                    class="car-img mb-2"
                    src="@/assets/golf-cart.svg"
                    alt="Image not found"
                  />

                  <div
                    class="badge mt-1 rounded p-1 w-100"
                    :class="{
                      'badge-success': item.status.id == 'Booked',
                      'badge-warning': item.status.id == 'In Progress',
                      'badge-primary': [
                        'Expired',
                        'Closed',
                        'Cancelled'
                      ].includes(item.status.id)
                    }"
                  >
                    {{ item.status.title }}
                  </div>

                  <div
                    v-if="
                      !['Expired', 'Closed', 'Cancelled'].includes(
                        item.status.id
                      )
                    "
                    class="badge d-inline mt-1 rounded p-1 w-100"
                    :class="{
                      'badge-primary': item.paymentStatus.id == 'UnPaid',
                      'badge-success': item.paymentStatus.id == 'Paid'
                    }"
                  >
                    {{ item.paymentStatus.title }}
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div
            :id="item.id"
            class="collapse hide"
            aria-labelledby="headingOne"
            data-parent="#accordion"
          >
            <div class="card-body">
              <div class="row">
                <div class="col-12">
                  <Alert
                    class="alert-danger"
                    :class="`alert-${item.id}`"
                    :message="alert.message"
                    :dismissable="alert.dismissable"
                  />
                </div>
                <div class="col">
                  <h6 class="text-bold">{{ $t("card.date") }}</h6>
                  <p>
                    {{ item.from }}
                    <br />
                    {{ item.to }}
                  </p>
                  <p class="m-0">
                    <span class="text-bold">{{ $t("card.location") }}: </span
                    >{{ item.bookingLocation }}
                  </p>
                  <p class="m-0">
                    <span class="text-bold">{{ $t("card.payment") }}: </span
                    >{{ item.paymentMethod }}
                  </p>
                  <p class="m-0">
                    <span class="text-bold">{{ $t("card.type") }}: </span
                    >{{ item.vehicleType }}
                  </p>

                  <div v-if="item.creatorIdentity">
                    <div v-if="item.creatorIdentity == 'thirdParty'">
                      <b> {{ $t("card.createdBy") }} </b>
                      <label>{{ item.identityName }}</label>
                    </div>
                    <div v-else class="card-line">
                      <b class="list-title">{{ $t("card.customerName") }} </b>
                      <label>{{ item.identityName }}</label>
                    </div>
                  </div>

                  <div v-if="item.addOns.length > 0">
                    <br />
                    <b>{{ $t("card.addons") }}:</b>
                    <label v-for="addon in item.addOns" :key="addon.id">
                      <span class="rounded border py-1 px-3 mx-1">
                        {{ addon.addOnId }}
                      </span>
                    </label>
                  </div>
                  <div v-if="item.isElderly || item.isSpecialNeeds">
                    <br />
                    <span
                      v-if="item.isElderly"
                      class="border-primary px-2 py-1 text-primary rounded mx-1"
                    >
                      {{ $t("card.old") }}
                    </span>
                    <span
                      v-if="item.isSpecialNeeds"
                      class="border-primary px-2 py-1 text-primary rounded mx-1"
                    >
                      {{ $t("card.special") }}
                    </span>
                  </div>
                </div>

                <div class="col">
                  <img
                    v-if="item.qrImageUrl"
                    :src="item.qrImageUrl"
                    class="w-50"
                    alt="QR Code not found"
                  />

                  <div class="py-2 border rounded mb-1 text-center">
                    {{ item.id }}
                  </div>

                  <button
                    class="btn btn-outline-dark text-sm w-100 my-1"
                    @click="getBookingSummary($event.target, item.id)"
                  >
                    {{ $t("card.pdf.bookingSummary") }}
                  </button>

                  <button
                    v-if="item.paymentStatus.id == 'Paid'"
                    @click="getDeliveryNotePdf($event.target)"
                    class="btn btn-outline-dark text-sm w-100 my-1"
                  >
                    {{ $t("card.pdfDownload") }}
                  </button>

                  <button
                    class="btn btn-outline-dark text-sm w-100 my-1"
                    @click="getInvoicePdf($event.target, item.salesInvoiceId)"
                    v-if="item.paymentStatus.id == 'Paid'"
                  >
                    {{ $t("card.pdf.invoice") }}
                  </button>

                  <div v-if="item.checkUpPdfUrls.length > 0">
                    <button
                      v-for="(url, i) in item.checkUpPdfUrls"
                      :key="i"
                      class="btn btn-outline-dark text-sm my-1 w-100"
                      @click="
                        getPDF(
                          $event.target,
                          url.fileURL,
                          `${$t('card.checkup')} ${(i + 1).toLocaleString(
                            $i18n.locale + '-EG'
                          )}`
                        )
                      "
                    >
                      {{ $t("card.checkup") }}
                      {{ (i + 1).toLocaleString($i18n.locale + "-EG") }}
                    </button>
                  </div>
                  <button
                    v-if="
                      !['Expired', 'Closed', 'Cancelled'].includes(
                        item.status.id
                      )
                    "
                    @click="emitCancel"
                    class="btn btn-primary text-sm my-1 w-100"
                  >
                    {{ $t("card.cancel.button") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/apis.js";
import axios from "axios";
import utils from "@/utils";
import Alert from "@/components/global/Alert";

export default {
  name: "BookingCard",
  components: { Alert },
  props: ["item"],

  data() {
    return {
      alert: {
        message: "",
        dismissable: false
      },
      creatorIdentity: ""
    };
  },

  mounted: function() {
    this.creatorIdentity = sessionStorage.getItem("creatorIdentity");
  },

  methods: {
    showAlert(msg, dismissable = false) {
      this.alert.message = msg;
      this.alert.dismissable = dismissable;
      Alert.methods.show(`alert-${this.item.id}`);
    },
    emitCancel() {
      this.$emit("cancel", this.item.id);
    },
    getInvoicePdf(btn, invoice_id) {
      utils.toggleButtonLoading(btn);
      API.getBasicReport(
        { documentType: "Sales Invoice", reportId: invoice_id },
        r => {
          utils.saveByteArray(invoice_id, [r.data], r.headers["content-type"]);
          utils.toggleButtonLoading(btn);
        },
        e => {
          this.showAlert(e.response.data.errorMessage, true);
          utils.toggleButtonLoading(btn);
        }
      );
    },
    getBookingSummary(btn, bookingId) {
      utils.toggleButtonLoading(btn);
      API.bookingSummary(
        {
          "filters[booking_id]": bookingId
        },
        r => {
          var fileURL = URL.createObjectURL(
            new Blob([r.data], { type: "application/pdf" })
          );
          var fileLink = document.createElement("a");

          fileLink.href = fileURL;
          fileLink.setAttribute("target", "_blank");

          fileLink.click();
          URL.revokeObjectURL(fileURL);
          this.clearDetails();
          utils.toggleButtonLoading(btn);
        },
        () => {
          utils.toggleButtonLoading(btn);
        }
      );
    },
    getPDF(btn, checkUpFileUrl, filename) {
      utils.toggleButtonLoading(btn);
      API.getCheckUpPdfList(
        {
          fileUrl: checkUpFileUrl
        },
        r => {
          var fileURL = window.URL.createObjectURL(
            new Blob([r.data]),
            "application/pdf"
          );
          var fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.download = `${filename}.pdf`;
          fileLink.click();
          utils.toggleButtonLoading(btn);
        },
        () => {
          this.$emit("error");
          utils.toggleButtonLoading(btn);
        }
      );
    },
    getDeliveryNotePdf(btn) {
      utils.toggleButtonLoading(btn);
      this.$router.push({
        name: `DeliveryNote`,
        params: { rentalAgreementId: this.item.rentalAgreementId }
      });
    },
    getCheckUpList(checkUpFileUrl) {
      axios({
        url: `/api/crm/stream-file?fileUrl=${checkUpFileUrl}`,
        method: "GET",
        responseType: "blob"
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", `${checkUpFileUrl.title}.pdf`);
        fileLink.setAttribute("target", "_blank");
        document.body.appendChild(fileLink);

        fileLink.click();
      });
    }
  }
};
</script>

<style lang="scss">
.list-title {
  font-weight: bold;
  font-size: 18px;
}

.pdf-list {
  width: 100%;
  text-align: left;
  padding: 10px 20px 0px 20px;
  margin-top: -20px;
}

.pdf-img {
  width: 60px;
}

.pdf-item {
  margin: 0px 10% 0px 0px;
  display: inline-block;
}

.pdf-item:hover {
  cursor: pointer;
}

.pdf-item > p {
  padding-top: 10px;
}

.car-img {
  width: 40px;
}

.title-from {
  text-align: right;
  float: right;
}

.card-body .alert {
  margin-top: 0 !important;
}
</style>
