const TITLE = 'Bootstrap - Responsible Helper';

const defaultSettings = {
  hideIconWhenNonActive: true,
  xs: '#dd4b39',
  sm: '#f39c12',
  md: '#00c0ef',
  lg: '#0073b7',
  xl: '#800080',
};

function onError(e) {
  console.error(e);
}

function checkStoredSettings(storedSettings) {
  return new Promise((resolve, reject) => {
    if (!Object.keys(storedSettings).length) {
      // Set settings by default
      browser.storage.local.set(defaultSettings)
        .then(() => resolve(defaultSettings))
        .catch(reject);
      return;
    }
    resolve(storedSettings);
  });
}

function updateIcon(params) {
  let icon = null;
  let title = TITLE;
  if (!params.responsiveClass) {
    if (params.storedSettings.hideIconWhenNonActive) {
      browser.browserAction.disable(params.tabId);
      return;
    }
    title += ' (Bootstrap is not detected)'
  }
  let text = String(params.responsiveClass).toUpperCase() || 'N/A';
  browser.browserAction.enable(params.tabId);
  browser.browserAction.setBadgeText({
    tabId: params.tabId,
    text: text,
  });
  browser.browserAction.setBadgeBackgroundColor({
    color: params.storedSettings[params.responsiveClass] || '#fff' },
  );
  
  browser.browserAction.setTitle({
    tabId: params.tabId,
    title: title,
  });
}

function onContentScriptNotification(message, context) {
  browser.storage.local.get()
    .then(checkStoredSettings)
    .then((storedSettings) => updateIcon({
      bootstrapActive: message.bootstrapActive,
      responsiveClass: message.responsiveClass,
      tabId: context.tab.id,
      storedSettings: storedSettings
    }))
    .catch(onError);
}

browser.runtime.onMessage.addListener(onContentScriptNotification);
