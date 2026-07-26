import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import colors from 'vuetify/util/colors'
//import { type ThemeDefinition } from 'vuetify'

const vuetify = createVuetify({
  components: {
    ...components,
  },
  directives,
  display: {
    mobileBreakpoint: 'sm',
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'lightTheme',
    themes: {
      lightTheme: {
        colors: {
          background: '#1a1a1a',
          error: colors.red.base,
          info: colors.blue.accent4,
          warning: colors.yellow.accent3,
          success: colors.green.accent3,
          surface: '#f7f5f0',
          primary: colors.grey.lighten2,
          secondary: colors.indigo.accent1,
          cards_text_color: colors.grey.lighten5,
          text_color: '#EDE7F6',
          default_btn_bc: colors.grey.darken4,
          icon_color: '#FFB627',

          nav: '#1a1a1a',

          characters_panel: '#fff',
        },
      },
      darkTheme: {
        colors: {
          background: '#1c1c1c',
          error: colors.red.lighten1,
          info: colors.blue.lighten1,
          warning: colors.yellow.darken2,
          success: colors.green.lighten2,
          surface: '#141414',
          primary: colors.grey.darken3,
          secondary: colors.indigo.darken3,
          text_color: '#EDE7F6',
          default_btn_bc: colors.grey.lighten5,
          icon_color: '#FFB627',

          home_titles: '#EDE7F6',

          nav: '#1c1c1c',

          characters_panel: '#242424',
        },
      },
    },
  },
})

export default vuetify
