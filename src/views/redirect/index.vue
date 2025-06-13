<template>
  <div></div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const { query, params } = route
const { path } = params

router.replace({ path: '/' + path, query })
</script>
