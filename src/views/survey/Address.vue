<script setup lang="ts">
import { onBeforeMount, ref, watch, type Ref } from 'vue' // useTemplateRef,
import { storeToRefs } from 'pinia'

import SuggestionIcon from '@/components/icons/SuggestionIcon.vue'

import { useSurveyStore } from '@/stores/survey'
import { useNavigationStore } from '@/stores/navigation'
import { getLookup, getSuggestions } from '@/services/pdok'
import api from '@/services/fundermaps/'
import Mapbox from '@/components/Mapbox.vue'
import { LngLat, Map } from 'mapbox-gl'

const { Model } = storeToRefs(useSurveyStore())
const { disableNextButton, enableNextButton } = useNavigationStore()

onBeforeMount(() => {
  // If either the address or building id are not filled in, disable the next button
  if (Model.value.building_id === '') {
    disableNextButton()
  }
})

/**
 * The Mapbox config
 */
const mapboxOptions = {
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [4.9041, 52.3676],
  zoom: 12.5
}

let mapboxInstance: Map | undefined = undefined

/**
 * The local address model
 */
const address = ref('')

/**
 * The latest suggestion. Used to compare to address, to avoid triggering the suggestions API call
 */
const suggestion = ref('')

/**
 * The list of auto complete suggestions from PDOK
 */
const autoCompleteSuggestions: Ref<{ Id: string; Suggestion: string }[]> = ref([])

/**
 * Update the local & central model upon selecting a suggestion
 */
const selectSuggestion = async function selectSuggestion(id: string) {
  let response = await getLookup(id)
  response = response?.response || null

  if (!response || !Array.isArray(response.docs) || response.docs.length === 0) {
    // TODO: Show error ?
    autoCompleteSuggestions.value = []
    return
  }

  // Select the first match
  const doc = response.docs[0]

  // Clear suggestions
  autoCompleteSuggestions.value = []

  // First update suggestion, then address. This order is expected by the address watcher
  suggestion.value = doc.weergavenaam
  address.value = doc.weergavenaam

  // Throw the reference through the Fundermaps Geocoder to get an standardized address & building reference
  const GeocoderResult = await api.building.getLocationInformationByBuildingId(
    doc.nummeraanduiding_id
  )

  Model.value.building_id = GeocoderResult.building_id

  // Set the coordinates, if the API response has this information
  // TODO: What to do if LngLat info is missing?
  if (mapboxInstance && GeocoderResult.residence_lon) {
    mapboxInstance.setCenter(new LngLat(GeocoderResult.residence_lon, GeocoderResult.residence_lat))
  }

  enableNextButton()
}

/**
 * Generate auto complete suggestions upon a change in the address, unless the address is an
 *  exact match with the most recent selected suggestion
 */
watch(
  address,
  async () => {
    const value = address.value.trim()

    if (value !== suggestion.value) {
      // Disable the button if the address value no longer matches the suggestion
      disableNextButton()

      // Clear suggestions if the input is cleared
      if (value === '') {
        autoCompleteSuggestions.value = []
      } else {
        const response = await getSuggestions(value, 7)

        if (
          !response ||
          !response.highlighting ||
          Object.keys(response.highlighting).length === 0
        ) {
          return
        }

        autoCompleteSuggestions.value = Object.keys(response.highlighting).map((key) => {
          return { Id: key, Suggestion: response.highlighting[key].suggest + '' }
        })
      }
    } else if (value !== '' && value === suggestion.value) {
      // Re-enable the next button if the address value is restored to the suggestion value
      enableNextButton()
    }
  },
  { immediate: true }
)

const onMapboxLoad = function onMapboxLoad({ map }: { map: Map }) {
  mapboxInstance = map
}
</script>

<template>
  <div class="Address">
    <div class="MapBox__Wrapper">
      <Mapbox style="width: 100%; height: 100%" :options="mapboxOptions" @load="onMapboxLoad" />
    </div>
    <div class="Address__Wrapper">
      <div class="Title">
        <h1>Melding maken voor adres:</h1>
      </div>

      <div class="FormField GeoCoder fieldClasses">
        <label for="address" class="FormField__Label">Zoek een adres</label>

        <div class="FormField__Wrapper">
          <input
            id="address"
            placeholder="Stationsplein, 1012 AB Amsterdam"
            autocomplete="off"
            class="FormField__Field"
            v-model="address"
          />

          <template v-if="autoCompleteSuggestions.length !== 0">
            <div class="GeoCoder__Suggestions">
              <div
                v-for="suggestion in autoCompleteSuggestions"
                class="Suggestion"
                :title="suggestion.Suggestion"
                @click="selectSuggestion(suggestion.Id)"
              >
                <div class="SvgIcon svg-container">
                  <SuggestionIcon />
                </div>
                <span v-html="suggestion.Suggestion"></span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.Address {
  display: flex;
  justify-content: space-between;
  flex-direction: column-reverse;
  height: 100%;
}

@media only screen and (min-width: 900px) {
  .Address {
    flex-direction: row-reverse;
  }
}

.Address .Address__Wrapper {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  justify-content: flex-start;
  padding: 20px 20px;
  width: 100%;
}

@media only screen and (min-width: 900px) {
  .Address .Address__Wrapper {
    padding: 50px 50px;
    width: 40%;
    min-width: 500px;
  }
}

.Address .Address__Wrapper .Title,
.BodyText {
  margin-bottom: 26px;
}

.Address .Address__Wrapper .Button {
  margin-top: 24px;
}

.Address .MapBox__Wrapper {
  position: relative;
  display: flex;
  flex: 1;
}

@media only screen and (min-width: 900px) {
  .Address .MapBox__Wrapper {
    height: auto;
    width: 40%;
  }
}

/*  */

.GeoCoder {
  position: relative;
}

.GeoCoder .FormField__Field {
  padding-right: 45px;
}

.GeoCoder .FormField__Icon {
  opacity: 1;
  font-size: 20px;
}

.Title h1 {
  color: #202122;
  font-size: 24px;
  line-height: 1.25;
  padding: 0;
  margin: 0;
  font-weight: 700;
}

.GeoCoder.FormField--invalid,
.GeoCoder.FormField--valid .FormField__Icon {
  font-size: 12px;
}

.GeoCoder__Suggestions {
  width: 100%;
  padding-top: 5px;
  border: 2px solid #d4daf0;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
  background: white;
}

@media only screen and (max-width: 900px) {
  .GeoCoder__Suggestions {
    position: absolute;
    top: 80px;
    z-index: 9999;
  }
}

.GeoCoder__Suggestions .Suggestion {
  display: block;
  position: relative;
  padding: 13px 15px 14px 50px;
}

.GeoCoder__Suggestions .Suggestion span {
  display: inline-block;
  font-size: 14px;
  line-height: 19px;
  color: #202122;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.GeoCoder__Suggestions .Suggestion .SvgIcon {
  color: #d4daf0;
  position: absolute;
  top: 13px;
  left: 20px;
  font-size: 19px;
}

.GeoCoder__Suggestions .Suggestion:hover {
  cursor: pointer;
  background: #2657ff;
}

.GeoCoder__Suggestions .Suggestion:hover .SvgIcon,
.GeoCoder__Suggestions .Suggestion:hover span {
  color: white;
}
</style>
