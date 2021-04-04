<template>
  <div
    id="app"
    :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
    :class="{ 'text-right': $i18n.locale == 'ar' }"
  >
    <Navbar :key="navbarKey" />
    <Toast
      :message="toast.message"
      :delay="toast.delay"
      :connectionStatus="toast.connection"
    />
    <router-view />
  </div>
</template>

<script>
import Navbar from "@/components/global/Navbar.vue";
import "@popperjs/core";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "@/assets/material.css";
import "nprogress/nprogress.css";
import "vue-select/dist/vue-select.css";
import Vue from "vue";
import Vuelidate from "vuelidate";
import Toast from "@/components/global/Toast";
import $ from "jquery";
Vue.use(Vuelidate);

export default {
  name: "App",
  components: { Navbar, Toast },
  data() {
    return {
      navbarKey: -1000,
      toast: {
        message: "",
        delay: 4000,
        connection: ""
      }
    };
  },
  methods: {
    reloadNavbar() {
      this.navbarKey += 1;
    },

    showMessage(msg, connection) {
      this.toast.message = msg;
      this.toast.connection = connection;
      $("#toast").toast("show");
    }
  },
  created() {
    localStorage.setItem("locale", this.$i18n.locale || "ar");
    window.vm = {
      app: this
    };
  }
};
</script>

<style lang="scss">
$primary: #ec4315;
$dark: #2c3e50;

@import url("https://fonts.googleapis.com/css2?family=Almarai&display=swap");

#app {
  font-family: "Almarai", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $dark;
}

.text-sm {
  font-size: 0.9em;
}

.text-lg {
  font-size: 1.2em;
}

.clickable {
  cursor: pointer;
  transform: scale(1.05);
  transition: 0.3s ease;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Almarai", sans-serif;
}

.ltr {
  direction: ltr;
}

.vdpTable thead {
  font-size: 0.8em;
}

#nprogress .bar {
  background: $primary;
  height: 4px;
  .peg {
    box-shadow: 0 0 10px $primary, 0 0 5px $primary;
  }
}

.router-link-exact-active {
  color: $primary;
}

.btn-primary {
  background-color: $primary;
  border: none;
  transition: all 0.5s ease-in-out;
  &.btn-primary:hover {
    background-color: lighten($color: $primary, $amount: 3);
  }
}

.btn-outline-primary.disabled,
.btn-outline-primary:disabled {
  color: lighten($primary, 0.5);
}

.badge-primary {
  background-color: $primary;
}

.text-bold {
  font-weight: bolder;
}

.bg-primary {
  background-color: $primary !important;
}

*,
*:focus,
*:active {
  outline: none !important;
  // box-shadow: none !important;
}

input,
button,
select,
textarea input:focus,
button:focus,
select:focus,
textarea:focus input:active,
button:active,
select:active,
textarea:active {
  box-shadow: none !important;
}

a {
  color: black;
}

.border-primary {
  border: 1px solid $primary;
  border-color: $primary !important;
}

.btn-primary {
  background-color: $primary !important;
}

.text-primary {
  color: $primary !important;
}

.btn-outline-primary {
  width: 44%;
  margin: 3%;
  border-color: $primary;
  color: $primary;
  &:hover,
  &:active,
  &:focus {
    background-color: $primary !important;
    border-color: $primary !important;
    color: white !important;
  }
}

.animate {
  animation: glowing 1s ease-in-out 3;
}

.spinner-inner {
  background-color: $primary !important;
  transform: scale(1) !important;
}

@keyframes glowing {
  0% {
    text-shadow: 0 0 0;
  }
  50% {
    text-shadow: 0 0 5px;
  }
  100% {
    text-shadow: 0 0 0;
  }
}
</style>
