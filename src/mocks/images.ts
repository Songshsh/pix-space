export function getImagesMock() {
  return [
    {
      id: 1,
      name: '风景照片.jpg',
      url: 'https://picsum.photos/400/300?random=1',
      size: '2.4 MB',
      width: 1920,
      height: 1080,
      format: 'JPG',
      uploadedAt: '2024-01-15 14:30',
      tags: ['风景', '自然'],
    },
    {
      id: 2,
      name: '头像.png',
      url: 'https://picsum.photos/400/300?random=2',
      size: '856 KB',
      width: 800,
      height: 800,
      format: 'PNG',
      uploadedAt: '2024-01-15 13:20',
      tags: ['人物', '头像'],
    },
    {
      id: 3,
      name: '产品图.webp',
      url: 'https://picsum.photos/400/300?random=3',
      size: '1.2 MB',
      width: 1200,
      height: 900,
      format: 'WEBP',
      uploadedAt: '2024-01-14 16:45',
      tags: ['产品', '电商'],
    },
  ];
}
