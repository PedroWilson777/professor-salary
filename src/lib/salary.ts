import type { Teacher, ScheduleSlot, TeacherPayment, SalarySummary, CalculateResponse } from '@/types'

export function calculateSalaries(
  referenceWeek: string,
  teachers: Teacher[],
  schedule: ScheduleSlot[]
): CalculateResponse {
  const classCounts: Record<string, number> = {}
  for (const slot of schedule) {
    classCounts[slot.teacherId] = (classCounts[slot.teacherId] || 0) + 1
  }

  const teacherPayments: TeacherPayment[] = teachers.map((t) => {
    const classes = classCounts[t.id] || 0
    const totalHours = parseFloat(((classes * t.duration) / 60).toFixed(2))
    const weeklyPay = parseFloat((totalHours * t.hourlyRate).toFixed(2))
    const monthlyPay = parseFloat((weeklyPay * 4).toFixed(2))
    return {
      id: t.id,
      name: t.name,
      discipline: t.discipline,
      color: t.color,
      weeklyCl: classes,
      totalHours,
      hourlyRate: t.hourlyRate,
      weeklyPay,
      monthlyPay,
    }
  })

  const summary: SalarySummary = {
    totalWeeklyClasses: schedule.length,
    totalWeeklyPay: parseFloat(
      teacherPayments.reduce((a, t) => a + t.weeklyPay, 0).toFixed(2)
    ),
    totalMonthlyPay: parseFloat(
      teacherPayments.reduce((a, t) => a + t.monthlyPay, 0).toFixed(2)
    ),
    teacherCount: teachers.length,
  }

  return {
    referenceWeek,
    generatedAt: new Date().toISOString(),
    teachers: teacherPayments,
    summary,
  }
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const TIME_SLOTS = [
  '07:00','07:50','08:40','09:30','10:20','11:10',
  '13:00','13:50','14:40','15:30','16:20','17:10',
  '18:00','18:50','19:40','20:30','21:20',
]

export const DAYS = ['Segunda','Terça','Quarta','Quinta','Sexta']

export const COLORS = [
  '#1D9E75','#378ADD','#7F77DD','#D85A30',
  '#D4537E','#BA7517','#639922','#888780',
]

export function generateId(): string {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}
