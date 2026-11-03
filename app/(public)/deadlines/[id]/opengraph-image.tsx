import { ImageResponse } from 'next/og';
import { getDeadline, getSubject } from '@/app/lib/db';
import { formatDateTime } from '@/app/lib/utils';

export const alt = 'Chi tiết deadline';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Satori không có glyph tiếng Việt mặc định → tải font Be Vietnam Pro đúng các ký tự cần dùng.
async function loadFont(text: string) {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@700&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return undefined;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return undefined;
  }
}

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deadline = /^\d+$/.test(id) ? await getDeadline(Number(id)) : undefined;
  const subject = deadline ? await getSubject(deadline.subjectSlug) : undefined;

  const title = deadline?.title ?? 'Không tìm thấy deadline';
  const subjectName = subject?.name ?? '';
  const due = deadline ? `Hạn nộp: ${formatDateTime(deadline.dueDate)}` : '';
  const label = 'Class Deadline Hub';

  const font = await loadFont(title + subjectName + due + label);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #0070F3, #2F6FEB)',
          color: 'white',
          fontFamily: font ? 'Be Vietnam Pro' : 'sans-serif',
        }}
      >
        <div style={{ fontSize: 36, opacity: 0.85 }}>{label}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
          <div style={{ fontSize: 36 }}>{subjectName}</div>
        </div>
        <div style={{ fontSize: 40, fontWeight: 700 }}>{due}</div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: 'Be Vietnam Pro', data: font, weight: 700, style: 'normal' }] : undefined,
    },
  );
}
