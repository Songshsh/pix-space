<script setup lang="ts">
type PageStateVariant =
  | 'loading'
  | 'empty'
  | 'error'
  | 'forbidden'
  | 'notfound';

type PageStateSize = 'page' | 'compact';

const props = withDefaults(
  defineProps<{
    variant: PageStateVariant;
    title?: string;
    description?: string;
    icon?: string;
    primaryText?: string;
    secondaryText?: string;
    size?: PageStateSize;
  }>(),
  {
    title: '',
    description: '',
    icon: '',
    primaryText: '',
    secondaryText: '',
    size: 'page',
  }
);

const emit = defineEmits<{
  primary: [];
  secondary: [];
}>();

const fallbackIconMap: Record<PageStateVariant, string> = {
  loading: '…',
  empty: '○',
  error: '!',
  forbidden: '×',
  notfound: '?',
};

const resolvedIcon = computed(() => {
  return props.icon || fallbackIconMap[props.variant];
});
</script>

<template>
  <div
    class="state-card"
    :class="[`state-card--${props.size}`, `state-card--${props.variant}`]"
  >
    <div class="state-content">
      <div class="state-icon" :class="`state-icon--${props.variant}`">
        <slot name="icon">{{ resolvedIcon }}</slot>
      </div>

      <div v-if="props.title" class="state-title">{{ props.title }}</div>

      <div v-if="props.description || $slots.default" class="state-desc">
        <slot>{{ props.description }}</slot>
      </div>

      <div
        v-if="$slots.actions || props.primaryText || props.secondaryText"
        class="state-actions"
      >
        <slot name="actions">
          <el-button
            v-if="props.primaryText"
            type="primary"
            round
            size="small"
            class="state-button"
            @click="emit('primary')"
          >
            {{ props.primaryText }}
          </el-button>
          <el-button
            v-if="props.secondaryText"
            type="primary"
            link
            class="state-link"
            @click="emit('secondary')"
          >
            {{ props.secondaryText }}
          </el-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.state-card {
  min-height: 360px;
  background-color: var(--ds-color-bg-primary);
  border-radius: var(--ds-radius-3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-card--compact {
  min-height: 280px;
}

.state-card--loading {
  background-color: var(--ds-color-bg-primary);
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
  border-radius: var(--ds-radius-circle);
  background-color: var(--ds-color-bg-secondary);
  color: var(--ds-color-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}

.state-icon--loading {
  color: var(--ds-color-text-secondary);
}

.state-icon--error {
  color: var(--ds-color-danger);
}

.state-icon--forbidden,
.state-icon--notfound {
  color: var(--ds-color-text-secondary);
}

.state-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
  margin-top: var(--ds-space-4);
}

.state-desc {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  margin-top: var(--ds-space-2);
}

.state-actions {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--ds-space-4);
  margin-top: var(--ds-space-6);
}

.state-button {
  min-width: 96px;
  height: 32px;
  font-size: 12px;
  font-weight: 600;
}

.state-link {
  font-size: 12px;
}
</style>
