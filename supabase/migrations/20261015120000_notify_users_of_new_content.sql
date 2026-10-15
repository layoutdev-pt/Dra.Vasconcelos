-- Notificação global de novo conteúdo (cursos, livros, media, blog).
-- Chamada pelo admin via supabase.rpc('notify_users_of_new_content', { payload: { title, message, link } }).
-- Cria uma linha em public.notifications para cada perfil.

create or replace function public.notify_users_of_new_content(payload jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer;
begin
  -- is_current_user_admin() devolve null sem sessão: tratar como não-admin
  if not coalesce(public.is_current_user_admin(), false) then
    raise exception 'Apenas administradores podem enviar notificações'
      using errcode = '42501';
  end if;

  if coalesce(payload->>'title', '') = '' then
    raise exception 'O campo title é obrigatório';
  end if;

  insert into public.notifications (user_id, title, message, link, is_read)
  select p.id, payload->>'title', payload->>'message', payload->>'link', false
  from public.profiles p;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

revoke all on function public.notify_users_of_new_content(jsonb) from public, anon;
grant execute on function public.notify_users_of_new_content(jsonb) to authenticated;
