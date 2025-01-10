<script setup lang="ts">
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'
import { useConfigStore } from '@/stores/config.js'

const { vendorLogoPath, vendorName } = storeToRefs(useConfigStore())

// TODO:  https://www.npmjs.com/package/vue-markdown-render ?
</script>

<template>
  <div class="Home__Wrapper">
    <div class="Home--left">
      <Title message="Wat doen we?" />

      <p class="BodyText BodyText--bold" style="margin-bottom: 26px">
        <span
          >Stichting Kennis Centrum Aanpak Funderingsproblematiek (KCAF) is een stichting met als
          doelstelling het verzamelen, ontwikkelen en ontsluiten van kennis rond de aanpak en
          preventie van funderingsproblemen.</span
        >
      </p>
      <p class="BodyText" style="margin-bottom: 26px">
        <span
          >KCAF fungeert als nationaal funderingsloket voor alle vragen rond deze problematiek. Van
          funderingsonderzoek tot funderingsherstel, van aanpak tot financiering en van preventie
          tot innovatie. KCAF is een stichting zonder winstoogmerk.</span
        >
      </p>
      <p class="BodyText" style="margin-bottom: 26px">
        <span>
          Bij dit loket kunt u een melding maken van een funderingsprobleem aan uw woning. Wij
          zullen u vrijblijvend van advies voorzien. Dit loket is een initiatief van KCAF (Kennis
          Centrum Aanpak Funderingsproblematiek){{ vendorName ? ` en ${vendorName}` : '' }}.
        </span>
      </p>
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

.BodyText {
  color: #606976;
  font-size: 18px;
  line-height: 26px;
  margin: 0;
  padding: 0;

  max-width: 550px;
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
