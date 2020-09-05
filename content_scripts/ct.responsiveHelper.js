(function() {
  const CONTAINER_CLS = 'ff-ext--bootstrapResponsiveHelper';
  const CONTAINER_SELECTOR = `.${CONTAINER_CLS}`;
  const ATTR_TAG = 'attr-tag';
  const ATTR_VERSION = 'attr-version';

  // Get all bootstrap4 breakpoints from :root style
  function getBreakpoints4() {
    const searchStr = '--breakpoint-';

    // Get all computed :root style properties
    const style = getComputedStyle( document.documentElement );

    // Loop properties and filter breakpoints
    // Return array of objects, eg: [{ key: 'xl', val: 1200 }]
    let lastEmpty = false;
    let bps = [...Array(1000).keys()].reduce( ( bps, i ) => {
      if ( lastEmpty )  // Bail out if last entry was already empty.
        return bps;

      const key = style.item( i );

      if ( ! key.length ) { // Bail out if entry is  empty.
        lastEmpty = true;
        return bps;
      }

      if ( ! key.startsWith( searchStr ) ) { // Filter breakpoint properties
        return bps;
      }

      return [
        ...bps,
        {
          key: key.replace( searchStr, '' ),
          val: parseInt( style.getPropertyValue( key ).trim().replace( 'px', '' ) ),
        }
      ]
      }, [] );

      // Sort breakpoints from large to small.
      bps.sort( ( a, b ) => {
        if ( a.val > b.val ) {
          return -1;
        }
        if ( a.val < b.val ) {
          return 1;
        }
        return 0;
      } );

      // Build the breakpoint config objects.
      return [...bps].map( ( bp, i ) => bps.length === i + 1
      ? { tag: bp.key, version: '4', cls: 'd-none d-block' }
      : { tag: bp.key, version: '4', cls: 'd-none d-' + bp.key + '-block' }
      );
  }

  function removeOldDOM() {
    const oldContainer = document.querySelector(CONTAINER_SELECTOR);
    if (oldContainer) {
      oldContainer.remove();
    }
  }

  function insertDOM() {
    var elements = [
      { tag: 'lg', version: '3', cls: 'visible-lg-block' },
      { tag: 'md', version: '3', cls: 'visible-md-block' },
      { tag: 'sm', version: '3', cls: 'visible-sm-block' },
      { tag: 'xs', version: '3', cls: 'visible-xs-block' },
      ...getBreakpoints4(),
    ];

    var container = document.createElement('div');
    container.className = CONTAINER_CLS;
    elements.forEach(({ tag, version, cls }) => {
      const element = document.createElement('div');
      element.className = cls;
      element.setAttribute(ATTR_TAG, tag);
      element.setAttribute(ATTR_VERSION, version);
      container.append(element);
    })
    document.body.append(container);
  }

  const isActive = (computedStyle) => computedStyle['box-sizing'] === 'border-box' && computedStyle.display === 'block';

  function getResponsiveClass() {
    const children = Array.from(window.document.querySelector(CONTAINER_SELECTOR).children);
    let lastActive = null;
    let current = {};
    for (let child of children) {
      const computedStyle = window.getComputedStyle(child, null);
      current = {
        tag: child.getAttribute(ATTR_TAG),
        version: child.getAttribute(ATTR_VERSION),
      };
      if (lastActive) {
        if (lastActive.version !== current.version || current.version === '4' ? isActive(computedStyle) : !isActive(computedStyle)) {
          return lastActive.tag;
        }
      } else if (isActive(computedStyle)) {
        lastActive = current;
        continue;
      }
      lastActive = null;
    }
    return lastActive ? lastActive.tag : null;
  }

  function sendMessage() {
    browser.runtime.sendMessage({
      responsiveClass: getResponsiveClass(),
    });
  }

  window.addEventListener('resize', resizeThrottler, false);

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
  removeOldDOM();
  insertDOM();
  sendMessage();
}());
