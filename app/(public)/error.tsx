'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-bold">Đã có lỗi xảy ra</h2>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-400"
      >
        Thử lại
      </button>
    </div>
  );
}
