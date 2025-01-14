<script setup lang="ts">
import { watch, ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'
import SvgIconCheck from '@/components/icons/SvgIconCheck.vue'

import { FoundationDamageCharacteristics } from '@/enums.js'
import { useSurveyStore } from '@/stores/survey.js'
import type { ILocalCheckboxGroupModel } from '@/interfaces.js'

const { Model } = storeToRefs(useSurveyStore())

const options = [
  {
    id: FoundationDamageCharacteristics.JammingDoorWindow,
    label: 'Klemmende ramen en/of deuren'
  },
  {
    id: FoundationDamageCharacteristics.ThresholdAboveSubsurface,
    label: 'De woning ligt hoger dan trottoir/weg'
  },
  {
    id: FoundationDamageCharacteristics.Crack,
    label: 'Scheur(en) in de muur en/of gevel(s)'
  },
  {
    id: FoundationDamageCharacteristics.ThresholdBelowSubsurface,
    label: 'De woning ligt lager dan trottoir/weg'
  },
  {
    id: FoundationDamageCharacteristics.Skewed,
    label: 'De woning staat wat scheef'
  },
  {
    id: FoundationDamageCharacteristics.CrookedFloorWall,
    label: 'Scheve vloeren/muren in de woning'
  },
  {
    id: FoundationDamageCharacteristics.CrawlspaceFlooding,
    label: 'Hoog water in de kruipruimte'
  }
]

/**
 * We split the checkbox group into separate checkboxes and track them with a local model
 */
const LocalModel: Ref<ILocalCheckboxGroupModel> = ref(
  options.reduce((acc: ILocalCheckboxGroupModel, option) => {
    acc[option.id] = Model.value.foundation_damage_characteristics.includes(option.id)
      ? 'yes'
      : 'no'
    return acc
  }, {})
)
watch(
  LocalModel,
  () => {
    Model.value.foundation_damage_characteristics = Object.keys(LocalModel.value)
      .filter((id: string | number) => LocalModel.value[id] === 'yes')
      .map((id) => parseInt(id))
  },
  { deep: true }
)
</script>

<template>
  <div class="FoundationDamageCharacteristics">
    <Title
      message="Herkent u minstens één van de volgende punten aan de woning?"
      subtitle="Meerdere opties mogelijk"
      :center="true"
    />

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
  </div>
</template>

<style>
.FoundationDamageCharacteristics {
  padding: 20px 20px;
}

@media only screen and (min-width: 900px) {
  .FoundationDamageCharacteristics {
    padding: 25px 80px;
  }
}
</style>
