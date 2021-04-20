<template>
  <div class="_login">
    <div class="container">
      <div class="title">Roster Logs Viewer</div>
      <div class="login-prompt">
        <a :href="loginUrl">Log in</a>
      </div>
      <div v-if="message != undefined" class="message">{{ message }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ClientConfig } from "../shared/ClientConfig";

export default Vue.extend({
  props: {
    config: Object as () => ClientConfig,
  },

  computed: {
    loginUrl(): string {
      return (
        `https://login.eveonline.com/oauth/authorize?` +
        this.config.loginUrlParams
      );
    },

    message(): string | undefined {
      switch (this.$route.query["message"]) {
        case "not_authorized":
          return "Character not authorized for access";
        default:
          return undefined;
      }
    },
  },
});
</script>

<style scoped>
._login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container {
  width: 400px;
  padding: 20px;
  border: 1px solid #aaa;
}

.title {
  font-size: 16px;
  text-align: center;
}

.login-prompt {
  font-size: 20px;
  text-align: center;
  margin: 40px 0px;
}

.message {
  color: red;
}
</style>
