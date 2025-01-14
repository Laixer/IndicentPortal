<script setup lang="ts">
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'

import SvgIconCornerSelected from '@/components/icons/SvgIconCornerSelected.vue'
import SvgIconTypeHout from '@/components/icons/SvgIconTypeHout.vue'
import SvgIconTypeStaal from '@/components/icons/SvgIconTypeStaal.vue'
import SvgIconTypeBeton from '@/components/icons/SvgIconTypeBeton.vue'
import SvgIconTypeOnbekend from '@/components/icons/SvgIconTypeOnbekend.vue'

import { FoundationType } from '@/enums.js'
import { useSurveyStore } from '@/stores/survey.js'

const { Model } = storeToRefs(useSurveyStore())

const options = [
  {
    id: FoundationType.Wood,
    label: 'Houten palen',
    svg: SvgIconTypeHout
  },
  {
    id: FoundationType.NoPile,
    label: 'Ondiep op staal',
    svg: SvgIconTypeStaal
  },
  {
    id: FoundationType.Concrete,
    label: 'Betonnen palen',
    svg: SvgIconTypeBeton
  },
  {
    id: FoundationType.Other,
    label: 'Weet ik niet',
    svg: SvgIconTypeOnbekend
  }
]
</script>

<template>
  <div class="FoundationType">
    <Title message="Op welke type fundering is de woning gebouwd?" :center="true" />

    <div class="RadioImageInput">
      <div class="RadioImageInput__Wrapper">
        <div v-for="option in options" :key="option.id" class="RadioImageInput__Field">
          <input
            type="radio"
            :id="`option_${option.id}`"
            v-model="Model.foundation_type"
            name="type"
            :value="option.id"
          />
          <label :for="`option_${option.id}`" class="RadioImageInput__Label">
            <div class="SvgIcon svg-container">
              <component :is="option.svg" />
            </div>
            <div class="SvgIcon svg-container SvgIcon--selected">
              <SvgIconCornerSelected />
            </div>
            <span>{{ option.label }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.FoundationType {
  padding: 20px 20px;
}

@media only screen and (min-width: 900px) {
  .FoundationType {
    padding: 50px 80px;
  }
}

.Title {
  margin-bottom: 21px;
}

.RadioImageInput__Wrapper {
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}

.RadioImageInput__Field {
  margin: 10px 10px 10px 10px;
}
</style>
