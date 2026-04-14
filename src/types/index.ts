export interface Teacher {
  id: string
  name: string
  disciplines: string[]
  hourlyRate: number
  duration: number
  color: string
}

export interface ScheduleSlot {
  day: string
  timeSlot: string
  teacherId: string
  discipline?: string
}

export interface TeacherPayment {
  id: string
  name: string
  disciplines: string[]
  color: string
  weeklyCl: number
  totalHours: number
  hourlyRate: number
  weeklyPay: number
  monthlyPay: number
}

export interface SalarySummary {
  totalWeeklyClasses: number
  totalWeeklyPay: number
  totalMonthlyPay: number
  teacherCount: number
}

export interface CalculateRequest {
  referenceWeek: string
  teachers: Teacher[]
  schedule: ScheduleSlot[]
}

export interface CalculateResponse {
  referenceWeek: string
  generatedAt: string
  teachers: TeacherPayment[]
  summary: SalarySummary
}
