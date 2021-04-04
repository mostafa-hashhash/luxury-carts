<template>
  <div>
    <div
      id="Confirmation"
      class="text-center bg-light d-flex justify-content-center align-items-center flex-column"
    >
      <Success v-if="status == 'success'" :message="error.message" />
      <Failure v-else-if="status == 'failure'" :message="error.message" />
      <TryAgain v-else-if="status == 'try_again'" />
      <Loading
        v-else-if="status == 'inprogress'"
        :statusMessage="$t(statusMessage)"
      />
    </div>

    <Footer classList="bg-dark" />
  </div>
</template>

<script>
import Success from "@/components/confirmation/Success2";
import Failure from "@/components/confirmation/Failure";
import TryAgain from "@/components/confirmation/TryAgain";
import Loading from "@/components/confirmation/Loading";
import Footer from "@/components/global/Footer";
import API from "@/apis.js";
import utils from "@/utils.js";
import NProgress from "nprogress";
import $ from "jquery";
import { v4 as uuidv4 } from "uuid";

API.defAxios();

export default {
  name: "Confirmation",
  data() {
    return {
      status: "inprogress",
      statusMessage: "",
      error: {
        message: ""
      }
    };
  },

  components: { Success, Footer, Failure, TryAgain, Loading },

  methods: {
    clearDetails() {
      setTimeout(() => {
        var list = [
          "from",
          "to",
          "vechileType",
          "location",
          "paymentMethod",
          "elderly",
          "addonsList",
          "specialNeeds",
          "bookingId",
          "orderId",
          "price",
          "currency"
        ];

        list.forEach(element => {
          sessionStorage.removeItem(element);
        });
      }, 5000);
    },

    submitPayment() {
      API.SubmitPayment(
        {
          orderId: sessionStorage.getItem("orderId"),
          bookingId: sessionStorage.getItem("bookingId"),
          method: "Card",
          apiVersion: 2
        },
        r => {
          var invoiceId = r.data.data.salesInvoiceId;
          API.getBasicReport(
            { documentType: "Sales Invoice", reportId: invoiceId },
            res => {
              utils.saveByteArray(
                invoiceId,
                [res.data],
                res.headers["content-type"]
              );
            },
            e => {
              console.log(e);
            }
          );
          this.status = "success";
          this.statusMessage = "";
        },
        e => {
          this.showAlert(e.response.data.developerMessage);
        }
      );
    },

    showAlert(msg) {
      this.error.message = msg;
    },

    confirmBooking() {
      const body = {
        customerGroup: localStorage.getItem("identity"),
        ReferenceNumber: sessionStorage.getItem("referenceNumber"),
        from: new Date(sessionStorage.getItem("from")).toISOString(),
        vehicleType: sessionStorage.getItem("vechileType"),
        location: sessionStorage.getItem("location"),
        paymentMethod: sessionStorage.getItem("paymentMethod"),
        addOn: JSON.parse(sessionStorage.getItem("addonsList") || null),
        isElderly: sessionStorage.getItem("elderly"),
        isSpecialNeeds: sessionStorage.getItem("specialNeeds"),
        specialNeedsAttachment: sessionStorage.getItem("specialNeedsCertFileId")
        // referenceNumber: ""
      };
      API.ConfirmBooking(
        body,
        r => {
          sessionStorage.setItem("bookingId", r.data.data.bookingId);
          this.status = "inprogress";
          if (
            body.paymentMethod == "Credit Card" &&
            parseFloat(sessionStorage.getItem("price")).toPrecision(12) > 0.0
          ) {
            this.statusMessage = this.$i18n.t("redirect");
            this.createSession();
          } else {
            this.status = "success";
            this.getBookingSummary();
          }
        },
        e => {
          this.status = "failure";
          this.showAlert(e.response.data.errorMessage);
        }
      );
    },

    getBookingSummary() {
      API.bookingSummary(
        {
          "filters[booking_id]": sessionStorage.getItem("bookingId")
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
        },
        e => {
          this.showAlert(e.response.data.errorMessage);
        }
      );
    },

    orderPaymentStatus(orderId) {
      return API.checkPaymentStatus(
        orderId,
        response => {
          if (response.data.data.result == "Success") {
            return true;
          }
        },
        () => {
          this.showAlert(this.i18n.t("confirmation.paymentError"));
          NProgress.done();
          return false;
        }
      );
    },

    createSession() {
      var orderId = uuidv4();
      sessionStorage.setItem("orderId", orderId);
      var url = `${window.location.href}?status=`;

      API.CreateSession(
        {
          orderId: orderId,
          orderDescription: "Luxury Carts booking payment",
          merchantDisplayName: "Luxury Carts",
          amount: parseFloat(sessionStorage.getItem("price")).toPrecision(12),
          currency: sessionStorage.getItem("currency"),
          onComplete: url + "completed&orderId=" + orderId,
          onError: url + "error&orderId=" + orderId,
          onCancel: url + "cancel&orderId=" + orderId,
          onTimeOut: url + "timeout&orderId=" + orderId
        },
        r => {
          sessionStorage.setItem("sessionId", r.data.data.sessionId);
          window.location =
            process.env.VUE_APP_API_URL +
            "/api/payments/sessions/" +
            r.data.data.sessionId +
            "/view?organizationCode=" +
            process.env.VUE_APP_ORG_CODE;
        },
        e => {
          this.showAlert(e.response.data.errorMessage);
        }
      );
    },

    reCalculateHeight() {
      $("#Confirmation").css(
        "min-height",
        window.innerHeight - ($("nav").height() + $("footer").height())
      );
    }
  },

  mounted: function() {
    this.reCalculateHeight();
    window.addEventListener("resize", this.reCalculateHeight);

    document.title = this.$t("confirm");
    if (
      sessionStorage.getItem("paymentMethod") == "Credit Card" &&
      parseFloat(sessionStorage.getItem("price")).toPrecision(12) > 0.0
    ) {
      let uri = location.href.substring(location.href.indexOf("?") + 1);
      let params = new URLSearchParams(uri);
      let queryStatus = params.get("status");
      let queryId = params.get("orderId");

      if (queryStatus) {
        if (queryStatus == "completed") {
          var orderId = sessionStorage.getItem("orderId");

          if (queryId == orderId) {
            this.status = "inprogress";
            this.statusMessage = this.$i18n.t("checkStatus");
            if (this.orderPaymentStatus(queryId)) this.submitPayment();
          }
        } else if (queryStatus == "timeout") {
          this.status = "try_again";
        } else if (queryStatus == "error" || queryStatus == "cancel") {
          this.status = "success";
          this.error.message = this.$t("confirmation.paymentError");
        }
        this.clearDetails();
      } else {
        this.status = "inprogress";
        this.statusMessage = this.$i18n.t("confirm");
        this.confirmBooking();
      }
    } else {
      this.status = "inprogress";
      this.statusMessage = this.$i18n.t("confirm");
      this.confirmBooking();
    }
  },

  beforeUpdate: function() {
    document.title = this.$t("confirm");
  }
};
</script>

<style lang="scss">
#Confirmation {
  min-height: 550px;
}
</style>
