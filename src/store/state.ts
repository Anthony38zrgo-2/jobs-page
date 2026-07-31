// src/store/state.ts
import { reactive, readonly } from 'vue'

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

export type ViewState =
  | 'home'
  | 'request'
  | 'radar'
  | 'chat'
  | 'validation'
  | 'catalog'
  | 'history'
  | 'technician-registration'

// ─── Initial state ─────────────────────────────────────────────────────────────

const state = reactive<{
  viewState: ViewState
  selectedCategory: Category | null
  jobDescription: string
  uploadedFile: string | null
  selectedTechnician: Technician | null
  messages: Message[]
  messageIdCounter: number
  otpCode: string
  completedServices: ServiceRecord[]
}>({
  viewState: 'home',
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
})

// ─── Composable ────────────────────────────────────────────────────────────────

export const useAppState = () => {
  return {
    state: readonly(state) as typeof state,

    setViewState(v: ViewState) {
      state.viewState = v
    },

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

    addCompletedService(rating: number, recommendation: string) {
      const tech = state.selectedTechnician
      if (!tech) return

      state.completedServices.unshift({
        id: Date.now(),
        date: new Intl.DateTimeFormat('es-PE', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }).format(new Date()),
        category: state.selectedCategory?.name ?? 'Servicio',
        technician: tech.name,
        technicianAvatar: tech.avatarUrl,
        price: tech.price,
        rating,
        recommendation,
      })
    },

    resetAll() {
      state.viewState = 'home'
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
