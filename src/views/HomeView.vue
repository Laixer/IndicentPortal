<script setup lang="ts">
import { storeToRefs } from 'pinia'

import VueMarkdown from 'vue-markdown-render'

import Title from '@/components/Title.vue'
import { useConfigStore } from '@/stores/config.js'

const { vendorLogoPath, vendorName, introText } = storeToRefs(useConfigStore())
</script>

<template>
  <div class="Home__Wrapper">
    <div class="Home--left">
      <Title :message="`Funderingsloket ${vendorName}`" />

      <VueMarkdown class="Home__Intro" :source="introText" :options="{ breaks: true }" />
    </div>

    <div class="Home--right">
      <img :src="vendorLogoPath" width="640" height="585" alt="Logo" />
    </div>
  </div>
</template>

<style>
.Home__Wrapper {
  padding: 20px 20px;

  display: flex;
  max-width: 100%;
  justify-content: space-between;
  flex-direction: column;
}

@media only screen and (min-width: 900px) {
  .Home__Wrapper {
    padding: 50px 80px;
    flex-direction: row;
  }

  .Home__Wrapper--right {
    display: none;
  }
}

.Home--left .Title,
.BodyText {
  margin-bottom: 26px;
}

.Home--left .Button {
  margin-top: 12px;
}

.Home--right {
  display: none;
  margin: 40px 0;
  max-width: 100%;
  max-height: 580px;
}

@media only screen and (min-width: 640px) {
  .Home--right {
    max-width: 640px;
    display: none;
  }
}

@media only screen and (min-width: 900px) {
  .Home--right {
    display: block;
    margin: 0;
    max-width: calc(100% - 610px);
  }
}

.Home--right img {
  border-radius: 5px;
  display: block;
  /* object-fit: contain; */
  width: 100%;
  height: auto;
}

#navigateBodyButton {
  display: none;
}

@media only screen and (min-width: 900px) {
  /* #navigateBodyButton {
        display: inline-flex;
    } */
}

#navigateFooterButton {
  display: inline-flex;

  /* @media only screen and (min-width: $BREAKPOINT) { */
  display: none;
  /* } */
}

/* Align Copyright to the start */
.Footer {
  justify-content: center;

  /* .Copyright {
        display: none;
    } */

  /* @media only screen and (min-width: $BREAKPOINT) { */
  justify-content: start;
}

.Footer .Copyright {
  display: none;
}

.BodyText,
.Home__Intro p {
  color: #606976;
  font-size: 18px;
  line-height: 26px;
  margin: 0;
  padding: 0;

  max-width: 550px;
}
.Home__Intro p {
  margin-bottom: 26px;
}

.BodyText--center {
  text-align: center;
}

.BodyText--bold {
  font-weight: bold;
}

.BodyText--italic {
  font-style: italic;
}
</style>
