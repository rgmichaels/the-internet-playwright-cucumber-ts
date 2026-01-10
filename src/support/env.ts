import 'dotenv/config';

export function isHeadless(): boolean {
  const raw = (process.env.HEADLESS ?? 'true').toLowerCase();
  return !(raw === 'false' || raw === '0' || raw === 'no');
}

export function browserName(): 'chromium' | 'firefox' | 'webkit' {
  const b = (process.env.BROWSER ?? 'chromium').toLowerCase();
  if (b === 'firefox' || b === 'webkit' || b === 'chromium') return b;
  return 'chromium';
}
