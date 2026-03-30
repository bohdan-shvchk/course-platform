import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function getSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSessionWithRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data } = await admin
    .from('users')
    .select('id, email, role, full_name')
    .eq('id', user.id)
    .single()

  if (!data) return null
  return { id: data.id, email: data.email, role: data.role as 'admin' | 'student', fullName: data.full_name }
}
