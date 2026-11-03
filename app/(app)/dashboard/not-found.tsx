import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div className="py-12 text-center">
      <h2 className="text-xl font-bold">Không tìm thấy nội dung trong dashboard</h2>
      <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">
        Về Dashboard
      </Link>
    </div>
  );
}
