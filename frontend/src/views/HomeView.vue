<script setup></script>

<template>
  <div class="landing">
    <main class="hero">
      <div class="hero-glow"></div>
      <div class="hero-content">
        <span class="hero-badge">Coming Soon</span>
        <h1 class="hero-title">
          MeowMeow<span class="hero-highlight">Pay</span>
        </h1>
        <p class="hero-subtitle">Something purrfect is on the way.</p>
        <div class="hero-cat">🐾</div>
      </div>
    </main>

    <footer class="footer">
      <p>&copy; 2026 MeowMeowPay</p>
    </footer>
  </div>
</template>

<style scoped>
.landing {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ── Hero ── */
.hero {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: var(--space-8);
}

.hero-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    hsla(260, 65%, 58%, 0.12) 0%,
    hsla(340, 82%, 62%, 0.06) 40%,
    transparent 70%
  );
  filter: blur(60px);
  pointer-events: none;
  animation: glow-pulse 6s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-primary-light);
  background: hsla(260, 65%, 58%, 0.1);
  border: 1px solid hsla(260, 65%, 58%, 0.2);
  margin-bottom: var(--space-8);
  letter-spacing: 0.05em;
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: var(--space-6);
}

.hero-highlight {
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-accent)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
  max-width: 480px;
  margin: 0 auto var(--space-12);
}

.hero-cat {
  font-size: 3rem;
  animation: paw-bounce 2s ease-in-out infinite;
}

@keyframes paw-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* ── Footer ── */
.footer {
  padding: var(--space-6) var(--space-8);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  border-top: 1px solid var(--color-border);
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .hero-title {
    font-size: var(--font-size-3xl);
  }
  .hero-subtitle {
    font-size: var(--font-size-base);
  }
}
</style>
