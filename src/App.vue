<template>
  <router-link to="/home">首页</router-link>
  |
  <router-link to="/about">关于</router-link>

  <div>
    <router-view></router-view>
  </div>

  <el-button-group>
    <el-button type="danger" size="small" @click="decrement">-1</el-button>
    <el-button type="primary" size="small" @click="increment">+1</el-button>
  </el-button-group>
  {{ count }}
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore } from './stores/counter'

const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)
const { increment, decrement } = counterStore
</script>
