import { serverSupabaseServiceRole, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; nome: string; role: string }>(event)

  if (!body.email || !body.nome) {
    throw createError({ statusCode: 400, statusMessage: 'email e nome são obrigatórios' })
  }

  const userClient = await serverSupabaseClient(event)
  const { data: { user: adminUser } } = await userClient.auth.getUser()

  if (!adminUser) {
    throw createError({ statusCode: 401, statusMessage: 'Não autorizado' })
  }

  const adminClient = await serverSupabaseServiceRole(event)

  const requestUrl = getRequestURL(event)
  const origin = `${requestUrl.protocol}//${requestUrl.host}`

  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(body.email, {
    redirectTo: `${origin}/completar-cadastro`,
    data: { nome: body.nome, role: body.role || 'user' }
  })

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  const { error: insertError } = await adminClient
    .from('usuarios')
    .insert({
      usuario_auth: data.user.id,
      user_id: adminUser.id,
      nome: body.nome,
      role: body.role || 'user'
    })

  if (insertError) {
    console.error('Erro ao inserir perfil em public.usuarios:', insertError.message)
  }

  return { success: true }
})
