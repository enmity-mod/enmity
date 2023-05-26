import '@api/assets';
import Core from '@core';
import { Dialog } from '@metro/common';

try {
  // Setup asset handler early to capture most assets then initialize enmity
  Core.initialize();
} catch (error) {
  Dialog.show({
    title: "Error",
    body: `Enmity failed to initialize: ${typeof error === "string" ? error : error.message}`,
    confirmText: "Okay"
  });

  console.error(`Error: \n${error}`);
}

export {};