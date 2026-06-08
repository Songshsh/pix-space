<template>
  <div class="starry-background" @click="handleClick">
    <div id="stars" class="stars-container">
      <div
        v-for="(star, index) in stars"
        :key="'star-' + index"
        class="star"
        :style="starStyle(star)"
      ></div>
      <div
        v-for="(comet, index) in comets"
        :key="'comet-' + index"
        class="comet"
        :style="cometStyle(comet)"
      ></div>
    </div>

    <div class="nebulae nebula-1"></div>
    <div class="nebulae nebula-2"></div>
    <div class="floating-planet planet-1"></div>
    <div class="floating-planet planet-2"></div>

    <div
      v-for="(burst, index) in burstStars"
      :key="'burst-' + index"
      class="burst-star"
      :style="burstStyle(burst)"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface Star {
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity?: number;
}
interface Comet {
  x: number;
  delay: number;
}
interface BurstStar {
  x: number;
  y: number;
  duration: number;
}

const stars = ref<Star[]>([]);
const comets = ref<Comet[]>([]);
const burstStars = ref<BurstStar[]>([]);

const props = defineProps<{
  hideComets?: boolean;
}>();

const STAR_COUNT = 80;
const COMET_INTERVAL = 3000;

const cometIntervalId = ref<ReturnType<typeof setInterval> | null>(null);
const timeoutIds = new Set<ReturnType<typeof setTimeout>>();

const registerTimeout = (callback: () => void, ms: number) => {
  const id = setTimeout(() => {
    callback();
    timeoutIds.delete(id);
  }, ms);
  timeoutIds.add(id);
};

const starStyle = (star: Star) => {
  return {
    width: `${star.size}px`,
    height: `${star.size}px`,
    left: `${star.x}%`,
    top: `${star.y}%`,
    animationDuration: `${star.duration}s`,
    animationDelay: `${star.delay}s`,
  };
};

const cometStyle = (comet: Comet) => {
  return {
    left: `${comet.x}%`,
    animationDelay: `${comet.delay}s`,
  };
};

const burstStyle = (burst: BurstStar) => {
  return {
    left: `${burst.x}px`,
    top: `${burst.y}px`,
    animationDuration: `${burst.duration}s`,
  };
};

const generateStars = () => {
  const starsArray = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    starsArray.push({
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    });
  }
  stars.value = starsArray;
};

const createComet = () => {
  const comet = {
    x: Math.random() * 100,
    delay: Math.random() * 10,
  };

  comets.value.push(comet);

  registerTimeout(() => {
    const index = comets.value.indexOf(comet);
    if (index > -1) {
      comets.value.splice(index, 1);
    }
  }, 11000);
};

const createBurstStar = (x: number, y: number) => {
  const burst = {
    x,
    y,
    duration: 0.8,
  };

  burstStars.value.push(burst);

  registerTimeout(() => {
    const index = burstStars.value.indexOf(burst);
    if (index > -1) {
      burstStars.value.splice(index, 1);
    }
  }, 800);
};

const triggerBurst = () => {
  for (let i = 0; i < 20; i++) {
    registerTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      createBurstStar(x, y);
    }, i * 50);
  }
};

const handleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('star') || target.classList.contains('comet')) {
    return;
  }

  createBurstStar(event.clientX, event.clientY);
};

onMounted(() => {
  generateStars();

  if (!props.hideComets) {
    for (let i = 0; i < 3; i++) {
      createComet();
    }

    const cometInterval = setInterval(createComet, COMET_INTERVAL);
    cometIntervalId.value = cometInterval;
  }
});

onUnmounted(() => {
  if (cometIntervalId.value) {
    clearInterval(cometIntervalId.value);
  }
  timeoutIds.forEach((id) => clearTimeout(id));
  timeoutIds.clear();
});

defineExpose({
  triggerBurst,
});
</script>

<style scoped>
.starry-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--ds-z-base);
}

.stars-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--ds-z-base);
}

.star {
  position: absolute;
  background-color: var(--ds-color-text-inverse);
  border-radius: 50%;
  animation: twinkle 3s infinite alternate;
  will-change: opacity;
}

.comet {
  position: absolute;
  width: 3px;
  height: 100px;
  background: linear-gradient(
    to right,
    transparent,
    var(--ds-color-overlay-white-bright),
    transparent
  );
  transform-origin: top;
  animation: shoot 10s linear infinite;
}

.burst-star {
  position: fixed;
  width: 8px;
  height: 8px;
  z-index: var(--ds-z-overlay);
  background: radial-gradient(
    circle,
    var(--ds-color-text-inverse),
    var(--ds-color-brand-primary)
  );
  animation: twinkle 0.8s ease-out forwards;
  transform-origin: center;
  pointer-events: none;
}

.nebulae {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  z-index: var(--ds-z-base);
}

.nebula-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    var(--ds-color-brand-primary),
    transparent
  );
  top: 10%;
  left: 10%;
}

.nebula-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    var(--ds-color-brand-primary-dark),
    transparent
  );
  bottom: 10%;
  right: 10%;
}

.floating-planet {
  position: absolute;
  border-radius: 50%;
  z-index: var(--ds-z-base);
  animation: float 20s ease-in-out infinite;
}

.planet-1 {
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle at 30% 30%,
    var(--ds-color-brand-primary),
    var(--ds-color-space-deep)
  );
  top: 20%;
  right: 15%;
  box-shadow: var(--ds-shadow-glow-md);
}

.planet-2 {
  width: 60px;
  height: 60px;
  background: radial-gradient(
    circle at 40% 40%,
    var(--ds-color-brand-accent),
    var(--ds-color-space-deep)
  );
  bottom: 25%;
  left: 15%;
  box-shadow: var(--ds-shadow-glow-sm);
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes shoot {
  0% {
    transform: rotate(45deg) translateY(-100px) translateX(-100px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: rotate(45deg) translateY(100vh) translateX(100vw);
    opacity: 0;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}
</style>
