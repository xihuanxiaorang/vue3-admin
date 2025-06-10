<template>
  <div class="h-full w-full">
    <RouterView>
      <template #default="{ Component, route }">
        <KeepAlive :include="tagsViewStore.cachedViews">
          <component :is="Component" :key="route.path" />
        </KeepAlive>
      </template>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { useTagsViewStore } from '@/stores'

const tagsViewStore = useTagsViewStore()
</script>
