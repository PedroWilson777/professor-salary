'use client'

import { useState, useCallback } from 'react'
import type { Teacher, ScheduleSlot } from '@/types'
import { generateId } from '@/lib/salary'
import TeachersTab from './TeachersTab'
import ScheduleTab from './ScheduleTab'
import PaymentTab from './PaymentTab'
import ExportTab from './ExportTab'
import styles from './SalaryApp.module.css'

type Tab = 'professores' | 'grade' | 'pagamento' | 'exportar'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'professores', label: 'Professores', icon: '👤' },
  { id: 'grade', label: 'Grade Horária', icon: '📅' },
  { id: 'pagamento', label: 'Pagamento', icon: '💰' },
  { id: 'exportar', label: 'Exportar / API', icon: '🔌' },
]

export default function SalaryApp() {
  const [activeTab, setActiveTab] = useState<Tab>('professores')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([])
  const [referenceWeek, setReferenceWeek] = useState('')

  const addTeacher = useCallback((t: Omit<Teacher, 'id'>) => {
    setTeachers(prev => [...prev, { ...t, id: generateId() }])
  }, [])

  const removeTeacher = useCallback((id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id))
    setSchedule(prev => prev.filter(s => s.teacherId !== id))
  }, [])

  const toggleSlot = useCallback((day: string, timeSlot: string, teacherId: string) => {
    setSchedule(prev => {
      const existing = prev.find(s => s.day === day && s.timeSlot === timeSlot)
      if (existing) {
        return prev.filter(s => !(s.day === day && s.timeSlot === timeSlot))
      }
      if (!teacherId) return prev
      return [...prev, { day, timeSlot, teacherId }]
    })
  }, [])

  const clearSchedule = useCallback(() => setSchedule([]), [])

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandDot} />
            <span className={styles.brandName}>ProfPay</span>
            <span className={styles.brandSub}>Gestão de hora-aula</span>
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.version}>v1.0</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <nav className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'professores' && teachers.length > 0 && (
                <span className={styles.tabBadge}>{teachers.length}</span>
              )}
              {tab.id === 'grade' && schedule.length > 0 && (
                <span className={styles.tabBadge}>{schedule.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className={styles.content}>
          {activeTab === 'professores' && (<TeachersTab teachers={teachers} onAdd={addTeacher} onRemove={removeTeacher} />)}
          {activeTab === 'grade' && (<ScheduleTab teachers={teachers} schedule={schedule} referenceWeek={referenceWeek} onReferenceWeekChange={setReferenceWeek} onToggleSlot={toggleSlot} onClear={clearSchedule} />)}
          {activeTab === 'pagamento' && (<PaymentTab teachers={teachers} schedule={schedule} referenceWeek={referenceWeek} />)}
          {activeTab === 'exportar' && (<ExportTab teachers={teachers} schedule={schedule} referenceWeek={referenceWeek} />)}
        </div>
      </main>
    </div>
  )
}
