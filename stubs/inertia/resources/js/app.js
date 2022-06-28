import './bootstrap'

import { createInertiaApp } from '@inertiajs/inertia-vue3'
import { InertiaProgress } from '@inertiajs/progress'
import { createApp, h } from 'vue'
import { createI18n } from 'vue-i18n'
import { ZiggyVue } from 'ziggy'

const appName =
  window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel'

async function loadAndConvertMessages(locale) {
  const messages = await import(`LANG_PATH${locale}.json`)
  var msgObj = {}
  Object.entries(messages).forEach(([key, value]) => {
    msgObj[key] = String(value).replace(/:([a-zA-Z_]+)/g, '{$1}')
  })
  return msgObj
}

async function loadLocaleMessages(i18n, locale) {
  const messages = await loadAndConvertMessages(locale)
  i18n.global.setLocaleMessage(locale, messages)
}

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => require(`./Pages/${name}.vue`),
  async setup({ el, app, props, plugin }) {
    const i18n = createI18n({
      legacy: false,
      globalInjection: true,
      locale: __locale,
      fallbackLocale: __fallback_locale,
    })

    await loadLocaleMessages(i18n, __locale)
    await loadLocaleMessages(i18n, __fallback_locale)

    return createApp({ render: () => h(app, props) })
      .use(plugin)
      .use(ZiggyVue, Ziggy)
      .use(i18n)
      .mixin({ methods: { route } })
      .mount(el)
  },
})

InertiaProgress.init({ color: '#4B5563' })
