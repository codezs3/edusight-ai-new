import { useState, useEffect } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
  error: string | null;
}

interface ServiceWorkerActions {
  register: () => Promise<void>;
  update: () => Promise<void>;
  skipWaiting: () => void;
  clearCache: (cacheName?: string) => Promise<void>;
  getCacheInfo: () => Promise<any>;
}

export function useServiceWorker(): ServiceWorkerState & ServiceWorkerActions {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isInstalling: false,
    isWaiting: false,
    isUpdateAvailable: false,
    registration: null,
    error: null,
  });

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      setState(prev => ({ ...prev, isSupported: true }));
      
      // Auto-register on mount
      register();
    } else {
      setState(prev => ({ 
        ...prev, 
        error: 'Service Workers not supported in this browser' 
      }));
    }
  }, []);

  const register = async (): Promise<void> => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Workers not supported');
    }

    try {
      setState(prev => ({ ...prev, isInstalling: true, error: null }));

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered:', registration);

      // Handle different states
      if (registration.installing) {
        console.log('Service Worker installing...');
        trackInstallProgress(registration.installing);
      } else if (registration.waiting) {
        console.log('Service Worker waiting...');
        setState(prev => ({ 
          ...prev, 
          isWaiting: true, 
          isUpdateAvailable: true,
          registration 
        }));
      } else if (registration.active) {
        console.log('Service Worker active');
        setState(prev => ({ 
          ...prev, 
          isRegistered: true, 
          isInstalling: false,
          registration 
        }));
      }

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        console.log('Service Worker update found');
        const newWorker = registration.installing;
        
        if (newWorker) {
          trackInstallProgress(newWorker);
        }
      });

      // Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed');
        window.location.reload();
      });

      setState(prev => ({ 
        ...prev, 
        isRegistered: true, 
        isInstalling: false,
        registration 
      }));

    } catch (error) {
      console.error('Service Worker registration failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isInstalling: false 
      }));
      throw error;
    }
  };

  const trackInstallProgress = (worker: ServiceWorker) => {
    worker.addEventListener('statechange', () => {
      console.log('Service Worker state changed:', worker.state);
      
      switch (worker.state) {
        case 'installed':
          if (navigator.serviceWorker.controller) {
            // New update available
            setState(prev => ({ 
              ...prev, 
              isWaiting: true, 
              isUpdateAvailable: true,
              isInstalling: false 
            }));
          } else {
            // First install
            setState(prev => ({ 
              ...prev, 
              isRegistered: true, 
              isInstalling: false 
            }));
          }
          break;
          
        case 'activated':
          setState(prev => ({ 
            ...prev, 
            isWaiting: false, 
            isUpdateAvailable: false 
          }));
          break;
      }
    });
  };

  const update = async (): Promise<void> => {
    if (!state.registration) {
      throw new Error('No service worker registration found');
    }

    try {
      await state.registration.update();
      console.log('Service Worker update check completed');
    } catch (error) {
      console.error('Service Worker update failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: `Update failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
      throw error;
    }
  };

  const skipWaiting = (): void => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const clearCache = async (cacheName?: string): Promise<void> => {
    if (!state.registration?.active) {
      throw new Error('No active service worker');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve();
        }
      };

      state.registration.active!.postMessage(
        { 
          type: 'CLEAR_CACHE', 
          payload: { cacheName } 
        },
        [messageChannel.port2]
      );
    });
  };

  const getCacheInfo = async (): Promise<any> => {
    if (!state.registration?.active) {
      throw new Error('No active service worker');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data);
        }
      };

      state.registration.active!.postMessage(
        { type: 'GET_CACHE_INFO' },
        [messageChannel.port2]
      );
    });
  };

  return {
    ...state,
    register,
    update,
    skipWaiting,
    clearCache,
    getCacheInfo,
  };
}
