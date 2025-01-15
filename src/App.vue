<script setup lang="ts">
import { RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'

import Footer from '@/components/Footer.vue'
import { useConfigStore } from '@/stores/config.js'
import { useNavigationStore } from '@/stores/navigation.js'

// TODO: Proper loading state indicator
// TODO: Errors (fundermaps api unresponsive, unknown error, unknown vendor, incomplete vendor, save failed)

const { vendorLogoPath, loading, loadingError } = storeToRefs(useConfigStore())
const { isProgressVisible, surveyNavigationState } = storeToRefs(useNavigationStore())
</script>

<template>
  <div id="app">
    <div class="Page">
      <header class="Header">
        <div class="Header__Group">
          <Transition>
            <div v-if="loadingError">
              <h2>Het laden van de vragenlijst is mislukt</h2>
            </div>
            <h2 v-else-if="loading" class="Header__Loading">Bezit met laden...</h2>
            <img v-else-if="vendorLogoPath" class="Header__Logo" :src="vendorLogoPath" alt="Logo" />
          </Transition>
        </div>
      </header>

      <div class="Page__Wrapper">
        <aside v-if="isProgressVisible" class="ProgressSteps">
          <div class="ProgressSteps__Indicator" style="top: 178px"></div>
          <ul>
            <li
              v-for="navState in surveyNavigationState"
              :class="{
                ProgressSteps__Current: navState.current,
                ProgressSteps__Finished: navState.finished,
                ProgressSteps__Future: navState.future
              }"
            >
              <span>{{ navState.number }}</span>
            </li>
          </ul>
        </aside>

        <div class="Page__Main" :class="isProgressVisible ? 'Page__Main--sidebar' : ''">
          <div v-if="loadingError" class="Page__Content">
            <div class="Profile__Wrapper">
              <p>
                Mogelijk is de vragenlijst niet langer beschikbaar.
                <br />
                <br />
                Neem voor meer informatie contact op met de partij die u naar de vragenlijst heeft
                doorverwezen.
              </p>
            </div>
          </div>
          <div v-else-if="!loading" class="Page__Content">
            <RouterView />
          </div>
        </div>
      </div>
    </div>

    <Transition>
      <Footer v-if="!loading" />
    </Transition>
  </div>
</template>

<style>
#app {
  font-family: system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: var(--fm-primary-color, #2657ff);
  background: white;
  border-radius: 4px;

  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;

  /*Solves a problem in which the content is being cut when the div is smaller than its' wrapper:*/
  max-width: 100%;
  max-height: 100%;
  overflow: auto;

  display: flex;
  flex-direction: column;
}

@media only screen and (min-width: 900px) {
  #app {
    width: 1440px;
    height: 910px;
  }
}

.Page {
  overflow: hidden;
  display: flex;
  flex-grow: 2;
  flex-direction: column;
}

.Page__Wrapper {
  margin-top: 80px;
  margin-bottom: 60px;

  display: flex;
  flex-grow: 2;
  align-items: stretch;
  flex-direction: column;
}

@media only screen and (min-width: 900px) {
  .Page__Wrapper {
    margin: 0;
    flex-direction: row;
  }
}

.Page__Main,
.Page__Content {
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.Page__Main--sidebar {
  border-left: 1px solid #d4daf0;
}

@media only screen and (min-width: 900px) {
  .Page__Main--sidebar {
    max-width: calc(100% - 80px);
  }
}

.Page__Content {
  background: #fbfcff;
}

@media only screen and (max-width: 900px) {
  .Page .ProgressSteps {
    display: none;
  }
}

.Profile__Wrapper {
  padding: 20px 20px;
  color: black;
  width: 100%;
  margin: 0 auto;
}

@media only screen and (min-width: 900px) {
  .Profile__Wrapper {
    padding: 20px 80px;
  }
}

.Footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 60px;
  width: 100%;
  border-top: 1px solid #d4daf0;
  padding: 0 20px;
  display: flex;
  background: white;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

@media only screen and (min-width: 900px) {
  .Footer {
    position: sticky;
    height: 115px;
    padding: 0 80px;
  }
}

.Header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  transition: all 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  height: 80px;
  width: 100%;
  border-bottom: 1px solid #d4daf0;
  background: white;
  z-index: 999999;
  color: #606976;

  align-items: center;
  user-select: none;
}

.Header__Group {
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  align-items: center;
  height: 64px;
}

@media only screen and (min-width: 900px) {
  .Header__Group {
    height: 80px;
    margin: auto 80px;
  }
}

.Header__Group a {
  display: flex;
  align-items: center;
  color: #606976;
}

.Header__Logo {
  margin: auto;
  max-height: 80px;
  max-height: 64px;
}

@media only screen and (min-width: 900px) {
  .Header__Logo {
    max-height: 80px;
  }
}

.Header a {
  margin: auto;
}

@media only screen and (min-width: 900px) {
  .Header {
    position: sticky;
    top: 0;
    height: 115px;
  }
}

@media only screen and (min-width: 900px) {
  .Header .ProgressBar {
    display: none;
  }
}
</style>
