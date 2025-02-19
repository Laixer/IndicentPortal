<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'

import SvgIconSelected from '@/components/icons/SvgIconSelected.vue'
import SvgIconVrijstaandVrijstaand from '@/components/icons/SvgIconVrijstaandVrijstaand.vue'
import SvgIconVrijstaandBouwblok from '@/components/icons/SvgIconVrijstaandBouwblok.vue'
import SvgIconEigendomEigenaar from '@/components/icons/SvgIconEigendomEigenaar.vue'
import SvgIconEigendomHuurder from '@/components/icons/SvgIconEigendomHuurder.vue'
import SvgIconBurenJa from '@/components/icons/SvgIconBurenJa.vue'
import BurenNee from '@/components/icons/BurenNee.vue'

import { useSurveyStore } from '@/stores/survey.js'
import { useNavigationStore } from '@/stores/navigation.js'

const { disableNextButton, enableNextButton } = useNavigationStore()
const { Model } = storeToRefs(useSurveyStore())

watch(
  () => Model.value,
  () => {
    if (
      Model.value.chained_building === null ||
      Model.value.owner === null ||
      Model.value.neighbor_recovery === null
    ) {
      disableNextButton()
    } else {
      enableNextButton()
    }
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="AddressCharacteristics">
    <form class="Form" @submit.prevent="void">
      <div class="AddressCharacteristics--one">
        <Title
          message="Is het een vrijstaand pand of onderdeel van een (bouw)blok?"
          :center="true"
        />

        <div class="RadioImageInput">
          <div class="RadioImageInput__Wrapper">
            <div class="RadioImageInput__Field">
              <input
                type="radio"
                id="vrijstaand 0"
                v-model="Model.chained_building"
                name="vrijstaand"
                :value="false"
              />
              <label for="vrijstaand 0" class="RadioImageInput__Label">
                <div class="SvgIcon svg-container">
                  <SvgIconVrijstaandVrijstaand />
                </div>
                <div class="SvgIcon svg-container SvgIcon--selected">
                  <SvgIconSelected />
                </div>
                <span>Vrijstaand</span>
              </label>
            </div>
            <div class="RadioImageInput__Field">
              <input
                type="radio"
                id="vrijstaand 1"
                v-model="Model.chained_building"
                name="vrijstaand"
                :value="true"
              />
              <label for="vrijstaand 1" class="RadioImageInput__Label">
                <div class="SvgIcon svg-container">
                  <SvgIconVrijstaandBouwblok />
                </div>
                <div class="SvgIcon svg-container SvgIcon--selected">
                  <SvgIconSelected />
                </div>
                <span>(Bouw)blok</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="AddressCharacteristics--two">
        <Title message="Bent u eigenaar of huurder van de woning?" :center="true" />

        <div class="RadioImageInput">
          <div class="RadioImageInput__Wrapper">
            <div class="RadioImageInput__Field">
              <input
                type="radio"
                id="eigendom 0"
                v-model="Model.owner"
                name="eigendom"
                :value="true"
              />
              <label for="eigendom 0" class="RadioImageInput__Label">
                <div class="SvgIcon svg-container">
                  <SvgIconEigendomEigenaar />
                </div>
                <div class="SvgIcon svg-container SvgIcon--selected">
                  <SvgIconSelected />
                </div>
                <span>Eigenaar</span>
              </label>
            </div>
            <div class="RadioImageInput__Field">
              <input
                type="radio"
                id="eigendom 1"
                v-model="Model.owner"
                name="eigendom"
                :value="false"
              />
              <label for="eigendom 1" class="RadioImageInput__Label">
                <div class="SvgIcon svg-container">
                  <SvgIconEigendomHuurder />
                </div>
                <div class="SvgIcon svg-container SvgIcon--selected">
                  <SvgIconSelected />
                </div>
                <span>Huurder</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="AddressCharacteristics--three">
        <Title
          message="Is bij een van uw directe buren funderingsherstel uitgevoerd?"
          :center="true"
        />

        <div class="RadioImageInput">
          <div class="RadioImageInput__Wrapper">
            <div class="RadioImageInput__Field">
              <input
                type="radio"
                id="buren 0"
                v-model="Model.neighbor_recovery"
                name="buren"
                :value="true"
              />
              <label for="buren 0" class="RadioImageInput__Label">
                <div class="SvgIcon svg-container">
                  <SvgIconBurenJa />
                </div>
                <div class="SvgIcon svg-container SvgIcon--selected">
                  <SvgIconSelected />
                </div>
                <span>Ja</span>
              </label>
            </div>
            <div class="RadioImageInput__Field">
              <input
                type="radio"
                id="buren 1"
                v-model="Model.neighbor_recovery"
                name="buren"
                :value="false"
              />
              <label for="buren 1" class="RadioImageInput__Label">
                <div class="SvgIcon svg-container">
                  <BurenNee />
                </div>
                <div class="SvgIcon svg-container SvgIcon--selected">
                  <SvgIconSelected />
                </div>
                <span>Nee</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style>
.AddressCharacteristics {
  padding: 20px 20px;
}

@media only screen and (min-width: 900px) {
  .AddressCharacteristics {
    padding: 50px 80px;
  }
}

.AddressCharacteristics .Title {
  margin-bottom: 21px;
}

.AddressCharacteristics .Form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

@media only screen and (min-width: 1115px) {
  .AddressCharacteristics .Form {
    flex-direction: row;
  }
}

.AddressCharacteristics--one,
.AddressCharacteristics--two {
  padding-bottom: 44px;
  border-bottom: 1px solid #d4daf0;
}

.AddressCharacteristics--two,
.AddressCharacteristics--three {
  padding-top: 25px;
}

.AddressCharacteristics--three {
  padding-bottom: 24px;
}

/* More than regular breakpoint, because the items won't fit otherwise */
@media only screen and (min-width: 1115px) {
  .AddressCharacteristics--one {
    width: 430px;
    padding: 0 50px 31px 0;
  }

  .AddressCharacteristics--two {
    width: 430px;
    padding: 0 0 31px 50px;
    border-left: 1px solid #d4daf0;
  }

  .AddressCharacteristics--three {
    padding-bottom: 0;
  }
}
</style>
