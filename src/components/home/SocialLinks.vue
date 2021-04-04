<template>
  <div class="social-links text-dark" :class="classList">
    <Modal :message="error.message" :title="error.title" />
    <ul class="list-unstyled p-0">
      <li v-for="item in social" :key="item.id" class="d-inline mx-1">
        <a :href="item.url" target="_blank">
          <i>
            <img :src="item.icon.url" />
          </i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import API from "@/apis.js";
import Modal from "@/components/error/Modal";

export default {
  name: "SocialLinks",
  props: ["classList"],
  data() {
    return {
      error: {
        message: "error message",
        title: "error title"
      },
      social: []
    };
  },

  mounted: function() {
    this.getMediaUrls();
  },

  methods: {
    showAlert(message, title) {
      this.error.message = message;
      this.error.title = title;
      Modal.methods.toggle();
      return false;
    },
    getMediaUrls() {
      API.Settings(
        r => {
          this.social = r.data.data.mediaURLs;
        },
        e => {
          this.showAlert(e.response.data.errorMessage);
        }
      );
    }
  },

  components: { Modal }
};
</script>

<style lang="scss" scoped>
li {
  cursor: pointer;
  padding: 10px;
  width: 30px;
  height: 30px;
}
</style>
