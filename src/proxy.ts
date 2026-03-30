import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isStudentRoute = pathname.startsWith('/course')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/invite')

  if ((isAdminRoute || isStudentRoute) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && user) {
    const db = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?id=eq.${user.id}&select=role`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    }).then(r => r.json())
    const role = db?.[0]?.role
    return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/course', request.url))
  }

  return response
}

export default proxy

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
