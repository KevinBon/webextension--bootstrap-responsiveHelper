const TITLE = 'Bootstrap - Responsible Helper';
const defaultSettings = {
  hideIconWhenNonActive: true,
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
  if (!params.bootstrapActive) {
    if (params.storedSettings.hideIconWhenNonActive) {
      browser.pageAction.hide(params.tabId);
      return;
    }
    icon = '/icons/non-active.png';
    title += ' (Bootstrap is not detected)'
  // } else if (params.viewportWidth < 768) {
  //   icon = '/icons/size_xs.svg';
  // } else if (params.viewportWidth >= 1200) {
  //   icon = '/icons/size_lg.svg';
  // } else if (params.viewportWidth >= 992) {
  //   icon = '/icons/size_md.svg';
  // } else if (params.viewportWidth >= 768) {
  //   icon = '/icons/size_sm.svg';
  } else {
    icon = `/icons/size_${params.responsiveClass}.svg`;
  }
  browser.pageAction.show(params.tabId);
  browser.pageAction.setIcon({
    tabId: params.tabId,
    path: icon
  });
  browser.pageAction.setTitle({
    tabId: params.tabId,
    title: title
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
