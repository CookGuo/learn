<script setup lang="ts">
import type { ModuleConfig } from '../modules.config'

interface Props {
  module: ModuleConfig
}

defineProps<Props>()
</script>

<template>
  <a 
    :href="`/${module.id}/`" 
    class="module-card"
    :class="{ 'disabled': !module.enabled }"
  >
    <div class="module-icon">{{ module.icon }}</div>
    <div class="module-content">
      <h3 class="module-title">
        {{ module.title }}
        <span v-if="!module.enabled" class="badge disabled-badge">未启用</span>
        <span v-else-if="module.access === 'token'" class="badge token-badge">需令牌</span>
      </h3>
      <p class="module-description">{{ module.description }}</p>
    </div>
    <div class="module-arrow" v-if="module.enabled">→</div>
  </a>
</template>

<style scoped>
.module-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.3s ease;
}

.module-card:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand);
}

.module-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.module-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.module-content {
  flex: 1;
}

.module-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.module-description {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

.module-arrow {
  font-size: 1.25rem;
  color: var(--vp-c-brand);
  transition: transform 0.2s ease;
}

.module-card:hover:not(.disabled) .module-arrow {
  transform: translateX(4px);
}

.badge {
  font-size: 0.65rem;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-weight: 500;
}

.disabled-badge {
  background: var(--vp-c-gray-3);
  color: var(--vp-c-gray-1);
}

.token-badge {
  background: var(--vp-c-yellow-soft);
  color: var(--vp-c-yellow-1);
}
</style>
