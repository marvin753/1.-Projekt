import { registerSW } from 'virtual:pwa-register';

export const registerServiceWorker = () => {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('Update available');
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
    onRegistered() {
      console.log('Service Worker registered');
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error);
    }
  });

  return updateSW;
};



