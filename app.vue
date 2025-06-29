<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SpeedInsights />
    <Analytics />
    <!-- DevTools container to ensure proper rendering -->
    <div id="nuxt-devtools-anchor" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 99998;"></div>
  </div>
</template>

<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Analytics } from '@vercel/analytics/nuxt'

// Ensure DevTools are properly initialized
onMounted(() => {
  // Initial positioning
  const positionDevTools = () => {
    const devToolsElements = document.querySelectorAll('[id^="nuxt-devtools"]');
    devToolsElements.forEach(el => {
      if (el instanceof HTMLElement) {
        // Apply positioning styles
        el.style.position = 'fixed';
        el.style.top = 'auto';
        el.style.bottom = 'auto';
        el.style.left = 'auto';
        el.style.right = 'auto';
        el.style.height = 'auto';
        el.style.maxHeight = 'none';
        el.style.transform = 'none';
        el.style.zIndex = '99999';

        // Control width to prevent it from becoming too wide
        el.style.maxWidth = '100vw';
        el.style.boxSizing = 'border-box';

        // Reset any width that might have been set
        if (el.style.width === '100%') {
          el.style.width = 'auto';
        }

        // Special handling for panel elements
        if (
          el.id.includes('panel') || 
          el.className.includes('panel') || 
          el.tagName.toLowerCase() === 'dialog'
        ) {
          el.style.top = '0';
          el.style.left = '0';
          el.style.right = '0';
          el.style.bottom = '0';
          el.style.width = 'auto';
          el.style.height = '100vh';
          el.style.maxHeight = '100vh';
          el.style.overflow = 'auto';
        }

        // Handle iframes inside DevTools
        const iframes = el.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          iframe.style.position = 'static';
          iframe.style.height = '100%';
          iframe.style.width = 'auto'; // Changed from 100% to auto
          iframe.style.maxHeight = 'none';
          iframe.style.maxWidth = '100%'; // Added max-width constraint
          iframe.style.boxSizing = 'border-box';
        });
      }
    });
  };

  // Force a repaint of the DevTools and ensure proper positioning
  setTimeout(() => {
    const devToolsElements = document.querySelectorAll('[id^="nuxt-devtools"]');
    devToolsElements.forEach(el => {
      if (el instanceof HTMLElement) {
        // First hide the element
        el.style.display = 'none';
        // Force a reflow
        void el.offsetHeight;
        // Show the element again
        el.style.display = '';
      }
    });

    // Apply positioning
    positionDevTools();

    // Apply positioning again after a short delay to ensure it takes effect
    setTimeout(positionDevTools, 500);
  }, 100);

  // Apply positioning periodically to ensure it stays correct
  const interval = setInterval(positionDevTools, 2000);

  // Clean up interval on component unmount
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>
