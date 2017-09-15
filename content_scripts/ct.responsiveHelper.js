(function() {
  var $ = window.wrappedJSObject.$;
  var btVersion = null;
  var $domContainer = null;

  /**
   * List of known bt plugins
   */
  const btPlugins = [
    'alert',
    'button',
    'carousel',
    'collapse',
    'dropdown',
    'modal',
    'scrollSpy',
    'tab',
    'tooltip',
    'popover',
    'affix', // v3
  ];

  const btClassesByVersion = {
    3:  [
      {
        size: 'xs',
        cls: 'visible-xs-block',
      },
      {
        size: 'sm',
        cls: 'visible-sm-block',
      },
      {
        size: 'md',
        cls: 'visible-md-block',
      },
      {
        size: 'lg',
        cls: 'visible-lg-block',
      },
    ],
    // Order matter!!
    4:  [
      {
        size: 'xl',
        cls: 'd-none d-xl-block',
      },
      {
        size: 'lg',
        cls: 'd-none d-lg-block',
      },
      {
        size: 'md',
        cls: 'd-none d-md-block',
      },
      {
        size: 'sm',
        cls: 'd-none d-sm-block',
      },
      {
        size: 'xs',
        cls: 'd-none d-block',
      }
    ]
  };

  function isBtActive() {
    return btVersion !== null;
  }

  function extractMajorVersion(version = '') {
    return parseInt(version.split('.')[0], 10);
  }

  function getBootstrapVersion() {
    try {
      for (let pluginName of btPlugins) {
        if (!(pluginName in $.fn)) continue;
        return extractMajorVersion($.fn[pluginName].Constructor.VERSION);
      }
    } catch (error) {
    }
    return null;
  }

  function insertDom() {
    if (!isBtActive()) {
      return null;
    }
    if (!(btVersion in btClassesByVersion)) {
      console.warn(`version ${btVersion} not handled`);
      return null;
    }
    var html = `<div class="ff-ext--bootstrapResponsiveHelper" style="width: 0px; height: 0px;">`;
    const btTestedVersion = btClassesByVersion[btVersion];
    html += btTestedVersion.map(btCls => `<div class="${btCls.cls}"></div>`).join('');
    html += '</div>';
    $container = $(html);
    $(document.body).append($container);
    return $container;
  }

  function isActive(cls, visible) {
    return $(`.${cls}`, $container).is(visible ? ':visible' : ':hidden');
  }

  function clsToSelector(cls) {
    return cls.split(' ').map(cls => `.${cls}`).join('');
  }

  function getResponsiveClass() {
    if (!isBtActive()) {
      return null;
    }
    const btTestedVersion = btClassesByVersion[btVersion];
    for (let btCls of btTestedVersion) {
      if ($(clsToSelector(btCls.cls), $container).is(':visible')) return btCls.size;
    }
    return null;
  }

  function sendMessage() {
    browser.runtime.sendMessage({
      bootstrapActive: isBtActive(),
      responsiveClass: getResponsiveClass()
    });
  }

  window.addEventListener("resize", resizeThrottler, false);

  // Inspired by: https://developer.mozilla.org/en-US/docs/Web/Events/resize
  var resizeTimeout;
  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        sendMessage();
       // Will execute at a rate of 15fps
       }, 66);
    }
  }
  btVersion = getBootstrapVersion();
  if (isBtActive()) {
    $domContainer = insertDom();
  }
  sendMessage();
}());
