export function getDashboardMock() {
  return {
    stats: {
      totalImages: 1284,
      totalUsers: 356,
      totalFiles: 4521,
      totalViews: 28945,
    },
    chartData: [
      { label: '周一', value: 65 },
      { label: '周二', value: 78 },
      { label: '周三', value: 52 },
      { label: '周四', value: 88 },
      { label: '周五', value: 95 },
      { label: '周六', value: 42 },
      { label: '周日', value: 35 },
    ],
    recentActivities: [
      {
        content: '用户 张三 上传了 5 张图片',
        time: '10分钟前',
        type: 'primary',
      },
      { content: '系统完成自动备份', time: '1小时前', type: 'success' },
      { content: '新用户 李四 完成注册', time: '2小时前', type: 'info' },
      { content: '文件 "report.pdf" 被下载', time: '3小时前', type: 'warning' },
      { content: '系统设置已更新', time: '5小时前', type: '' },
    ],
    recentUploads: [
      {
        name: 'landscape-001.jpg',
        type: '图片',
        size: '2.4 MB',
        uploader: '张三',
        time: '2024-01-15 14:30',
      },
      {
        name: 'document.pdf',
        type: '文档',
        size: '1.2 MB',
        uploader: '李四',
        time: '2024-01-15 13:20',
      },
      {
        name: 'profile.png',
        type: '图片',
        size: '856 KB',
        uploader: '王五',
        time: '2024-01-15 12:15',
      },
      {
        name: 'video-clip.mp4',
        type: '视频',
        size: '45.6 MB',
        uploader: '张三',
        time: '2024-01-15 11:00',
      },
      {
        name: 'data-export.xlsx',
        type: '表格',
        size: '324 KB',
        uploader: '李四',
        time: '2024-01-15 10:30',
      },
    ],
  };
}
