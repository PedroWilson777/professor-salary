'use client'

import { useState, useMemo } from 'react'
import type { Teacher, ScheduleSlot } from '@/types'
import { DAYS, TIME_SLOTS } from '@/lib/salary'
import styles from './ScheduleTab.module.css'

interface Props {
  teachers: Teacher[]
  schedule: ScheduleSlot[]
  referenceWeek: string
  onReferenceWeekChange: (v: string) => void
  onToggleSlot: (day: string, timeSlot: string, teacherId: string) => void
  onClear: () => void
}

export default function ScheduleTab({
  teachers, schedule, referenceWeek,
  onReferenceWeekChange, onToggleSlot, onClear,
}: Props) {
  const [selectedTeacherId, setSelectedTeacherId] = useState('')

  const scheduleMap = useMemo(() => {
    const m: Record<string, string> = {}
    for (const s of schedule) {
      m[`${s.day}|${s.timeSlot}`] = s.teacherId
    }
    return m
  }, [schedule])

  const teacherMap = useMemo(() => {
    const m: Record<string, Teacher> = {}
    for (const t of teachers) m[t.id] = t
    return m
  }, [teachers])

  const classCounts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const s of schedule) c[s.teacherId] = (c[s.teacherId] || 0) + 1
    return c
  }, [schedule])

  function handleSlotClick(day: string, slot: string) {
    const key = `${day}|${slot}`
    const existing = scheduleMap[key]
    if (existing) {
      onToggleSlot(day, slot, existing)
    } else if (selectedTeacherId) {
      onToggleSlot(day, slot, selectedTeacherId)
    }
  }

  if (teachers.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📅</div>
        <p>Cadastre professores primeiro</p>
        <span>Volte à aba "Professores" para adicionar.</span>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={`card ${styles.toolbar}`}>
        <div className={styles.toolbarLeft}>
          <div className={styles.field}>
            <label>Semana de referência</label>
            <input value={referenceWeek} onChange={e => onReferenceWeekChange(e.target.value)} placeholder="Ex: 07/04 – 11/04" style={{ width: 180 }} />
          </div>
          <div className={styles.field}>
            <label>Professor ativo</label>
            <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)} style={{ width: 200 }}>
              <option value="">— selecione para atribuir —</option>
              {teachers.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
            </select>
          </div>
        </div>
        <button className="danger" onClick={() => { if (confirm('Limpar toda a grade?')) onClear() }}>Limpar grade</button>
      </div>
      <div className={styles.legend}>
        {teachers.map(t => (
          <button key={t.id} className={`${styles.legendItem} ${selectedTeacherId === t.id ? styles.legendActive : ''}`} style={selectedTeacherId === t.id ? { borderColor: t.color, background: t.color + '15' } : {}} onClick={() => setSelectedTeacherId(prev => prev === t.id ? '' : t.id)}>
            <span className={styles.legendDot} style={{ background: t.color }} />
            <span>{t.name.split(' ')[0]}</span>
            <span className={styles.legendCount}>{classCounts[t.id] || 0} aulas</span>
          </button>
        ))}
      </div>
      <p className={styles.hint}>Selecione um professor acima e clique nos horários para atribuir aulas.</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th className={styles.timeHeader}>Horário</th>{DAYS.map(d => <th key={d}>{d}</th>)}</tr></thead>
          <tbody>
            {TIME_SLOTS.map(slot => (
              <tr key={slot}>
                <td className={styles.timeCell}>{slot}</td>
                {DAYS.map(day => {
                  const key = `${day}|${slot}`
                  const teacherId = scheduleMap[key]
                  const teacher = teacherId ? teacherMap[teacherId] : null
                  return (
                    <td key={day} className={styles.slotCell}>
                      <button className={`${styles.slot} ${teacher ? styles.slotFilled : styles.slotEmpty}`} style={teacher ? { background: teacher.color + '18', color: teacher.color, borderColor: teacher.color + '55' } : {}} onClick={() => handleSlotClick(day, slot)}>
                        {teacher ? teacher.name.split(' ')[0] : <span className={styles.plus}>+</span>}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.summary}>
        <div className={styles.summaryItem}><span className={styles.summaryValue}>{schedule.length}</span><span className={styles.summaryLabel}>aulas na semana</span></div>
        {teachers.map(t => (<div key={t.id} className={styles.summaryItem}><span className={styles.summaryValue} style={{ color: t.color }}>{classCounts[t.id] || 0}</span><span className={styles.summaryLabel}>{t.name.split(' ')[0]}</span></div>))}
      </div>
    </div>
  )
}
