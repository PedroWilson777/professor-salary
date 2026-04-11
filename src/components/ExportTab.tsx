'use client'

import { useState, useMemo } from 'react'
import type { Teacher, ScheduleSlot } from '@/types'
import { calculateSalaries } from '@/lib/salary'
import styles from './ExportTab.module.css'

interface Props {
  teachers: Teacher[]
  schedule: ScheduleSlot[]
  referenceWeek: string
}

export default function ExportTab({ teachers, schedule, referenceWeek }: Props) {
  const [copied, setCopied] = useState(false)
  const [activeView, setActiveView] = useState<'payload' | 'response' | 'docs'>('payload')

  const payload = useMemo(() => ({
    referenceWeek: referenceWeek || 'não informada',
    teachers,
    schedule,
  }), [teachers, schedule, referenceWeek])

  const response = useMemo(
    () => calculateSalaries(referenceWeek || '—', teachers, schedule),
    [teachers, schedule, referenceWeek]
  )

  const docs = {
    description: 'API REST para cálculo de salário de professores por hora-aula',
    baseUrl: 'https://SEU-PROJETO.vercel.app',
    endpoints: [{method:'POST',path:'/api/salary/calculate',description:'Calcula pagamento de todos os professores'}],
  }

  const jsonString = useMemo(() => {
    const obj = activeView === 'payload' ? payload : activeView === 'response' ? response : docs
    return JSON.stringify(obj, null, 2)
  }, [activeView, payload, response])

  async function copyJSON() {
    await navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.root}>
      <div className={`card ${styles.mainCard}`}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Exportar / Integração via API</h3>
            <p className={styles.subtitle}>Endpoint disponível após deploy</p>
          </div>
          <div className={styles.endpoint}>
            <span className={styles.method}>POST</span>
            <code>/api/salary/calculate</code>
          </div>
        </div>
        <div className={styles.viewTabs}>
          <button className={`${styles.viewTab} ${activeView==='payload'?styles.viewTabActive:''}`} onClick={()=>setActiveView('payload')}>Request</button>
          <button className={`${styles.viewTab} ${activeView==='response'?styles.viewTabActive:''}`} onClick={()=>setActiveView('response')}>Response</button>
          <button className={`${styles.viewTab} ${activeView==='docs'?styles.viewTabActive:''}`} onClick={()=>setActiveView('docs')}>Docs</button>
        </div>
        <div className={styles.codeHeader}>
          <span className={styles.codeLang}>JSON</span>
          <button className="ghost" onClick={copyJSON} style={{ fontSize: 12 }}>
            {copied ? '➓ Copiado!' : 'Copiar'}
          </button>
        </div>
        <pre className={styles.code}>{jsonString}</pre>
      </div>
    </div>
  )
}
