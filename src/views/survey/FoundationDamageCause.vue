<script setup lang="ts">
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'

import { FoundationDamageCause } from '@/enums.js'
import { useSurveyStore } from '@/stores/survey.js'

const { Model } = storeToRefs(useSurveyStore())

const options = [
  {
    id: FoundationDamageCause.ConstructionFlaw,
    label: 'Verkeerd gefundeerd bij de bouw'
  },
  {
    id: FoundationDamageCause.Vegetation,
    label: 'Beschadiging van de fundering door (planten)wortels'
  },
  {
    id: FoundationDamageCause.BioFungusInfection,
    label: 'Aantasting van houten palen door schimmels/bacterieën'
  },
  {
    id: FoundationDamageCause.Gas,
    label: 'Gaswinning of mijnbouw'
  },
  {
    id: FoundationDamageCause.ConstructionHeave,
    label: 'De funderingspalen drukken de woning omhoog'
  },
  {
    id: FoundationDamageCause.Vibrations,
    label: 'Verkeer nabij de woning'
  },
  {
    id: FoundationDamageCause.NegativeCling,
    label: 'De funderingspalen worden naar beneden getrokken'
  },
  {
    id: FoundationDamageCause.PartialFoundationRecovery,
    label: 'Funderingsherstel bij de buren'
  },
  {
    id: FoundationDamageCause.Subsidence,
    label: 'Bodemdaling'
  },
  {
    id: FoundationDamageCause.FoundationFlaw,
    label: 'Fundering niet meer berekend op het huidige gewicht'
  },
  {
    id: FoundationDamageCause.JapanseKnotweed,
    label: 'Japanse duizendknoop'
  },
  {
    id: FoundationDamageCause.GroundwaterLevelReduction,
    label: 'Grondwaterstandverlaging'
  }
]
</script>

<template>
  <div class="FoundationDamageCause">
    <Title message="Wat veroorzaakt de schade aan de woning?" :center="true" />

    <form class="Form" autocomplete="off" @submit.prevent="void">
      <div class="RadioTextInput">
        <div class="RadioTextInput__Wrapper">
          <div Name="type">
            <div v-for="option in options" class="RadioTextInput__Field">
              <input
                type="radio"
                name="cause"
                v-model="Model.FoundationDamageCause"
                :id="`option_${option.id}`"
                :value="option.id"
              />
              <label :for="`option_${option.id}`" class="RadioTextInput__Label">
                <span>{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style>
.FoundationDamageCause {
  padding: 20px 20px;
}

@media only screen and (min-width: 900px) {
  .FoundationDamageCause {
    padding: 25px 80px;
  }
}
</style>
