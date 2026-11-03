'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-12 text-center">
      <h2 className="text-xl font-bold">Không tải được dashboard</h2>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-400"
      >
        Thử lại
      </button>
    </div>
  );
}
