<template>
  <div>
    <div id="bookingList" class="bg-light">
      <div class="text-center">
        <div class="container">
          <PageTitle :title="$t('list.title')" />

          <PopUp
            :title="popup.title"
            :body="popup.body"
            :yesButton="popup.yes"
            :noButton="popup.no"
            :popupType="popup.popupType"
            @accept="confirmCancel"
            @reject="rejectCancel"
            @ok="okHandler"
            id="CancelModal"
          />

          <Loading v-if="status == 'loading'" />
          <Empty v-else-if="status == 'empty'" />

          <div v-else class="row">
            <div class="col"></div>
            <div class="col-md-6 p-0">
              <BookingCard
                v-for="item in items"
                :key="item.name"
                :item="item"
                @cancel="cancelBooking"
              />
            </div>
            <div class="col"></div>
          </div>
        </div>
      </div>
    </div>
    <Footer classList="bg-dark" />
  </div>
</template>

<script>
import PageTitle from "@/components/global/PageTitle";
import Footer from "@/components/global/Footer";
import BookingCard from "@/components/booking-list/BookingCard";
import Empty from "@/components/booking-list/Empty";
import API from "@/apis.js";
import $ from "jquery";
import PopUp from "@/components/booking-list/PopUp";
import Loading from "@/components/confirmation/Loading";
import NProgress from "nprogress";

export default {
  name: "BookingList",

  components: { Footer, PageTitle, Empty, BookingCard, Loading, PopUp },

  data() {
    return {
      showRefund: false,
      cancelledCardId: "",
      refundMessage: "",
      popup: {
        title: "",
        body: "",
        yes: "",
        no: "",
        popupType: ""
      },
      status: "",
      items: []
    };
  },

  mounted: function() {
    this.reCalculateHeight();
    window.addEventListener("resize", this.reCalculateHeight);

    document.title = this.$t("nav.list");
    window.vm.bookingList = this;

    this.getItems();
  },
  methods: {
    reload() {
      this.getItems();
    },
    getItems() {
      this.status = "loading";
      if (localStorage.getItem("user_token")) {
        API.defAxios();
        API.BookingList(r => {
          this.items = r.data.data.bookingList;

          if (this.items.length > 0) {
            this.items.forEach(card => {
              card.from = this.format(card.from);
              card.to = this.format(card.to);
            });
            this.status = "";
          } else this.status = "empty";
        });
      } else this.$router.push({ name: "Identity" });
    },

    format(str) {
      var date = new Date(str);
      const options = {
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        month: "short",
        day: "numeric"
      };
      return date.toLocaleString(`${this.$i18n.locale}`, options);
    },

    cancelBooking(bookingId) {
      // 1
      this.getCancellationFees(bookingId);
    },
    getCancellationFees(bookingId) {
      // 2
      this.cancelledCardId = bookingId;
      API.CancelData(
        {
          bookingId: bookingId
        },
        r => {
          this.popup = {
            body: r.data.data.message,
            title: this.$t("card.cancel.title"),
            yes: this.$t("card.cancel.yes"),
            no: this.$t("card.cancel.no"),
            popupType: "confirm"
          };
          $("#CancelModal").modal("show");
        },
        e => {
          this.popup = {
            title: this.$t("card.cancel.status"),
            body: e.response.data.errorMessage,
            popupType: "message"
          };
          $("#CancelModal").modal("show");
        }
      );
    },
    confirmCancel() {
      // 3
      const bookingId = this.cancelledCardId;

      NProgress.start();
      API.CancelBooking(
        {
          bookingId: bookingId
        },
        () => {
          this.popup = {
            body: this.$t("card.cancel.success"),
            title: this.$t("card.cancel.status"),
            popupType: "message"
          };
          NProgress.done();
          this.getItems();
        },
        err => {
          console.log(err.response);
          NProgress.done();
        }
      );
    },
    okHandler() {
      $("#CancelModal").modal("hide");
    },
    rejectCancel() {
      $("#CancelModal").modal("hide");
    },
    resetCycleData() {
      this.cancelledCardId = "";
      this.refundMessage = "";
      this.showRefund = false;
    },

    reCalculateHeight() {
      $("#bookingList").css(
        "min-height",
        window.innerHeight - ($("nav").height() + $("footer").height())
      );
    }
  },

  beforeUpdate: function() {
    document.title = this.$t("nav.list");
  }
};
</script>
