import React, { createContext, useState, useContext, useEffect } from 'react';

const InstallPromptContext = createContext();

export const InstallPromptProvider = ({ children }) => {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPromptEvent(null); 
      });
    }
  };

  return (
    <InstallPromptContext.Provider value={{ promptInstall, installPromptEvent }}>
      {children}
    </InstallPromptContext.Provider>
  );
};

export const useInstallPrompt = () => useContext(InstallPromptContext);
