// ── Auth ──────────────────────────────────────────────────────────────────────
export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

// ── Doctor ────────────────────────────────────────────────────────────────────
export interface DoctorProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  profile_id: string;
  specialization: string;
  bio: string | null;
  consultation_fee: number;
  years_of_experience: number;
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface AvailabilitySlot {
  id: string;
  doctor_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

// ── Appointments ──────────────────────────────────────────────────────────────
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface Appointment {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  reason: string | null;
  notes: string | null;
  consultation_fee: number;
  payment_status: PaymentStatus;
  created_at: string;
  // Patient
  patient_id: string;
  patient_first_name: string;
  patient_last_name: string;
  patient_email: string;
  patient_phone: string | null;
  // Doctor
  doctor_id: string;
  doctor_name: string;
  doctor_last_name: string;
  doctor_email: string;
  specialization: string;
}

// ── Payments ──────────────────────────────────────────────────────────────────
export interface Payment {
  id: string;
  appointment_id: string;
  provider: 'stripe' | 'mpesa';
  provider_reference: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
}

// ── API response wrappers ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ── Form input types ──────────────────────────────────────────────────────────
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'patient' | 'doctor';
}

export interface BookAppointmentInput {
  doctor_id: string;
  availability_slot_id: string;
  appointment_date: string;
  reason?: string;
}

export interface CreateDoctorProfileInput {
  specialization: string;
  license_number: string;
  bio?: string;
  consultation_fee: number;
  years_of_experience: number;
}

export interface CreateAvailabilitySlotsInput {
  slots: {
    day_of_week: DayOfWeek;
    start_time: string;
    end_time: string;
  }[];
}