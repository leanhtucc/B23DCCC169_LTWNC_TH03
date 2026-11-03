import Header from '@/app/ui/header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-8">{children}</main>
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        Class Deadline Hub · PTIT · Bài tập thực hành Lập trình web nâng cao
      </footer>
    </>
  );
}
