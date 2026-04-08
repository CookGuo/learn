import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import ModuleCard from './components/ModuleCard.vue'
import AccessGuard from './components/AccessGuard.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app }) {
    app.component('ModuleCard', ModuleCard)
    app.component('AccessGuard', AccessGuard)
  }
} satisfies Theme
