// src/data/categories.ts
import type { Category } from '@/store/state'

export const CATEGORIES: Category[] = [
  {
    name: 'Electricistas',
    icon: 'electrical_services',
    placeholder: 'Ej: Mi llave térmica se baja sola cada vez que enciendo el horno…',
  },
  {
    name: 'Gasfiteros',
    icon: 'plumbing',
    placeholder: 'Ej: El caño del baño gotea sin parar desde hace dos días…',
  },
  {
    name: 'Albañiles',
    icon: 'construction',
    placeholder: 'Ej: Necesito reparar una grieta en la pared de la sala…',
  },
  {
    name: 'Carpinteros',
    icon: 'carpenter',
    placeholder: 'Ej: La puerta de entrada no cierra bien, la bisagra está rota…',
  },
  {
    name: 'Melamina',
    icon: 'kitchen',
    placeholder: 'Ej: Quiero instalar un mueble de melamina en la cocina…',
  },
  {
    name: 'Vidrios',
    icon: 'window',
    placeholder: 'Ej: Se rompió el vidrio de la ventana del cuarto principal…',
  },
]

// ─── Mock pins on the map ──────────────────────────────────────────────────────

export interface MapPin {
  id: number
  x: string   // CSS left %
  y: string   // CSS top %
  label: string
  color: string
}

export const MAP_PINS: MapPin[] = [
  { id: 1, x: '22%', y: '30%', label: 'Juan – Electricista a 0.8 km', color: 'text-rose-500' },
  { id: 2, x: '55%', y: '55%', label: 'María – Gasfitepa a 1.4 km',  color: 'text-rose-400' },
  { id: 3, x: '72%', y: '25%', label: 'Carlos – Albañil a 2.1 km',   color: 'text-rose-600' },
]

// ─── Mock technician bids ──────────────────────────────────────────────────────

export const MOCK_TECHNICIANS = [
  {
    id: 1,
    name: 'Juan Pérez',
    specialty: 'Electricista Certificado',
    rating: 4.8,
    jobsCompleted: 312,
    avatarUrl: 'https://i.pravatar.cc/80?img=12',
    price: 45,
    distance: '0.8 km',
  },
  {
    id: 2,
    name: 'Roberto Silva',
    specialty: 'Técnico Industrial',
    rating: 4.6,
    jobsCompleted: 187,
    avatarUrl: 'https://i.pravatar.cc/80?img=33',
    price: 38,
    distance: '1.6 km',
  },
]
