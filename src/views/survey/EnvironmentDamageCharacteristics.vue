<script setup lang="ts">
import { watch, ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'

import SvgIconCheck from '@/components/icons/SvgIconCheck.vue'

import { EnvironmentDamageCharacteristics } from '@/enums.js'
import { useSurveyStore } from '@/stores/survey.js'
import type { ILocalCheckboxGroupModel } from '@/interfaces.js'

const { Model } = storeToRefs(useSurveyStore())

const options = [
  {
    id: EnvironmentDamageCharacteristics.Subsidence,
    label: 'Er is sprake van bodemdaling tuin/erf'
  },
  {
    id: EnvironmentDamageCharacteristics.FoundationDamageNearby,
    label: 'Andere panden in de buurt met funderingsproblemen'
  },
  {
    id: EnvironmentDamageCharacteristics.SaggingSewerConnection,
    label: 'Verzakkende rioolaansluitingen'
  },
  {
    id: EnvironmentDamageCharacteristics.IncreasingTraffic,
    label: 'Toenemende verkeersdrukte in de straat'
  },
  {
    id: EnvironmentDamageCharacteristics.SaggingCablesPipes,
    label: 'Verzakkende kabels en leidingen'
  },
  {
    id: EnvironmentDamageCharacteristics.Elevation,
    label: 'De straat is onlangs opgehoogd'
  },
  {
    id: EnvironmentDamageCharacteristics.Flooding,
    label: 'Wateroverlast (water op straat)'
  },
  {
    id: EnvironmentDamageCharacteristics.ConstructionNearby,
    label: 'Er zijn bouwactiviteiten in de omgeving gaande (geweest)'
  },
  {
    id: EnvironmentDamageCharacteristics.LowGroundWater,
    label: 'Water onderlast (droge bodem)'
  },
  {
    id: EnvironmentDamageCharacteristics.VegetationNearby,
    label: 'Er staan grote bomen dicht bij (minder dan 10m) mijn woning'
  },
  {
    id: EnvironmentDamageCharacteristics.SewageLeakage,
    label: 'Lekke riolering'
  }
]

/**
 * We split the checkbox group into separate checkboxes and track them with a local model
 */
const LocalModel: Ref<ILocalCheckboxGroupModel> = ref(
  options.reduce((acc: ILocalCheckboxGroupModel, option) => {
    acc[option.id] = Model.value.environment_damage_characteristics.includes(option.id)
      ? 'yes'
      : 'no'
    return acc
  }, {})
)
watch(
  LocalModel,
  () => {
    Model.value.environment_damage_characteristics = Object.keys(LocalModel.value).filter(
      (id: string) => LocalModel.value[id] === 'yes'
    )
  },
  { deep: true }
)
</script>

<template>
  <div class="EnvironmentDamageCharacteristics">
    <Title
      message="Herkent u minstens één van de volgende punten in de omgeving van de woning?"
      subtitle="Meerdere opties mogelijk"
      :center="true"
    />

    <form class="Form" @submit.prevent="void">
      <div class="CheckboxInput">
        <div class="CheckboxInput__Wrapper">
          <div v-for="option in options" :key="option.id" class="CheckboxInput__Field">
            <input
              type="checkbox"
              :id="`option_${option.id}`"
              :name="`checkbox_${option.id}`"
              v-model="LocalModel[option.id]"
              true-value="yes"
              false-value="no"
            />

            <label :for="`option_${option.id}`" class="CheckboxInput__Label">
              <span class="CheckboxInput__Checkbox">
                <div class="SvgIcon svg-container">
                  <SvgIconCheck />
                </div>
              </span>
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style>
.EnvironmentDamageCharacteristics {
  padding: 20px 20px;
}

@media only screen and (min-width: 900px) {
  .EnvironmentDamageCharacteristics {
    padding: 50px 80px;
  }
}

.EnvironmentDamageCharacteristics .Title {
  margin-bottom: 21px;
}
</style>
