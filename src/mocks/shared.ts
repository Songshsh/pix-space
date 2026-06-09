export const sampleImages = [
  '/mock-images/sample-01.png',
  '/mock-images/sample-02.png',
  '/mock-images/sample-03.png',
  '/mock-images/sample-04.png',
  '/mock-images/sample-05.png',
  '/mock-images/sample-06.png',
  '/mock-images/sample-07.png',
  '/mock-images/sample-08.png',
  '/mock-images/sample-09.png',
  '/mock-images/sample-10.png',
  '/mock-images/sample-11.png',
  '/mock-images/sample-12.png',
  '/mock-images/sample-13.png',
  '/mock-images/sample-14.png',
  '/mock-images/sample-15.png',
  '/mock-images/sample-16.png',
  '/mock-images/sample-17.png',
  '/mock-images/sample-18.png',
  '/mock-images/sample-19.png',
  '/mock-images/sample-20.png',
];

export function createTimestamp(withTime?: boolean): string {
  const date = new Date();
  const pad = (value: number) => value.toString().padStart(2, '0');
  const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (withTime) {
    return `${base} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  return base;
}
