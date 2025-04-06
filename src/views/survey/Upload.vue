<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'

import { uploadIncidentFiles } from '@/services/fundermaps/endpoints/incident.js'

import { useSurveyStore } from '@/stores/survey.js'
import { useNavigationStore } from '@/stores/navigation.js'

const { Model } = storeToRefs(useSurveyStore())
const { disableNextButton, enableNextButton } = useNavigationStore()

const loadedFiles: Ref<File[]> = ref([])
const isUploading: Ref<boolean> = ref(false)
const errorMessage: Ref<string> = ref('')

// File validation constants
const MAX_FILES = 25
const MAX_FILE_SIZE = 4 * 1024 * 1024 * 1024 // 4GB in bytes
const ALLOWED_FILE_TYPES = [
  'image/png', 'image/jpeg', 'image/jpg', 'image/heif', 'image.heic',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'text/csv',
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv',
  'application/pdf', // PDF
  'text/plain' // TXT
]

interface ValidationResult {
  isValid: boolean;
  validFiles: File[];
  errorMessage: string;
}

const validateFiles = (files: FileList, currentCount: number): ValidationResult => {
  // Validate number of files
  if (currentCount + files.length > MAX_FILES) {
    return {
      isValid: false,
      validFiles: [],
      errorMessage: `U kunt maximaal ${MAX_FILES} bestanden uploaden.`
    }
  }

  // Validate file types and sizes
  const validFiles: File[] = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        validFiles: [],
        errorMessage: 'Alleen png, jpg, jpeg, docx, xlsx, csv, heif, en video bestanden zijn toegestaan.'
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        validFiles: [],
        errorMessage: 'Bestandsgrootte mag niet groter zijn dan 4 GB.'
      }
    }

    validFiles.push(file)
  }

  return {
    isValid: validFiles.length > 0,
    validFiles,
    errorMessage: ''
  }
}

const uploadFiles = async function uploadFile(files: FileList) {
  try {
    const validationResult = validateFiles(files, loadedFiles.value.length)

    if (!validationResult.isValid) {
      errorMessage.value = validationResult.errorMessage
      return
    }

    errorMessage.value = ''
    isUploading.value = true
    disableNextButton()

    await uploadIncidentFiles(validationResult.validFiles as unknown as FileList).then((response) => {
      loadedFiles.value = loadedFiles.value.concat(Array.from(validationResult.validFiles))
      Model.value.document_file = (Model.value.document_file || []).concat(response?.files || [])
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    errorMessage.value = 'Er is een fout opgetreden bij het uploaden van bestanden.'
  } finally {
    isUploading.value = false
    enableNextButton()
  }
}

const handleFileChange = async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target && target.files) {
    await uploadFiles(target.files)
  }
}
</script>

<template>
  <div class="Upload__Wrapper">
    <Title message="Heeft u informatie beschikbaar?" subtitle="U kunt deze stap ook overslaan" :center="true" />

    <form id="upload-area" class="UploadArea dropzone dz-clickable">
      <label for="file-upload">
        <div class="dz-message align-self-center">
          <input type="file" id="file-upload" style="display: none" @change="handleFileChange" multiple
            accept=".png,.jpg,.jpeg,.heif,.heic,.docx,.xlsx,.csv,.mp4,.mov,.avi,.wmv,.pdf,.txt" />

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <template v-if="loadedFiles.length !== 0">
            <div style="display: flex; justify-content: center; column-gap: 15px; flex-wrap: wrap">
              <div v-for="(file, index) in loadedFiles" :key="`file_${index}`">
                <img alt="uploaded" src="https://images.freeimages.com/fic/images/icons/2813/flat_jewels/512/file.png"
                  width="150" />
                <p>{{ file.name }}</p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="upload-image-container">
              <img alt="upload" src="/img/upload.svg" />
            </div>
          </template>

          <div class="mb-0 mt-3">
            <strong>Upload onderzoeksrapporten, archiefstukken, tekeningen of foto's</strong>
            <div>
              <span>Klik om een bestand te kiezen</span>
              <p class="file-limits">(max 25 bestanden, 4 GB per bestand)</p>
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

.upload-image-container {
  height: 172px;
  width: 235px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.error-message {
  color: #d9534f;
  margin-bottom: 10px;
  padding: 8px;
  background-color: rgba(217, 83, 79, 0.1);
  border-radius: 4px;
}

.file-limits {
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
}
</style>
