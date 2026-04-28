<template>
  <div class="forbidden-page">
    <StarryBackground :hide-comets="true" />
    <div class="container">
      <div class="header">
        <h1>403</h1>
        <p>抱歉，您没有权限访问该页面</p>
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
.forbidden-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: 100vh;
  background: linear-gradient(to bottom, #0a0a2a, #1a1a40, #0c0c1e);
  color: #fff;
  overflow: hidden;
  position: relative;
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
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInUp 1s ease-out;
}

.header h1 {
  font-size: 8rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(
    to right,
    var(--ds-color-primary),
    var(--ds-color-primary-dark),
    var(--ds-color-primary-light)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  letter-spacing: 0.1em;
}

.header p {
  font-size: 1.5rem;
  color: #a0a0e0;
  max-width: 800px;
  margin: 0 auto;
}

.action-area {
  animation: fadeInUp 1s ease-out 0.3s both;
}

.back-btn {
  padding: 0 2.5rem;
  font-size: 1.1rem;
  height: 3.5rem;
  border-radius: var(--ds-radius-2);
  background: linear-gradient(
    135deg,
    var(--ds-color-primary) 0%,
    var(--ds-color-primary-dark) 100%
  );
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  background: linear-gradient(135deg, #768df1 0%, #855eb5 100%);
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
