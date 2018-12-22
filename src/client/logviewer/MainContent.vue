<!--

Displays the contents of a selected log file.

If the contents of the file are a known log format, parses the individual
lines, colorizes them, and allows the user to filter by log level.

-->

<template>
<div class="_main-content">

  <div class="toolbar" v-if="isParsed">
    <label for="log-level-select">Max log level</label>
    <select id="log-level-select" class="level-select" v-model="maxLogLevel">
      <option :value="1">Error</option>
      <option :value="2">Warn</option>
      <option :value="3">Info</option>
      <option :value="4">Verbose</option>
      <option :value="5">Debug</option>
    </select>

    <input
        id="cb-show-raw"
        class="cb-show-raw"
        type="checkbox"
        v-model="showRaw"
        >
    <label for="cb-show-raw">Show raw</label>
  </div>

  <div class="scroller" ref="scroller">
      <div class="parsed-cnt" v-if="isParsed && !showRaw">
        <div
            class="parsed-line"
            v-for="(line, i) in parsedLines"
            v-if="line.level <= maxLogLevel"
            :key="i"
            :class="getLineClass(line)"
            >{{ line.rawLine }}</div>
      </div>
      <div class="raw-cnt" v-else-if="rawText != null">{{ rawText }}</div>
      <div v-else><!-- Show something here? --></div>
  </div>

</div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { DirEntryJson } from '../../shared/routes/DirEntryJson';

export default Vue.extend({
  props: {
    selectedFile: { type: Object as () => DirEntryJson | null },
  },

  data() {
    return {
      rawText: null as string | null,
      showRaw: false,
      maxLogLevel: 2,
      isNewFile: false,
    };
  },

  computed: {
    isParsed(): boolean {
      return this.rawText != null
          && ROSTER_LOG_FILE_FORMAT_DECLARATION.test(this.rawText);
    },

    parsedLines(): ParsedLine[] {
      if (this.rawText == null) {
        return [];
      }
      const lines = this.rawText.split('\n');
      const parsedLines = [];
      let parser: (line: string) => ParsedLine = parseLineUnknown;
      for (let line of lines) {
        const formatMatch = ROSTER_LOG_FILE_FORMAT_DECLARATION.exec(line);
        if (formatMatch) {
          parser = getParser(formatMatch[1]);
        } else {
          parsedLines.push(parser(line));
        }
      }
      return parsedLines;
    }
  },

  created() {
    this.fetchData();
  },

  updated() {
    if (this.isNewFile) {
      // Scroll to bottom of the content if is recognized log file; otherwise
      // scroll to top.
      this.isNewFile = false;
      this.$nextTick(() => {
        const scrollTop =
            this.isParsed ? (<Element>this.$refs.scroller).scrollHeight : 0;
        (<Element>this.$refs.scroller).scrollTop = scrollTop;
      });
    }
  },

  watch: {
    selectedFile() {
      this.fetchData();
    },
  },

  methods: {
    fetchData() {
      this.rawText = null;
      if (this.selectedFile == null) {
        return;
      }
      if (this.selectedFile.type != 'file') {
        return;
      }
      axios.get<string>(`/api/path/${this.selectedFile.path}`)
      .then(response => {
        this.rawText = response.data;
        this.isNewFile = true;
      });
    },

    getLineClass(line: ParsedLine) {
      return LOG_LEVEL_CLASSES[line.level];
    },
  },
});

const LOG_LEVELS = {
  unknown: 0,
  error: 1,
  warn: 2,
  info: 3,
  verbose: 4,
  debug: 5,
};

const LOG_LEVEL_CLASSES = {
  [LOG_LEVELS.unknown]: 'unknown',
  [LOG_LEVELS.error]: 'error',
  [LOG_LEVELS.warn]: 'warn',
  [LOG_LEVELS.info]: 'info',
  [LOG_LEVELS.verbose]: 'verbose',
  [LOG_LEVELS.debug]: 'debug',
}

function getParser(format: string) {
  switch (format) {
    case 'roster_log_file_0':
      return parseLineV0;
    default:
      return parseLineUnknown;
  }
}

function parseLineUnknown(line: string): ParsedLine {
  return {
    rawLine: line,
    level: LOG_LEVELS.info,
  };
}

function parseLineV0(line: string): ParsedLine {
  const match = LINE_V0_PATTERN.exec(line);
  if (!match) {
    return parseLineUnknown(line);
  } else {
    const level = LINE_V0_LEVEL_MAP[match[1]];
    return {
      rawLine: line,
      level: level != undefined ? level : LOG_LEVELS.error,
    };
  }
}
const LINE_V0_PATTERN = /[^ ]+ [^ ]+ ([UEWIVD]) /;
const LINE_V0_LEVEL_MAP = {
  U: LOG_LEVELS.unknown,
  E: LOG_LEVELS.error,
  W: LOG_LEVELS.warn,
  I: LOG_LEVELS.info,
  V: LOG_LEVELS.verbose,
  D: LOG_LEVELS.debug,
} as { [key: string]: number };

interface ParsedLine {
  rawLine: string,
  level: number,
}

const ROSTER_LOG_FILE_FORMAT_DECLARATION = /^@format:(.+)/;
</script>

<style scoped>
._main-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar {
  padding: 15px 10px;
  border-bottom: 1px solid #DDD;
}

.cb-show-raw {
  margin-left: 20px;
}

.scroller {
  flex: 1;
  overflow: scroll;
  padding: 10px;
  padding-bottom: 20px;
}

.raw-cnt {
  font-family: 'Courier New', Courier, monospace;
  white-space: pre-wrap;
  font-size: 14px;
}

.parsed-cnt {
  font-family: 'Courier New', Courier, monospace;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 14px;
}

.parsed-line.error {
  color: #b90606;
}

.parsed-line.warn {
  color: #cc7e00;
}

.level-select {
  margin-left: 4px;
  font-size: 14px;
}
</style>
