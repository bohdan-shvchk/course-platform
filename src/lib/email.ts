import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInviteEmail(to: string, fullName: string, inviteUrl: string) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'onboarding@resend.dev',
    to,
    subject: 'Ваш доступ до платформи курсів',
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0a0a0a"><h2 style="font-size:20px;font-weight:600;margin:0 0 8px">Вітаємо, ${fullName}!</h2><p style="color:#5a5a5a;margin:0 0 24px;line-height:1.6">Ваш доступ до платформи підтверджено. Перейдіть за посиланням нижче, щоб створити пароль та отримати доступ до курсу.</p><a href="${inviteUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;font-size:14px">Створити пароль</a><p style="color:#9a9a9a;font-size:12px;margin:24px 0 0;line-height:1.6">Посилання дійсне 7 днів. Якщо ви не реєструвались — просто проігноруйте цей лист.</p></div>`,
  })
  if (error) throw new Error(error.message)
}
