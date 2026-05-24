import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCareStore = defineStore('care', () => {
  const operatorName = ref('')
  const patient = ref(null)

  const measurements = ref({
    systolic: 0,
    diastolic: 0,
    heart_rate: 0,
    spo2: 0,
    temperature: 0,
  })

  // To cache submitted data for offline retry
  const cachedSubmissions = ref([])

  const setOperatorName = (name) => {
    operatorName.value = name
  }

  const setPatient = (data) => {
    patient.value = data
  }

  const setMeasurements = (data) => {
    measurements.value = data
  }

  const cacheSubmission = (data) => {
    cachedSubmissions.value.push(data)
  }

  const clearCache = () => {
    cachedSubmissions.value = []
  }

  const resetSession = () => {
    patient.value = null
    measurements.value = {
      systolic: 0,
      diastolic: 0,
      heart_rate: 0,
      spo2: 0,
      temperature: 0,
    }
  }

  return {
    operatorName,
    patient,
    measurements,
    cachedSubmissions,
    setOperatorName,
    setPatient,
    setMeasurements,
    cacheSubmission,
    clearCache,
    resetSession,
  }
})
