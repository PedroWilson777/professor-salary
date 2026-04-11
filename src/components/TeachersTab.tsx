'use client'

import { useState } from 'react'
import type { Teacher } from '@/types'
import { COLORS } from '@/lib/salary'
import styles from './TeachersTab.module.css'

interface Props {
  teachers: Teacher[]
  onAdd: (t: Omit<Teacher, 'id'>) => void
  onRemove: (id: string) => void
}

const DURATIONS = [{value:50,label:'50 min'},{value:60,label:'60 min (1h)'},{value:90,label:'90 min'},{value:100,label:'100 min'}]

export default function TeachersTab({ teachers, onAdd, onRemove }: Props) {
  const [name, setName] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [duration, setDuration] = useState(60)
  const [color, setColor] = useState(COLORS[0])
  const [error, setError] = useState('')

  function handleAdd() {
    if (!name.trim()) { setError('Informe o nome do professor'); return }
    const rate = parseFloat(hourlyRate)
    if (isNaN(rate) || rate <= 0) { setError('Informe um valor de hora/aula vālido'); return }
    setError('')
    onAdd({ name: name.trim(), discipline: discipline.trim() || '—', hourlyRate: rate, duration, color })
    setName(''); setDiscipline(''); setHourlyRate('')
  }

  return (
    <div className={styles.root}>
      <div className={`card ${styles.form}`}>
        <h2 className={styles.sectionTitle}>Cadastrar professor</h2>
        <div className={styles.grid}>
          <div className={styles.field}><label>Nome completo</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Ana Silva" onKeyDown={e=>e.key==='Enter'&&handleAdd()}/></div>
          <div className={styles.field}><label>Disciplina</label><input value={discipline} onChange={e=>setDiscipline(e.target.value)} placeholder="Ex: Matemática"/></div>
          <div className={styles.field}><label>Valor hora/aula (R$)</label><input type="number" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} placeholder="80.00" min="0" step="0.50"/></div>
          <div className={styles.field}><label>Duração da aula</label><select value={duration} onChange={e=>setDuration(Number(e.target.value))}>{DURATIONS.map(d=><option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
        </div>
        <div className={styles.colorRow}><label className={styles.colorLabel}>Cor de identificação</label><div className={styles.colors}>{COLORS.map(c=><button key={c} className={`${styles.colorBtn} ${color===c?styles.colorBtnSel:''}`} style={{background:c}} onClick={()=>setColor(c)} title={c}/>)}</div></div>
        {error&&<p className={styles.error}>{error}</p>}
        <div className={styles.actions}><button className="primary" onClick={handleAdd}>Adicionar professor</button></div>
      </div>
      {teachers.length===0?(<div className={styles.empty}><div className={styles.emptyIcon}>👤</div><p>Nenhum professor cadastrado.</p></div>):(<div className={styles.list}>{teachers.map(t=><div key={t.id} className={`card ${styles.teacherCard}`}><div className={styles.teacherLeft}><div className={styles.avatar} style={{background:t.color+'22',color:t.color}}>{t.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}</div><div><div className={styles.teacherName}>{t.name}</div><div className={styles.teacherMeta}><span className="badge gray">{t.discipline}</span><span>R$ {t.hourlyRate.toFixed(2)}/h</span><span>{t.duration} min/aula</span></div></div></div><button className="danger" onClick={()=>onRemove(t.id)}>Remover</button></div>)}</div>)}
    </div>
  )
}
