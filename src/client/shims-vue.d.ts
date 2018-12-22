/**
 * This is a hack to tell the TS compiler that .vue files eventually end up
 * as JS files (kind of) and thus can be `include`d by each other and by
 * normal TS files.
 *
 * See https://github.com/vuejs/vue/issues/5298#issuecomment-289641843
 *
 * A more nuanced way to deal with this is with vuetype, which generates
 * .d.ts files for each Vue component: https://github.com/ktsn/vuetype.
 */

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
