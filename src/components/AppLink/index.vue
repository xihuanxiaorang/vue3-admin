<template>
  <component :is="linkType" v-bind="linkProps">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { isExternal } from '@/utils/validate'

defineOptions({
  inheritAttrs: false,
})

const { to } = defineProps<{
  to: string
}>()

const isExternalLink = computed(() => isExternal(to))

const linkType = computed(() => (isExternalLink.value ? 'a' : 'router-link'))

const linkProps = computed(() => {
  return isExternalLink.value ? { href: to, target: '_blank', rel: 'noopener noreferrer' } : { to }
})
</script>
