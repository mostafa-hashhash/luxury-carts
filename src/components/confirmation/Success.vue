<template>
  <div id="success" class="container">
    <div class="row m-0">
      <div class="col"></div>
      <div class="col-md-6">
        <div
          class="border border-success shadow bg-white text-left mx-auto py-4 px-3 suc-msg-container"
        >
          <div class="row">
            <div class="col-1">
              <h5 class="text-center text-success">
                <i class="fas fa-check-circle"></i>
              </h5>
            </div>
            <div class="col-11">
              <h5
                class="text-success"
                :class="{ 'text-right': $i18n.locale == 'ar' }"
              >
                {{ $t("success.message") }}
              </h5>
            </div>

            <div class="col-1">
              <h5 class="text-center text-muted">
                <i class="fas fa-calendar-alt"></i>
              </h5>
            </div>
            <div class="col-11">
              <h6
                class="text-muted"
                :class="{ 'text-right': $i18n.locale == 'ar' }"
                style="margin:10px 0px 0px 0px;"
              >
                {{ bookingData.from }}

                <b v-if="$i18n.locale == 'en'"> &#x25B6; </b>
                <b v-else> &#x25C0; </b>

                {{ bookingData.to }}
              </h6>
            </div>

            <div class="col-1">
              <h5 class="text-center text-muted">
                <i class="fas fa-car"></i>
              </h5>
            </div>
            <div class="col-4">
              <h5
                class="text-muted"
                :class="{ 'text-right': $i18n.locale == 'ar' }"
              >
                {{ bookingData.vechileType }}
              </h5>
            </div>

            <div class="col-1">
              <h5 class="text-center text-muted">
                <i class="fas fa-map-marker-alt"></i>
              </h5>
            </div>
            <div class="col-6">
              <h5
                class="text-muted"
                :class="{ 'text-right': $i18n.locale == 'ar' }"
              >
                {{ bookingData.location }}
              </h5>
            </div>

            <div class="col-1">
              <h5 class="text-center text-muted">
                <i class="fas fa-money-check-alt"></i>
              </h5>
            </div>
            <div class="col-4">
              <h5
                class="text-muted"
                :class="{ 'text-right': $i18n.locale == 'ar' }"
              >
                {{ bookingData.paymentMethod }}
              </h5>
            </div>

            <div class="col-1">
              <h5 class="text-center text-muted">
                <i class="fas fa-blind"></i>
              </h5>
            </div>
            <div class="col-6">
              <h5 class="text-muted">
                {{ bookingData.isElderly }}
              </h5>
            </div>

            <div class="col-1">
              <h5 class="text-center text-muted">
                <i class="fas fa-wheelchair"></i>
              </h5>
            </div>
            <div class="col-4">
              <h5 class="text-muted">
                {{ bookingData.isSpecialNeeds }}
              </h5>
            </div>

            <div class="col-1" v-if="bookingData.addOns.length > 0">
              <h5 class="text-center text-muted">
                <i class="fas fa-plus"></i>
              </h5>
            </div>
            <div class="col-5">
              <h5 class="text-muted">
                {{ bookingData.addOns[0] }}
              </h5>
            </div>

            <!-- <div class="col-1">
              <h5 class="text-center text-muted">
                <i class="fas fa-dollar-sign"></i>
              </h5>
            </div>
            <div class="col-4">
              <h5 class="text-muted">
                {{ bookingData.price }} {{ bookingData.currency }}
              </h5>
            </div> -->
          </div>
        </div>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "success",
  data() {
    return {
      // TODO: handle translation for this
      bookingData: {
        from: this.getMsgDateTime("from"),
        to: this.getMsgDateTime("to"),
        vechileType: sessionStorage.getItem("vechileType"),
        location: sessionStorage.getItem("location"),
        paymentMethod: sessionStorage.getItem("paymentMethod"),
        isElderly: sessionStorage.getItem("elderly"),
        isSpecialNeeds: sessionStorage.getItem("specialNeeds"),
        addOns: JSON.parse(sessionStorage.getItem("addonsList")),
        price: sessionStorage.getItem("price"),
        currency: sessionStorage.getItem("currency")
      }
    };
  },

  methods: {
    getMsgDateTime(str) {
      let date = new Date(sessionStorage.getItem(str));

      const options = {
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        month: "short",
        day: "numeric"
      };
      return date.toLocaleString(`${this.$i18n.locale}`, options);
    },

    localeBasedAlignment() {
      if (this.$i18n.locale == "ar") {
        document.querySelector(".suc-msg-container").style.direction = "rtl";
        document.querySelectorAll("h5").forEach(line => {
          line.style.textAlign = "right";
        });
        document.querySelectorAll("h6").forEach(line => {
          line.style.textAlign = "right";
        });
      }
    }
  },

  mounted: function() {
    this.localeBasedAlignment();
  }
};
</script>

<style lang="scss" scoped>
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0 auto;
}

h5,
h6 {
  margin: 5px auto;
}
</style>
