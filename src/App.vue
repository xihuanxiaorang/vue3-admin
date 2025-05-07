<template>
  <router-link to="/home">首页</router-link>
  |
  <router-link to="/about">关于</router-link>

  <div>
    <router-view></router-view>
  </div>

  <div>
    <el-button-group>
      <el-button size="small" type="danger" @click="decrement">-1</el-button>
      <el-button size="small" type="primary" @click="increment">+1</el-button>
    </el-button-group>
    {{ count }}
  </div>

  <div class="box mt-10 h-[100px] w-[100px] bg-red font-600" text="white sm">小橘猫</div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from './stores/counter'

const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)
const { increment, decrement } = counterStore
</script>

<style lang="scss" scoped>
.box {
  @apply flex items-center justify-center;
}
</style>
