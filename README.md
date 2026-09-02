# UB. Studio Platform v3.0

Site cinematográfico + catálogo administrável + upload de artes + login + Supabase.

## 1. Rodar localmente

```bash
python -m http.server 8080
```
Abra http://localhost:8080

Sem configuração, o site público funciona em modo demonstração.

## 2. Ativar o Studio Manager

1. Crie um projeto no Supabase.
2. No SQL Editor, execute `supabase/schema.sql`.
3. Em Authentication > Users, crie o usuário administrador.
4. Edite `js/config.js` e informe a URL e a chave anon do projeto.
5. Abra `/admin.html`.

**Segurança:** a chave `anon` é própria para frontend. Nunca coloque a `service_role` no navegador.

## 3. O que o painel faz

- Login com Supabase Auth
- Criar projeto
- Upload PNG/JPG/WebP
- Nome, ano, divisão, cor e descrição
- Destaque
- Publicar/ocultar
- Editar
- Excluir
- Site público lê automaticamente o catálogo publicado

## 4. Produção

Para um lançamento real, recomendo:
- substituir Tailwind CDN por build do Tailwind/PostCSS;
- adicionar domínio e HTTPS;
- configurar política de administradores mais restrita (role/claim em vez de qualquer usuário autenticado);
- adicionar compressão/transformação de imagens;
- configurar Open Graph image, sitemap.xml e robots.txt;
- trocar e-mails/links placeholder;
- ativar logs e backups do Supabase.
