<template>
  <div class="not-found-page">
    <StarryBackground :hide-comets="true" />
    <div class="container">
      <div class="header">
        <h1>404</h1>
        <p>抱歉，您探索的像素空间不存在或已被移除</p>
      </div>
      <div class="action-area">
        <el-button
          type="primary"
          size="large"
          class="back-btn"
          @click="handleGoBack"
        >
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import StarryBackground from '../../components/StarryBackground.vue';

const router = useRouter();

const handleGoBack = () => {
  router.push('/admin/dashboard');
};
</script>

<style scoped>
.not-found-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    var(--ds-color-space-deep),
    var(--ds-color-space-mid),
    var(--ds-color-space-darker)
  );
  color: var(--ds-color-text-inverse);
  overflow: hidden;
  position: relative;

  --ds-color-starry-accent: var(--ds-color-brand-accent);
  --el-color-primary: var(--ds-color-brand-primary);
  --el-color-primary-dark-2: var(--ds-color-brand-primary-dark);
  --el-color-primary-light-1: color-mix(
    in srgb,
    var(--el-color-primary) 90%,
    white
  );
  --el-color-primary-light-2: color-mix(
    in srgb,
    var(--el-color-primary) 80%,
    white
  );
  --el-color-primary-light-3: color-mix(
    in srgb,
    var(--el-color-primary) 70%,
    white
  );
  --el-color-primary-light-4: color-mix(
    in srgb,
    var(--el-color-primary) 60%,
    white
  );
  --el-color-primary-light-5: color-mix(
    in srgb,
    var(--el-color-primary) 50%,
    white
  );
  --el-color-primary-light-6: color-mix(
    in srgb,
    var(--el-color-primary) 40%,
    white
  );
  --el-color-primary-light-7: color-mix(
    in srgb,
    var(--el-color-primary) 30%,
    white
  );
  --el-color-primary-light-8: color-mix(
    in srgb,
    var(--el-color-primary) 20%,
    white
  );
  --el-color-primary-light-9: color-mix(
    in srgb,
    var(--el-color-primary) 10%,
    white
  );
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: var(--ds-space-6);
}

.header {
  text-align: center;
  margin-bottom: var(--ds-space-8);
  animation: fadeInUp 1s ease-out;
}

.header h1 {
  font-size: 8rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(
    to right,
    var(--ds-color-brand-primary),
    var(--ds-color-brand-primary-dark),
    var(--ds-color-brand-accent)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px
    color-mix(in srgb, var(--ds-color-brand-primary) 50%, transparent);
  letter-spacing: 0.1em;
}

.header p {
  font-size: 1.5rem;
  color: var(--ds-color-text-muted);
  max-width: 800px;
  margin: 0 auto;
}

.action-area {
  animation: fadeInUp 1s ease-out 0.3s both;
}

.back-btn {
  padding: 0 var(--ds-space-7);
  font-size: 1.1rem;
  height: 3.5rem;
  border-radius: var(--ds-radius-2);
  background: linear-gradient(
    135deg,
    var(--ds-color-brand-primary) 0%,
    var(--ds-color-brand-primary-dark) 100%
  );
  border: none;
  box-shadow: 0 4px 15px
    color-mix(in srgb, var(--ds-color-brand-primary) 40%, transparent);
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px
    color-mix(in srgb, var(--ds-color-brand-primary) 60%, transparent);
  background: linear-gradient(
    135deg,
    var(--ds-color-brand-accent) 0%,
    var(--ds-color-brand-primary-dark) 100%
  );
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 5rem;
  }
  .header p {
    font-size: 1.2rem;
  }
}
</style>
