export const registerServiceWorker = async () => {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported');
    return null;
  }

  try {
    console.log('Starting Service Worker registration...');

    // Unregister any existing service workers
    const existingRegistrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      existingRegistrations.map((reg: ServiceWorkerRegistration) => reg.unregister())
    );

    // Register new service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });

    console.log('Service Worker registered successfully', registration);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every minute

    return registration;

  } catch (error) {
    console.error(
      'Failed to register Service Worker:',
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
};



