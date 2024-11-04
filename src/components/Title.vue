<script setup lang="ts">
defineProps({
  message: { type: String },
  subtitle: { type: String },
  center: { type: Boolean }
})
</script>

<template>
  <div v-if="message" class="Title" :class="center ? 'Title--center' : ''">
    <h1>{{ message }}</h1>
    <p v-if="subtitle">{{ subtitle }}</p>
  </div>
</template>

<style>
.Title {
  color: #202122;
  margin-bottom: 26px;
}

.Title h1 {
  color: #202122;
  font-size: 24px;
  line-height: 1.25;
  padding: 0;
  margin: 0;
  font-weight: 700;
}

.Title--center {
  text-align: center;
}

.Title p {
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 16px;
  color: #606976;
  margin-top: 6px;
  margin-bottom: 15px;
}
</style>
