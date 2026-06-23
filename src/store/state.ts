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

export type ViewState = 'home' | 'request' | 'radar' | 'chat' | 'validation'

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
}>({
  viewState: 'home',
  selectedCategory: null,
  jobDescription: '',
  uploadedFile: null,
  selectedTechnician: null,
  messages: [],
  messageIdCounter: 0,
  otpCode: '',
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
