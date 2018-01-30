const TITLE = 'Bootstrap - Responsible Helper';

const defaultSettings = {
  hideExtensionIcon: false,
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
  if (params.storedSettings.hideExtensionIcon) {
    browser.browserAction.setIcon({
      path: 'icons/icon-transparent.png',
      tabId: params.tabId
    })
  }
  if (!params.responsiveClass) {
    browser.browserAction.disable(params.tabId);
    return;
  }
  const text = String(params.responsiveClass).toUpperCase() || '?';
  const color = params.storedSettings[params.responsiveClass] || '#000000'
  browser.browserAction.enable(params.tabId);
  browser.browserAction.setBadgeBackgroundColor({
    color: color,
  });
  browser.browserAction.setBadgeText({
    tabId: params.tabId,
    text: text,
  });
  browser.browserAction.setTitle({
    tabId: params.tabId,
    title: TITLE,
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
