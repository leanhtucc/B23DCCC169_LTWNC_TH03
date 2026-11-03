import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDeadlinesBySubject, getSubject, getSubjects } from '@/app/lib/db';
import DeadlineFilter from '@/app/ui/deadline-filter';

// SSG: các slug được biết trước khi build, slug khác trả 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getSubjects()).map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubject(slug);
  if (!subject) return {};
  return {
    title: subject.name,
    description: `Danh sách deadline môn ${subject.name} (${subject.teacher}).`,
    alternates: { canonical: `/subjects/${slug}` },
  };
}

export default async function SubjectPage({ params }: Props) {
  const { slug } = await params;
  const subject = await getSubject(slug);
  if (!subject) notFound();
  const deadlines = await getDeadlinesBySubject(slug);

  return (
    <div>
      <h1 className="text-2xl font-bold">{subject.name}</h1>
      <p className="mb-6 text-gray-500">Giảng viên: {subject.teacher}</p>
      <DeadlineFilter deadlines={deadlines} subjects={[subject]} />
    </div>
  );
}
