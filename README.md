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

> TODO: chèn ảnh kết quả `pnpm build` tại đây (`docs/build.png`).

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

Metadata động + ảnh OG sinh động cho `/deadlines/[id]`, JSON-LD `BreadcrumbList`, `sitemap.xml` (mọi deadline), `robots.txt` (chặn `/dashboard`, `/admin`, `/login`), `noindex` cho `/login`, `/dashboard`, `/admin`, `next/font` (Be Vietnam Pro, subset vietnamese), `next/image`.

## Lighthouse (bản production)

> TODO: đo bằng Chrome DevTools trên `pnpm start`.

| Trang | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | | | | |
| `/deadlines/1` | | | | |

## View-source `/deadlines/1`

> TODO: chèn ảnh `view-source:` (thấy `<title>`, thẻ OG, JSON-LD và nội dung trong HTML).

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
