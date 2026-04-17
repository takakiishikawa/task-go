import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LAYER_LABELS: Record<string, string> = {
  core_value: 'コアバリュー', roadmap: 'ロードマップ',
  spec_design: '仕様・デザイン', other: 'その他',
}
const STATUS_LABELS: Record<string, string> = {
  pending: '未着手', in_progress: '進行中', done: '完了',
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { taskId, issueType } = await request.json()
    const isShort = issueType === 'short'

    // コンテキスト収集
    const [{ data: tasks }, { data: layers }] = await Promise.all([
      supabase.schema('taskgo').from('tasks').select('title, layer_type, status')
        .eq('user_id', user.id).neq('status', 'done').order('updated_at', { ascending: false }).limit(20),
      supabase.schema('taskgo').from('design_layers').select('layer_type, title, cover_until')
        .eq('user_id', user.id).order('last_updated_at', { ascending: false }),
    ])

    const taskSummary = (tasks ?? []).map((t) =>
      `・${t.title}（${LAYER_LABELS[t.layer_type]}/${STATUS_LABELS[t.status]}）`
    ).join('\n')

    const layerSummary = (layers ?? []).map((l) =>
      `・${LAYER_LABELS[l.layer_type]}: ${l.title}${l.cover_until ? `（カバー〜${l.cover_until}）` : ''}`
    ).join('\n')

    const context = `【進行中タスク】\n${taskSummary || '（なし）'}\n\n【設計レイヤー】\n${layerSummary || '（なし）'}`

    const systemPrompt = isShort
      ? `あなたはPdMの設計業務を支援するAIです。
以下は現在のタスク一覧と設計レイヤーの状況です。
現在進行中の開発において、今すぐ対処すべき重要な課題をトップ3で挙げてください。
各課題は課題名・なぜ重要か・推奨アクションの3点で記述してください。`
      : `あなたはPdMの設計業務を支援するAIです。
以下は現在のタスク一覧・設計レイヤー・ロードマップの状況です。
3〜12ヶ月のスパンで見た時に対処すべき重要な課題をトップ3で挙げてください。
各課題は課題名・なぜ重要か・推奨アクションの3点で記述してください。`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: `${systemPrompt}\n\n${context}` }],
    })

    const content = message.content[0]
    if (content.type !== 'text') return NextResponse.json({ error: 'Unexpected response' }, { status: 500 })

    // ai_suggestions に保存
    const { data: saved, error } = await supabase.schema('taskgo').from('ai_suggestions').insert({
      task_id: taskId, user_id: user.id,
      suggestion_type: 'issues', content: content.text,
    }).select().single()

    if (error) throw new Error(error.message)
    return NextResponse.json({ suggestion: saved })
  } catch (e) {
    console.error('[ai/issues]', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
