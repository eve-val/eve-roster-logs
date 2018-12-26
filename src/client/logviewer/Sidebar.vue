<!--

Sidebar for the log viewer. Lists contents of the "current" folder. All
contents are clickable router links.

-->

<template>
<div class="_sidebar">
  <div>
    <router-link
        class="entry-link entry-dir"
        v-if="dirPath != null && dirPath != '.'"
        :to="`/logs/${dirPath}/../`"
        >
      ⇪ <span class="filename">(up)</span>
    </router-link>
  </div>
  <div v-for="(file, i) in files" :key="i">
    <router-link
        v-if="file.type != 'other'"
        class="entry-link"
        :class="{
          'entry-dir': file.type == 'directory',
          'entry-file': file.type == 'file',
          'selected': selectedFile != null && file.path == selectedFile.path,
        }"
        :to="`/logs/${file.path}`"
        >
      <template v-if="file.type == 'directory'">📁</template>
      <template v-else-if="file.type == 'file'">📄</template>
      <span class="filename">{{ file.name }}</span>
    </router-link>
    <div v-else class="entry-other">{{ file.name }}</div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ajax } from '../ajax';
import { DirEntryJson } from '../../shared/routes/DirEntryJson';

export default Vue.extend({
  props: {
    selectedFile: { type: Object as () => DirEntryJson | null },
  },

  data() {
    return {
      files: [] as DirEntryJson[],
    }
  },

  created() {
    this.fetchData();
  },

  watch: {
    dirPath() {
      this.fetchData();
    },
  },

  computed: {
    dirPath(): string | null {
      if (this.selectedFile == null) {
        return null;
      } else {
        return this.selectedFile.type == 'directory'
            ? this.selectedFile.path : this.selectedFile.dirname;
      }
    },
  },

  methods: {
    fetchData() {
      this.files = [];
      if (this.dirPath == null) {
        return;
      }
      ajax().get<DirEntryJson[]>(`/api/path/${this.dirPath}`)
      .then(response => {
        this.files = response.data;
      })
    },
  },
});
</script>

<style scoped>
._sidebar {
  overflow: scroll;
  border-right: 1px solid #DDD;
  padding-top: 3px;
}

.entry-link {
  color: black;
  display: block;
  padding: 3px 10px 3px 10px;
  text-decoration: none;
  white-space: nowrap;
}

.entry-dir:hover .filename {
  text-decoration: underline;
}

.selected {
  background: #cfddf5;
}
</style>
