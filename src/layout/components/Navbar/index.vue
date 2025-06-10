<template>
  <div class="w-full flex items-center justify-between">
    <div class="flex items-center gap-10">
      <Hamburger />
      <Breadcrumb />
    </div>
    <div class="flex items-center justify-center gap-4">
      <DarkModeSelect />
      <FullScreen />
      <SizeSelect />
      <LangSelect />
      <el-avatar v-loading="isLoading" :src="userInfo?.avatar">
        <IMdiUser class="text-size-lg" />
      </el-avatar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userApi } from '@/api'

const { isLoading, state: userInfo } = useAsyncState(userApi.getUserInfo, null)
</script>
