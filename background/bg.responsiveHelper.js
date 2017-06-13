const TITLE = "Bootstrap - Responsible Helper";

function updateIcon(params) {
  let icon = null;
  if (!params.bootstrapActive) {
    return;
  } else if (params.viewportWidth < 768) {
    icon = '/icons/size_xs.svg';
  } else if (params.viewportWidth >= 1200) {
    icon = '/icons/size_lg.svg';
  } else if (params.viewportWidth >= 992) {
    icon = '/icons/size_md.svg';
  } else if (params.viewportWidth >= 768) {
    icon = '/icons/size_sm.svg';
  } else {
    return;
  }
  browser.pageAction.show(params.tabId);
  browser.pageAction.setIcon({tabId: params.tabId, path: icon });
  browser.pageAction.setTitle({tabId: params.tabId, title: TITLE });
}

function onContentScriptNotification(message, context) {
  updateIcon({
    bootstrapActive: message.bootstrapActive,
    viewportWidth: message.viewportWidth,
    tabId: context.tab.id
  });
}

browser.runtime.onMessage.addListener(onContentScriptNotification);
