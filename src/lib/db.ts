import { createAdminClient } from './supabase/admin'
import { createClient } from './supabase/server'

// Серверний клієнт (з сесією користувача)
export const getDb = createClient

// Адмін клієнт (service role, обходить RLS)
export const getAdminDb = () => createAdminClient()
