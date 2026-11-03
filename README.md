# Class Deadline Hub

Cổng web deadline của lớp (BTTH 3 – Lập trình web nâng cao). Next.js 16 (App Router), NextAuth v5 (Credentials + GitHub, JWT), Tailwind, dữ liệu lưu bằng file JSON phía server (`data/deadlines.json`).

## Cách chạy

```bash
pnpm install
cp .env.example .env.local   # đặt AUTH_SECRET (openssl rand -base64 32); AUTH_GITHUB_ID/SECRET nếu dùng GitHub
pnpm dev                     # http://localhost:3000
pnpm build && pnpm start     # bản production (dùng để đo Lighthouse)
pnpm test                    # Jest cho can()
```

| Email | Mật khẩu | Vai trò |
|---|---|---|
| admin@ptit.edu.vn | admin123 | admin |
| sv@ptit.edu.vn | sv123456 | user |

Biến môi trường tuỳ chọn: `NEXT_PUBLIC_SITE_URL` (URL gốc cho sitemap/OG), `ADMIN_EMAILS` (email GitHub được làm admin).

## Chiến lược render từng route

Kết quả `pnpm build` (Next.js 16.0.10):

```text
Route (app)                                 Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /403
├ ƒ /admin
├ ƒ /api/auth/[...nextauth]
├ ƒ /dashboard
├ ƒ /dashboard/done
├ ○ /deadlines                                      1m      1y
├ ● /deadlines/[id]                                 1h      1y
│ ├ /deadlines/8                                    1h      1y
│ ├ /deadlines/4                                    1h      1y
│ ├ /deadlines/3                                    1h      1y
│ └ [+9 more paths]
├ ƒ /deadlines/[id]/opengraph-image-104vc5
├ ƒ /login
├ ○ /robots.txt
├ ○ /sitemap.xml
└ ● /subjects/[slug]
  ├ /subjects/lap-trinh-web-nang-cao
  ├ /subjects/co-so-du-lieu
  ├ /subjects/mang-may-tinh
  └ /subjects/cong-nghe-phan-mem

ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

![Kết quả pnpm build](docs/build.png)

Chú thích: `○` = tĩnh (SSG, hoặc ISR nếu có cột Revalidate), `●` = SSG theo `generateStaticParams`, `ƒ` = SSR theo từng request.

| Route | Truy cập | Chiến lược | Lý do |
|---|---|---|---|
| `/` | Mọi người | SSG | Nội dung công khai, ít đổi; nhanh nhất, tốt cho SEO |
| `/subjects/[slug]` | Mọi người | SSG (`generateStaticParams`, `dynamicParams=false`) | Chỉ có 4 môn biết trước lúc build |
| `/deadlines` | Mọi người | ISR `revalidate = 60` | Danh sách thay đổi khi admin sửa, trễ tối đa 60s là chấp nhận được |
| `/deadlines/[id]` | Mọi người | ISR + `revalidatePath` | Tĩnh để nhanh/SEO nhưng cập nhật ngay khi admin thêm/xoá |
| `/dashboard` | Đã đăng nhập | SSR (`force-dynamic`) | Phụ thuộc người dùng (session, trạng thái đã xong) |
| `/admin` | Admin | SSR | Cần kiểm tra quyền theo từng request |

Id không tồn tại → `notFound()` → trang 404 của dự án. Header công khai là Server Component tĩnh, phần trạng thái đăng nhập là Client Component (`useSession`) để không biến trang công khai thành dynamic.

## Xác thực & phân quyền

- Ma trận phân quyền duy nhất: `app/lib/permissions.ts` → `can(role, action)`.
- Lớp 1: `proxy.ts` + `auth.config.ts` (chưa đăng nhập → `/login?callbackUrl=…`; user vào `/admin` → `/403`).
- Lớp 2: `/admin` và layout `(app)` tự gọi `auth()`.
- Lớp 3: mọi Server Action (`app/lib/actions.ts`) tự `auth()` → `can()` → validate zod.

## SEO

Metadata động + ảnh OG sinh động cho `/deadlines/[id]`, JSON-LD `BreadcrumbList`, `sitemap.xml` (mọi deadline), `robots.txt` (chặn `/dashboard`, `/admin`), `noindex` (meta robots) cho `/login`, `/dashboard`, `/admin`, `next/font` (Be Vietnam Pro, subset vietnamese), `next/image`.

## Lighthouse (bản production)

Đo bằng Lighthouse CLI (Chrome headless) trên bản production `pnpm build && pnpm start`, 2 chế độ:

| Trang | Thiết bị | Performance | Accessibility | Best Practices | SEO | LCP |
|---|---|---|---|---|---|---|
| `/` | Mobile | 94 | 96 | 96 | 100 | 3.1 s |
| `/` | Desktop | 100 | 96 | 96 | 100 | 0.2 s |
| `/deadlines/1` | Mobile | 100 | 95 | 96 | 100 | 0.8 s |
| `/deadlines/1` | Desktop | 100 | 95 | 96 | 100 | 0.2 s |

Điểm có thể lệch vài điểm giữa các lần đo.

Đo lại bằng Chrome DevTools (tab Lighthouse, desktop, chưa đăng nhập) trên bản production:

| Trang | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/deadlines/1` | 100 | 95 | 100 | 100 |
| `/deadlines` | 100 | 96 | 100 | 100 |

![Lighthouse /deadlines/1](docs/lighthouse-deadline-1.webp)

![Lighthouse /deadlines](docs/lighthouse-deadlines.webp)

## View-source `/deadlines/1`

![view-source /deadlines/1](docs/view-source.png)

HTML do server trả về cho `/deadlines/1` (trích từ `view-source`): tiêu đề, metadata, ảnh OG, JSON-LD và nội dung đã có sẵn trong HTML, không cần chạy JavaScript.

```html
<title>BTTH 3: Xây dựng Class Deadline Hub | Class Deadline Hub</title>
<meta name="description" content="Lập trình web nâng cao · Hạn nộp 23:59 20 thg 11, 2026. Xây dựng cổng deadline của lớp bằng Next.js: SSG, ISR, SSR, NextAuth, middleware và SEO."/>
<link rel="canonical" href="http://localhost:3000/deadlines/1"/>
<meta property="og:title" content="BTTH 3: Xây dựng Class Deadline Hub"/>
<meta property="og:image" content="http://localhost:3000/deadlines/1/opengraph-image-104vc5?331ea3b0b47928a2"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:type" content="article"/>
<meta name="twitter:card" content="summary_large_image"/>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Trang chủ","item":"http://localhost:3000"},{"@type":"ListItem","position":2,"name":"Deadline","item":"http://localhost:3000/deadlines"},{"@type":"ListItem","position":3,"name":"BTTH 3: Xây dựng Class Deadline Hub","item":"http://localhost:3000/deadlines/1"}]}</script>
<h1 class="text-3xl font-bold">BTTH 3: Xây dựng Class Deadline Hub</h1>
```

## Trả lời câu hỏi

**1. Vì sao `/deadlines/[id]` dùng ISR?**
Trang công khai, nội dung ít đổi nhưng cần SEO và tốc độ như trang tĩnh. SSR tốn tài nguyên và chậm do render mỗi request; SSG thuần thì không cập nhật khi admin thêm/xoá nếu không build lại. ISR cho HTML tĩnh phục vụ từ cache, đồng thời `revalidatePath` trong Server Action làm mới trang ngay khi dữ liệu đổi (id mới được sinh theo yêu cầu, id đã xoá trả 404).

**2. Nếu chỉ dùng Middleware để bảo vệ `/admin` thì có rủi ro gì?**
- Middleware có thể bị vượt qua: lỗi như CVE-2025-29927 (header `x-middleware-subrequest`), `matcher` sai/thiếu đường dẫn.
- Server Action là endpoint POST có thể bị gọi trực tiếp, không đi qua trang `/admin`, nên nếu action không tự kiểm tra thì user thường vẫn thêm/xoá được.
- Middleware chỉ dựa vào JWT; vai trò có thể đã thay đổi mà token chưa hết hạn.
→ Phải kiểm tra quyền lại ở trang và trong từng Server Action (defense in depth).

## Điểm cộng

- Jest test cho `can()`: `app/lib/permissions.test.ts` (13 test).
- GitHub OAuth: callback `http://localhost:3000/api/auth/callback/github`.
- Deploy Vercel: đặt `AUTH_SECRET`, `AUTH_GITHUB_ID/SECRET`, `NEXT_PUBLIC_SITE_URL`. Lưu ý: Vercel không ghi bền vào file hệ thống, nên thêm/xoá/đánh dấu trên bản deploy chỉ lưu tạm (`/tmp`); lưu bền cần chạy `pnpm start` ở local hoặc dùng DB.
