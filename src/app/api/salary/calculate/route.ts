import { NextRequest, NextResponse } from 'next/server'
import { calculateSalaries } from '@/lib/salary'
import type { CalculateRequest } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: CalculateRequest = await req.json()

    if (!body.teachers || !Array.isArray(body.teachers)) {
      return NextResponse.json({ error: 'teachers array required' }, { status: 400 })
    }
    if (!body.schedule || !Array.isArray(body.schedule)) {
      return NextResponse.json({ error: 'schedule array required' }, { status: 400 })
    }

    const result = calculateSalaries(
      body.referenceWeek || 'não informada',
      body.teachers,
      body.schedule
    )

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({
    description: 'Calcula salário de professores baseado em hora-aula e grade horária',
    version: '1.0.0',
  })
}
