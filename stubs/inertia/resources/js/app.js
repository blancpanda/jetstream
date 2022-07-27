import '../css/app.css'
import './bootstrap'

import { createInertiaApp } from '@inertiajs/inertia-vue3'
import { InertiaProgress } from '@inertiajs/progress'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createApp, h } from 'vue'
import { createI18n } from 'vue-i18n'
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m'

const appName =
  window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel'

async function loadLocaleMassages() {
  var messages = {}
  const resources = import.meta.glob('LANG_PATH*.json', { as: 'raw' })
  for (const path in resources) {
    const raw = await resources[path]()
    const lang = path.match(/([^/]+)\.json$/)[1]
    var langMsg = JSON.parse(raw)
    Object.entries(langMsg).forEach(([key, value]) => {
      langMsg[key] = String(value).replace(/:(\w+)/g, '{$1}')
    })
    messages[lang] = langMsg
  }
  return messages
}

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.vue`,
      import.meta.glob('./Pages/**/*.vue'),
    ),
  async setup({ el, app, props, plugin }) {
    const i18n = createI18n({
      legacy: false,
      globalInjection: true,
      locale: __locale,
      fallbackLocale: __fallback_locale,
      messages: await loadLocaleMassages(),
    })

    return createApp({ render: () => h(app, props) })
      .use(plugin)
      .use(ZiggyVue, Ziggy)
      .use(i18n)
      .mount(el)
  },
})

InertiaProgress.init({ color: '#4B5563' })
