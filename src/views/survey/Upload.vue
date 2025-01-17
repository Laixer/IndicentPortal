<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'

import { uploadIncidentFiles } from '@/services/fundermaps/endpoints/incident.js'

import { useSurveyStore } from '@/stores/survey.js'

const { Model } = storeToRefs(useSurveyStore())

const loadedFiles: Ref<File[]> = ref([])

const uploadFiles = async function uploadFile(files: FileList) {
  await uploadIncidentFiles(files).then(() => {
    loadedFiles.value = loadedFiles.value.concat(Array.from(files))
    Model.value.document_file = loadedFiles.value.map((file) => file.name)
  })
}

/**
 * TODO:
 * Limit uploads to max 25
 * Limit file size to max 4 GB
 * Limit file types to png, jpg, jpeg, docx, xlsx, csv, heif, <video>, <mobile cam foto types>
 */
const handleFileChange = async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target && target.files) {
    await uploadFiles(target.files)
  }
}
</script>

<template>
  <div class="Upload__Wrapper">
    <Title
      message="Heeft u informatie beschikbaar?"
      subtitle="U kunt deze stap ook overslaan"
      :center="true"
    />

    <form id="upload-area" class="UploadArea dropzone dz-clickable">
      <label for="file-upload">
        <div class="dz-message align-self-center">
          <input
            type="file"
            id="file-upload"
            style="display: none"
            @change="handleFileChange"
            multiple
          />

          <template v-if="loadedFiles.length !== 0">
            <div style="display: flex; justify-content: center; column-gap: 15px; flex-wrap: wrap">
              <div v-for="(file, index) in loadedFiles" :key="`file_${index}`">
                <img
                  alt="uploaded"
                  src="https://images.freeimages.com/fic/images/icons/2813/flat_jewels/512/file.png"
                  width="150"
                />
                <p>{{ file.name }}</p>
              </div>
            </div>
          </template>
          <template v-else>
            <img alt="upload" src="/img/upload.svg" />
          </template>

          <div class="mb-0 mt-3">
            <strong>Upload onderzoeksrapporten, archiefstukken, tekeningen of foto's</strong>
            <div>
              <span>Klik om een bestand te kiezen</span>
            </div>
          </div>
        </div>
      </label>
    </form>
  </div>
</template>

<style>
.Upload__Wrapper {
  height: 100%;
  padding: 20px 20px;

  max-width: 100%;
}

.Upload__Wrapper .Title {
  margin-bottom: 4px;
}

.Upload__Wrapper .BodyText {
  max-width: 100%;
  margin-bottom: 26px;
  font-size: 16px;
}

@media only screen and (min-width: 900px) {
  .Upload__Wrapper {
    padding: 50px 80px;
  }
}

.Upload__Wrapper .Title {
  margin-bottom: 26px;
}

/*  */

.UploadArea {
  width: 100%;
  border-radius: 5px;
  background-color: hsla(0, 0%, 100%, 0.7);
  border: 1px solid #d4daf0;
  user-select: none;
  cursor: pointer;
}

.UploadArea:hover {
  background-color: #f0f3fd;
}

.dropzone .dz-message {
  text-align: center;
  padding: 20px 20px;
  /* margin: 2em 0; */
}

.dropzone.dz-clickable .dz-message,
.dropzone.dz-clickable .dz-message * {
  cursor: pointer;
}

.UploadArea p {
  text-align: center;
  font-size: 14px;
  color: #354052;
  font-weight: 300;
  line-height: 17px;
}
</style>
