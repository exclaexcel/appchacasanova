'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { HardHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [successMsg, setSuccessMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    if (mode === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError('Email ou senha incorretos.')
      } else {
        router.push('/')
        router.refresh()
      }
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) {
        setError(err.message)
      } else {
        setSuccessMsg('Conta criada! Verifique seu e-mail para confirmar.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-orange-700/20 rounded-3xl flex items-center justify-center">
              <HardHat className="h-10 w-10 text-orange-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-zinc-100">ReformaApp</h1>
          <p className="text-zinc-400 text-sm mt-2">Gestão financeira de obras e reformas</p>
        </div>

        <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50">
          <div className="flex rounded-lg bg-zinc-900 p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccessMsg('') }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === 'login'
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccessMsg('') }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === 'signup'
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {successMsg && (
              <p className="text-sm text-emerald-400 bg-emerald-900/20 border border-emerald-800/30 rounded-lg px-3 py-2">
                {successMsg}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Controle suas obras com precisão.
        </p>
      </div>
    </div>
  )
}
