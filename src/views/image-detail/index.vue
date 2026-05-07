<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElButton } from 'element-plus';
import type { Image } from '../../types/image';

const route = useRoute();
const router = useRouter();

type ViewState = 'success' | 'loading' | 'error' | 'forbidden' | 'empty';

const viewState = ref<ViewState>('loading');

const imageId = computed(() => route.params.id as string);

const mockImage: Image = {
  id: imageId.value,
  title: '极简主义 3D 渲染图',
  url: '',
  size: '4.2 MB',
  createdAt: '2026-05-06',
  tags: ['3D渲染', '极简'],
};

const author = {
  name: '作者名称',
};

const imageMeta = {
  dimensions: '3840 x 2160 px',
  format: 'PNG',
  size: '4.2 MB',
};

const handleCollect = () => {
  console.log('Collect image');
};

const handleDownload = () => {
  console.log('Download image');
};

const handleLike = () => {
  console.log('Like image');
};

const handleShare = () => {
  console.log('Share image');
};

const handleRetry = () => {
  viewState.value = 'loading';
  setTimeout(() => {
    viewState.value = 'success';
  }, 1000);
};

const handleBack = () => {
  router.push('/explore');
};

setTimeout(() => {
  viewState.value = 'success';
}, 800);
</script>

<template>
  <div class="image-detail-page">
    <template v-if="viewState === 'success'">
      <div class="detail-card">
        <div class="left-col">
          <div class="main-image">
            <div class="image-placeholder">
              <span>IMAGE_PLACEHOLDER</span>
            </div>
          </div>
        </div>

        <div class="right-col">
          <div class="author-info">
            <div class="author-avatar">A</div>
            <div class="author-content">
              <div class="author-name">{{ author.name }}</div>
              <div class="pub-time">{{ mockImage.createdAt }} 发布</div>
            </div>
          </div>

          <div class="image-title">{{ mockImage.title }}</div>

          <div class="actions">
            <el-button type="primary" class="action-btn" @click="handleCollect">
              采集到画板
            </el-button>
            <div class="action-group">
              <el-button class="action-btn" @click="handleDownload">
                下载
              </el-button>
              <el-button class="action-btn" @click="handleLike"> 赞 </el-button>
              <el-button class="action-btn" @click="handleShare">
                分享
              </el-button>
            </div>
          </div>

          <div class="meta-info">
            <div class="meta-title">图片信息</div>
            <div class="meta-item">尺寸：{{ imageMeta.dimensions }}</div>
            <div class="meta-item">格式：{{ imageMeta.format }}</div>
            <div class="meta-item">大小：{{ imageMeta.size }}</div>
          </div>

          <div class="tags-section">
            <div class="tags-title">标签</div>
            <div class="tags-list">
              <span v-for="tag in mockImage.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="viewState === 'loading'">
      <div class="state-card">
        <div class="state-content">
          <div class="state-icon">…</div>
          <div class="state-desc">加载中</div>
        </div>
      </div>
    </template>

    <template v-else-if="viewState === 'error'">
      <div class="state-card">
        <div class="state-content">
          <div class="state-icon">!</div>
          <div class="state-title">加载失败</div>
          <div class="state-desc">请检查网络后重试</div>
          <div class="state-actions">
            <button class="state-retry" type="button" @click="handleRetry">
              重试
            </button>
            <button class="state-back" type="button" @click="handleBack">
              返回发现
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="viewState === 'forbidden'">
      <div class="state-card">
        <div class="state-content">
          <div class="state-icon">×</div>
          <div class="state-title">暂无访问权限</div>
          <div class="state-desc">该图片为私有，仅作者可见</div>
          <div class="state-actions">
            <button class="state-back" type="button" @click="handleBack">
              返回发现
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="viewState === 'empty'">
      <div class="state-card">
        <div class="state-content">
          <div class="state-icon">?</div>
          <div class="state-title">图片已消失</div>
          <div class="state-desc">该素材可能已被删除或移动</div>
          <div class="state-actions">
            <button class="state-back" type="button" @click="handleBack">
              返回发现
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.image-detail-page {
  width: 100%;
  min-height: calc(100vh - 64px);
}

.detail-card {
  display: flex;
  background-color: #fff;
  border-radius: var(--ds-radius-3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.left-col {
  width: 980px;
  background-color: #fafafa;
  padding: 40px;
  box-sizing: border-box;
}

.main-image {
  width: 900px;
  height: 840px;
  background-color: #eee;
  border-radius: var(--ds-radius-3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 14px;
  color: #999;
}

.right-col {
  width: 412px;
  padding: 32px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  background-color: #d9d9d9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
}

.author-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.pub-time {
  font-size: 12px;
  color: #999;
}

.image-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  line-height: 1.3;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.action-group {
  display: flex;
  gap: 12px;
}

.action-group .action-btn {
  flex: 1;
  height: 40px;
  font-size: 14px;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
}

.meta-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.meta-item {
  font-size: 13px;
  color: #666;
}

.tags-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
}

.tags-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.tags-list {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 8px;
  background-color: #f0f2f5;
  border-radius: 4px;
  font-size: 10px;
  color: #666;
}

.state-card {
  height: 360px;
  background-color: #fff;
  border-radius: var(--ds-radius-3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-content {
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.state-icon {
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: #f0f2f5;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}

.state-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-top: 16px;
}

.state-desc {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.state-actions {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.state-retry {
  height: 32px;
  width: 96px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.state-back {
  background: transparent;
  color: var(--ds-color-primary);
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
}
</style>
