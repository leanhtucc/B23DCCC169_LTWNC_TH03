export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(iso));
}

const DAY = 24 * 60 * 60 * 1000;

// Còn X ngày / Quá hạn Y ngày
export function describeRemaining(iso: string, now: number) {
  const diff = new Date(iso).getTime() - now;
  if (diff >= 0) {
    return { overdue: false, text: `Còn ${Math.ceil(diff / DAY)} ngày` };
  }
  return { overdue: true, text: `Quá hạn ${Math.max(1, Math.ceil(-diff / DAY))} ngày` };
}
