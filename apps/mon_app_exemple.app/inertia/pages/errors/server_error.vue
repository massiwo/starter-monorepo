<script lang="ts" setup>
defineProps<{ error: any }>()
</script>

<template>
  <div class="container">
    <div class="title">Server Error</div>

    <span>{{ error.message }}</span>
  </div>
</template>
