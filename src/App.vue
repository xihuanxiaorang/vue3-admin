<template>
  <RouterLink to="/home">首页</RouterLink>
  |
  <RouterLink to="/about">关于</RouterLink>

  <div>
    <RouterView />
  </div>

  <button @click="decrement">-1</button>
  {{ count }}
  <button @click="increment">+1</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore } from './stores/counter'

const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)
const { increment, decrement } = counterStore
</script>
