<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { modules } from '../../modules.config'

const route = useRoute()

const currentModule = computed(() => {
  const seg = route.path.split('/')[1]
  return modules.find(m => m.id === seg)
})

const hasAccess = computed(() => {
  const mod = currentModule.value
  if (!mod) return true
  if (!mod.enabled) return false
  if (mod.access === 'public') return true
  // token 模式预留：检查 localStorage
  // const token = localStorage.getItem(`access_${mod.id}`)
  // return !!token
  return true
})

const moduleName = computed(() => {
  return currentModule.value?.title || '该模块'
})
</script>

<template>
  <div v-if="!hasAccess" class="access-denied">
    <div class="access-denied-content">
      <div class="lock-icon">🔒</div>
      <h2>暂无访问权限</h2>
      <p>该模块尚未开放，请联系管理员获取访问码</p>
      <div class="module-info">
        <span class="module-tag">{{ moduleName }}</span>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.access-denied {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

.access-denied-content {
  text-align: center;
  max-width: 400px;
}

.lock-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.access-denied h2 {
  font-size: 1.5rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.access-denied p {
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

.module-info {
  margin-top: 1rem;
}

.module-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-radius: 1rem;
  font-size: 0.875rem;
}
</style>
