<template>
  <div class="app-wrapper">
    <div class="sidebar-container">侧边导航栏</div>
    <div class="main-wrapper">
      <div class="header-container">
        <div class="navbar">头部导航栏</div>
        <div class="tags-view">标签栏</div>
      </div>
      <div class="content-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  @apply flex w-screen h-screen;
  .sidebar-container {
    @apply w-[var(--sidebar-width)] bg-red;
  }
  .main-wrapper {
    @apply flex flex-col flex-1;
    .header-container {
      .navbar {
        @apply h-[var(--navbar-height)] bg-yellow;
      }
      .tags-view {
        @apply h-[var(--tags-view-height)] bg-blue;
      }
    }
    .content-container {
      @apply h-[calc(100vh-var(--navbar-height)-var(--tags-view-height))] bg-gray-100 p-2;
    }
  }
}
</style>
