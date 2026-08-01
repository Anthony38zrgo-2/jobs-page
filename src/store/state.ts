// src/store/state.ts
import { reactive, readonly, watch } from 'vue'

// ─── Domain types ──────────────────────────────────────────────────────────────

export interface Category {
  name: string
  icon: string
  placeholder: string // dynamic textarea placeholder per category
}

export interface Technician {
  id: number
  name: string
  specialty: string
  rating: number      // 0–5
  jobsCompleted: number
  avatarUrl: string
  price: number       // S/.
  distance: string    // e.g. "1.2 km"
}

export interface Message {
  id: number
  from: 'user' | 'tech'
  content: string
  blocked: boolean
  timestamp: Date
}

export interface ServiceRecord {
  id: number
  date: string
  category: string
  technician: string
  technicianAvatar: string
  price: number
  rating: number
  recommendation: string
}

export interface TechnicianReview {
  rating: number
  recommendation: string
}

// ─── Initial state ─────────────────────────────────────────────────────────────

interface AppState {
  selectedCategory: Category | null
  jobDescription: string
  uploadedFile: string | null
  selectedTechnician: Technician | null
  messages: Message[]
  messageIdCounter: number
  otpCode: string
  completedServices: ServiceRecord[]
}

const STORAGE_KEY = 'confitec-app-state'

function createInitialState(): AppState {
  return {
  selectedCategory: null,
  jobDescription: '',
  uploadedFile: null,
  selectedTechnician: null,
  messages: [],
  messageIdCounter: 0,
  otpCode: '',
    completedServices: [
      {
        id: 1,
        date: '18 jul 2026',
        category: 'Gasfitería',
        technician: 'María Torres',
        technicianAvatar: 'https://i.pravatar.cc/80?img=47',
        price: 52,
        rating: 5,
        recommendation: 'Puntual y dejó todo limpio.',
      },
    ],
  }
}

function loadState(): AppState {
  const initialState = createInitialState()
  if (typeof window === 'undefined') return initialState

  try {
    const storedState = window.sessionStorage.getItem(STORAGE_KEY)
    if (!storedState) return initialState

    const saved = JSON.parse(storedState) as Partial<AppState>
    return {
      selectedCategory: saved.selectedCategory ?? null,
      jobDescription: typeof saved.jobDescription === 'string' ? saved.jobDescription : '',
      uploadedFile: typeof saved.uploadedFile === 'string' ? saved.uploadedFile : null,
      selectedTechnician: saved.selectedTechnician ?? null,
      messages: Array.isArray(saved.messages)
        ? saved.messages.map((message) => ({ ...message, timestamp: new Date(message.timestamp) }))
        : [],
      messageIdCounter: typeof saved.messageIdCounter === 'number' ? saved.messageIdCounter : 0,
      otpCode: typeof saved.otpCode === 'string' ? saved.otpCode : '',
      completedServices: Array.isArray(saved.completedServices)
        ? saved.completedServices
        : initialState.completedServices,
    }
  } catch {
    window.sessionStorage.removeItem(STORAGE_KEY)
    return initialState
  }
}

const state = reactive<AppState>(loadState())

watch(state, (currentState) => {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentState))
  } catch {
    // The app remains usable if storage is unavailable or full.
  }
}, { deep: true })

// ─── Composable ────────────────────────────────────────────────────────────────

export const useAppState = () => {
  return {
    state: readonly(state) as typeof state,

    setCategory(c: Category) {
      state.selectedCategory = c
    },

    setJobDescription(d: string) {
      state.jobDescription = d
    },

    setUploadedFile(f: string | null) {
      state.uploadedFile = f
    },

    setTechnician(t: Technician) {
      state.selectedTechnician = t
    },

    addMessage(m: Omit<Message, 'id'>) {
      state.messageIdCounter += 1
      state.messages.push({ ...m, id: state.messageIdCounter })
    },

    setOtp(code: string) {
      state.otpCode = code
    },

    addCompletedService(
      review: TechnicianReview,
      technician: Technician | null = state.selectedTechnician,
      category = state.selectedCategory?.name ?? 'Servicio',
    ) {
      const tech = technician
      if (!tech || review.rating < 1 || review.rating > 5) return false

      state.completedServices.unshift({
        id: Date.now(),
        date: new Intl.DateTimeFormat('es-PE', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }).format(new Date()),
        category,
        technician: tech.name,
        technicianAvatar: tech.avatarUrl,
        price: tech.price,
        rating: review.rating,
        recommendation: review.recommendation,
      })

      const previousJobs = tech.jobsCompleted
      tech.rating = Number(((tech.rating * previousJobs + review.rating) / (previousJobs + 1)).toFixed(1))
      tech.jobsCompleted = previousJobs + 1
      return true
    },

    resetAll() {
      state.selectedCategory = null
      state.jobDescription = ''
      state.uploadedFile = null
      state.selectedTechnician = null
      state.messages = []
      state.messageIdCounter = 0
      state.otpCode = ''
    },
  }
}
