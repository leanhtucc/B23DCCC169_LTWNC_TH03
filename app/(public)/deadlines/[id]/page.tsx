import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDeadline, getDeadlines, getSubject } from '@/app/lib/db';
import { SITE_URL } from '@/app/lib/site';
import { formatDateTime } from '@/app/lib/utils';
import Countdown from '@/app/ui/countdown';

// ISR: dữ liệu được làm mới tức thì bằng revalidatePath khi admin thêm/xoá,
// 3600s là lưới an toàn nếu file JSON bị sửa tay.
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getDeadlines()).map((d) => ({ id: String(d.id) }));
}

type Props = { params: Promise<{ id: string }> };

async function load(idParam: string) {
  if (!/^\d+$/.test(idParam)) return null;
  return (await getDeadline(Number(idParam))) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const deadline = await load(id);
  if (!deadline) return { title: 'Không tìm thấy deadline' };
  const subject = await getSubject(deadline.subjectSlug);
  const description = `${subject?.name ?? ''} · Hạn nộp ${formatDateTime(deadline.dueDate)}. ${deadline.description}`;
  return {
    title: deadline.title,
    description,
    alternates: { canonical: `/deadlines/${id}` },
    openGraph: {
      title: deadline.title,
      description,
      url: `/deadlines/${id}`,
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title: deadline.title, description },
  };
}

export default async function DeadlineDetailPage({ params }: Props) {
  const { id } = await params;
  const deadline = await load(id);
  if (!deadline) notFound();
  const subject = await getSubject(deadline.subjectSlug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Deadline', item: `${SITE_URL}/deadlines` },
      { '@type': 'ListItem', position: 3, name: deadline.title, item: `${SITE_URL}/deadlines/${deadline.id}` },
    ],
  };

  return (
    <article className="space-y-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
        <Link href="/" className="hover:underline">Trang chủ</Link> ›{' '}
        <Link href="/deadlines" className="hover:underline">Deadline</Link> › {deadline.title}
      </nav>
      <h1 className="text-3xl font-bold">{deadline.title}</h1>
      <p className="text-gray-600">
        Môn:{' '}
        {subject ? (
          <Link href={`/subjects/${subject.slug}`} className="text-blue-600 hover:underline">
            {subject.name}
          </Link>
        ) : (
          deadline.subjectSlug
        )}
      </p>
      <p>
        Hạn nộp: <strong>{formatDateTime(deadline.dueDate)}</strong> <Countdown dueDate={deadline.dueDate} />
      </p>
      <p className="rounded-lg border border-gray-200 bg-white p-4">{deadline.description}</p>
    </article>
  );
}
