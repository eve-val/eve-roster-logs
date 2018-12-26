<!--

Root component for the log viewer. Contains a sidebar and a viewing area.

-->

<template>
<div class="_log-viewer">
  <div class="container">
    <sidebar
        class="sidebar"
        :selectedFile="selectedFile"
        >
    </sidebar>
    <main-content
        class="main-content"
        :selectedFile="selectedFile"
        >
    </main-content>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import MainContent from './MainContent.vue';
import Sidebar from './Sidebar.vue';
import { DirEntryJson } from '../../shared/routes/DirEntryJson';
import { ajax } from '../ajax';

export default Vue.extend({
  components: {
    MainContent,
    Sidebar,
  },

  data() {
    return {
      selectedFile: null as DirEntryJson | null,
    };
  },

  created() {
    this.update();
  },

  watch: {
    '$route' (to, from) {
      this.update();
    },
  },

  methods: {
    update() {
      const path = this.$route.params.path;
      ajax().get<DirEntryJson>(`/api/stat/${path || ''}`)
      .then(response => {
        this.selectedFile = response.data;
      });
    }
  },

  computed: {
  },
})
</script>

<style scoped>
._log-viewer {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.sidebar {
  width: 290px;
}

.main-content {
  flex: 1;
}
</style>
