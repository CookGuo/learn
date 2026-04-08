<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AccessGuard from './components/AccessGuard.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #doc-before>
      <AccessGuard>
        <slot />
      </AccessGuard>
    </template>
    
    <template #home-hero-info>
      <slot name="home-hero-info" />
    </template>
    
    <template #home-hero-actions>
      <slot name="home-hero-actions" />
    </template>
    
    <template #home-hero-image>
      <slot name="home-hero-image" />
    </template>
    
    <template #home-features>
      <slot name="home-features" />
    </template>
  </Layout>
</template>
