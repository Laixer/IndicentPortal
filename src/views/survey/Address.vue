<script setup lang="ts">
import { onBeforeMount, ref, watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'

import SuggestionIcon from '@/components/icons/SuggestionIcon.vue'

import { useSurveyStore } from '@/stores/survey'
import { useNavigationStore } from '@/stores/navigation'
import { getLookup, getSuggestions, getSuggestionsNearCoordinates } from '@/services/pdok'
import api from '@/services/fundermaps/'
import Mapbox from '@/components/Mapbox.vue'
import { LngLat, Map, Marker } from 'mapbox-gl'
import { useConfigStore } from '@/stores/config'

const { branding } = storeToRefs(useConfigStore())
const surveyStore = useSurveyStore()
const { model, address, coordinates } = storeToRefs(surveyStore)
const { disableNextButton, enableNextButton } = useNavigationStore()

onBeforeMount(() => {
  // Disable next button initially
  disableNextButton()

  // Initialize suggestion with address if address is not null or empty
  if (address.value && address.value.trim() !== '') {
    suggestion.value = address.value
    // Only enable next if a building ID is already stored (meaning a valid selection was made previously)
    if (model.value.building !== '') {
      enableNextButton()
    }
  }
})

/**
 * The Mapbox config
 */
const mapboxOptions = {
  style: 'mapbox://styles/mapbox/streets-v11',
  center: branding.value.mapCenter ?? [4.9041, 52.3676],
  zoom: 12.5
}

let mapboxInstance: Map | undefined = undefined
const marker = new Marker()

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
const selectSuggestion = async (id: string) => {
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
  address.value = doc.weergavenaam;

  // Disable next button until we confirm a building ID
  disableNextButton()
  surveyStore.setBuilding('')
  coordinates.value = null

  // Remove marker if it exists when resetting
  if (mapboxInstance) {
    marker.remove()
  }

  try {
    // Throw the reference through the Fundermaps Geocoder to get a standardized address & building reference
    const geocoderResult = await api.building.getLocationInformationByBuildingId(doc.nummeraanduiding_id)
    if (!geocoderResult || !geocoderResult.building_id) { // Check for building_id specifically
      console.error('Geocoder result missing or does not contain building_id')
      return
    }

    surveyStore.setBuilding(geocoderResult.building_id)
    surveyStore.model.metadata = {
      ...surveyStore.model.metadata,
      address_name: doc.weergavenaam,
      nummeraanduiding_id: doc.nummeraanduiding_id,
      pdok_id: id,
    }

    // Set the coordinates, if the API response has this information
    if (mapboxInstance && geocoderResult.residence_lon && geocoderResult.residence_lat) {
      const coords = new LngLat(geocoderResult.residence_lon, geocoderResult.residence_lat)
      coordinates.value = { lat: coords.lat, lng: coords.lng }
      mapboxInstance.setCenter(coords)
      marker.setLngLat(coords).addTo(mapboxInstance)
    }

    enableNextButton() // Enable next only if building_id is confirmed
  } catch (error) {
    console.error('Error fetching geocoder result:', error)
    // Optionally, show an error message to the user
    // TODO: Implement user-facing error handling
  }
}

/**
 * Generate auto complete suggestions upon a change in the address, unless the address is an
 *  exact match with the most recent selected suggestion
 */
watch(
  address,
  async () => {
    const value = address.value?.trim()

    if (value !== suggestion.value) {
      // Disable the button and clear stored data if the address value no longer matches the suggestion
      disableNextButton()
      surveyStore.setBuilding('')

      // Remove marker from map when address changes and no longer matches suggestion
      if (mapboxInstance) {
        marker.remove()
        coordinates.value = null
      }

      // Clear suggestions if the input is cleared
      if (value === '') {
        autoCompleteSuggestions.value = []
      } else {
        let response;

        // Use location-based search if map center is defined
        if (branding.value.mapCenter) {
          // Use branding mapCenter as fallback, but prefer stored coordinates if available
          const searchCenter = coordinates.value ?? branding.value.mapCenter;
          response = await getSuggestionsNearCoordinates(value as string, searchCenter.lat, searchCenter.lng, 7)
        } else {
          response = await getSuggestions(value as string, 7)
        }

        if (
          !response ||
          !response.highlighting ||
          Object.keys(response.highlighting).length === 0
        ) {
          autoCompleteSuggestions.value = []
          return
        }

        autoCompleteSuggestions.value = Object.keys(response.highlighting).map((key) => {
          return { Id: key, Suggestion: response.highlighting[key].suggest + '' }
        })
      }
    } else if (value !== '' && value === suggestion.value && model.value.building !== '') {
      // Re-enable the next button ONLY if the address value is restored AND a building ID is present
      enableNextButton()
    }
  },
  { immediate: true }
)

const onMapboxLoad = function onMapboxLoad({ map }: { map: Map }) {
  mapboxInstance = map

  // Check if coordinates are already stored and place marker
  if (coordinates.value && mapboxInstance) {
    const coords = new LngLat(coordinates.value.lng, coordinates.value.lat)
    mapboxInstance.setCenter(coords)
    marker.setLngLat(coords).addTo(mapboxInstance)
  }
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
          <input id="address" placeholder="Stationsplein, 1012 AB Amsterdam" autocomplete="off" class="FormField__Field"
            v-model="address" type="text" />

          <div v-if="autoCompleteSuggestions.length !== 0" class="GeoCoder__Suggestions">
            <ul>
              <li v-for="suggestionItem in autoCompleteSuggestions" :key="suggestionItem.Id" class="Suggestion"
                :title="suggestionItem.Suggestion" @click="selectSuggestion(suggestionItem.Id)">
                <div class="SvgIcon svg-container">
                  <SuggestionIcon />
                </div>
                <span v-html="suggestionItem.Suggestion"></span>
              </li>
            </ul>
          </div>
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
.Address .BodyText {
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

.Address .Title h1 {
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
  position: absolute;
  z-index: 9999;
  top: 100%;
  left: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media only screen and (max-width: 900px) {
  .GeoCoder__Suggestions {
    width: 100%;
  }
}

.GeoCoder__Suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.GeoCoder__Suggestions .Suggestion {
  display: block;
  position: relative;
  padding: 13px 15px 14px 50px;
  cursor: pointer;
  transition: background-color 0.2s ease;
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

.GeoCoder__Suggestions .Suggestion:hover,
.GeoCoder__Suggestions .Suggestion:focus {
  background: #2657ff;
  outline: none;
}

.GeoCoder__Suggestions .Suggestion:hover .SvgIcon,
.GeoCoder__Suggestions .Suggestion:hover span,
.GeoCoder__Suggestions .Suggestion:focus .SvgIcon,
.GeoCoder__Suggestions .Suggestion:focus span {
  color: white;
}
</style>
