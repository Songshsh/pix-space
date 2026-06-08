<template>
  <div class="status-page">
    <StarryBackground :hide-comets="true" />
    <div class="container">
      <div class="header">
        <h1>{{ code }}</h1>
        <p>{{ description }}</p>
      </div>
      <div class="action-area">
        <el-button
          type="primary"
          size="large"
          class="back-btn"
          @click="emit('back')"
        >
          {{ buttonText }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StarryBackground from './StarryBackground.vue';

defineProps<{
  code: string;
  description: string;
  buttonText?: string;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
}>();
</script>

<style scoped>
.status-page {
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
}

.container {
  position: relative;
  z-index: var(--ds-z-local);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: var(--ds-space-7);
}

.header {
  text-align: center;
  margin-bottom: var(--ds-space-9);
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
  padding: 0 var(--ds-space-8);
  font-size: 1.1rem;
  height: 3.5rem;
  border-radius: var(--ds-radius-2);
  background: linear-gradient(
    135deg,
    var(--ds-color-brand-primary) 0%,
    var(--ds-color-brand-primary-dark) 100%
  );
  border: none;
  box-shadow: var(--ds-shadow-3);
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--ds-shadow-4);
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
