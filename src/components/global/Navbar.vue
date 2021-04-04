<template>
  <nav class="text-dark navbar navbar-expand-lg navbar-light bg-white p-0">
    <div class="container">
      <router-link :to="{ name: 'Home' }" class="navbar-brand mx-0">
        <img
          src="@/assets/haram_logo.png"
          class="py-2"
          alt="Image not found"
          width="80"
        />
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse justify-content-end"
        id="navbarSupportedContent"
      >
        <ul class="navbar-nav m-auto p-0">
          <li class="nav-item my-nav-item">
            <router-link
              :to="{ name: 'Home' }"
              class="nav-link mx-1 px-3"
              :class="{ 'text-muted': !this.auth, 'text-dark': this.auth }"
            >
              {{ $t("nav.home") }}
            </router-link>
          </li>

          <li class="nav-item my-nav-item">
            <router-link
              :to="{ name: 'Booking List' }"
              class="nav-link mx-1 px-3"
              :class="{ 'text-muted': !this.auth, 'text-dark': this.auth }"
            >
              {{ $t("nav.list") }}
            </router-link>
          </li>

          <li class="nav-item my-nav-item">
            <router-link
              :to="{ name: 'AboutUs' }"
              class="nav-link mx-1 px-3 text-dark"
            >
              {{ $t("nav.about") }}
            </router-link>
          </li>

          <li class="nav-item my-nav-item">
            <router-link
              :to="{ name: 'Contact' }"
              class="nav-link mx-1 px-3 text-dark"
            >
              {{ $t("nav.contact") }}
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item dropdown clickable bg-light">
            <a
              class="nav-link text-big text-dark"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="fas fa-language"></i>
            </a>
            <div
              class="dropdown-menu"
              :class="{ 'text-right': $i18n.locale == 'ar' }"
              aria-labelledby="navbarDropdown"
            >
              <a @click="setLocale('en')" class="dropdown-item">English</a>

              <a @click="setLocale('ar')" class="dropdown-item ar-font">
                العربية
              </a>
            </div>
          </li>

          <li class="nav-item dropdown clickable bg-light">
            <a
              class="nav-link text-big text-dark"
              id="userDropDown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="fas fa-user-circle"></i>
            </a>
            <div
              class="dropdown-menu"
              :class="{ 'text-right': $i18n.locale == 'ar' }"
              v-if="auth"
              aria-labelledby="userDropDown"
            >
              <div class="drop-down-item text-muted px-2">
                {{ name }}
              </div>
              <div class="dropdown-divider"></div>
              <div @click="logout" class="drop-down-item px-2">
                {{ $t("nav.logout") }}
              </div>
            </div>
            <div
              class="dropdown-menu text-sm"
              :class="{ 'text-right': $i18n.locale == 'ar' }"
              v-else
              aria-labelledby="userDropDown"
            >
              <router-link
                :to="{ name: 'Identity' }"
                class="drop-down-item px-1"
              >
                {{ $t("nav.login") }}
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import i18n from "@/i18n";

export default {
  name: "Navbar",
  data() {
    return {
      auth: false,
      name: ""
    };
  },

  mounted: function() {
    this.auth = localStorage.getItem("user_token") ? true : false;
    this.name = localStorage.getItem("user_fullName");
  },

  methods: {
    logout() {
      localStorage.removeItem("user_token");
      localStorage.removeItem("userInfo");
      this.auth = false;
      this.$router.push({ name: "Identity" });
    },

    setLocale(newLocale) {
      i18n.locale = newLocale;
      localStorage.setItem("locale", newLocale);
      if (window.vm.home) {
        window.vm.home.reloadDetails();
      }
      if (window.vm.bookingList) {
        window.vm.bookingList.reload();
      }

      this.$router.push({
        params: { lang: newLocale }
      });
    }
  }
};
</script>

<style scoped lang="scss">
$primary: #ec4315;

nav {
  z-index: 1;
}

.text-upper {
  text-transform: uppercase;
}

.text-sm {
  font-size: 0.8em;
}

.nav-link.router-link-exact-active {
  border-bottom: 2px solid $primary;
}

.logout > h5 {
  border-bottom: 2px solid $primary;
  margin: 13px 0px -10px 0px;
  padding: 0px 0px 10px 0px;
  font-size: 15px !important;
}

.logout:hover {
  cursor: pointer;
}

.nav-item {
  display: inline-block;
  font-weight: bold;
  height: 100%;
  color: black !important;
}

.text-big {
  font-size: 1.2em;
}

.clickable {
  cursor: pointer;
}

h1 {
  color: red($color: #000000);
}

.dropdown {
  margin: 10px;
}

.login {
  margin: 10px;
}
</style>
