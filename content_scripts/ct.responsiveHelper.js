;(function () {
  const CONTAINER_CLS = 'ff-ext--bootstrapResponsiveHelper'
  const CONTAINER_SELECTOR = `.${CONTAINER_CLS}`
  const ATTR_TAG = 'attr-tag'
  const ATTR_VERSION = 'attr-version'

  function removeOldDOM() {
    const oldContainer = document.querySelector(CONTAINER_SELECTOR)
    if (oldContainer) {
      oldContainer.remove()
    }
  }

  function insertDOM() {
    var elements = [
      { tag: 'lg', version: '3', cls: 'visible-lg-block' },
      { tag: 'md', version: '3', cls: 'visible-md-block' },
      { tag: 'sm', version: '3', cls: 'visible-sm-block' },
      { tag: 'xs', version: '3', cls: 'visible-xs-block' },
      { tag: 'lg', version: '4', cls: 'd-none d-lg-block d-xl-none' },
      { tag: 'md', version: '4', cls: 'd-none d-md-block d-lg-none' },
      { tag: 'sm', version: '4', cls: 'd-none d-sm-block d-md-none' },
      { tag: 'xs', version: '4', cls: 'd-block d-sm-none' },
      {
        tag: 'xs',
        version: '5',
        cls: 'd-block d-xxl-none d-xl-none d-lg-none d-md-none d-sm-none',
      },
      {
        tag: 'sm',
        version: '5',
        cls: 'd-none d-sm-block d-xxl-none d-xl-none d-lg-none d-md-none d-xs-none',
      },
      {
        tag: 'md',
        version: '5',
        cls: 'd-none d-md-block d-xxl-none d-xl-none d-lg-none d-sm-none d-xs-none',
      },
      {
        tag: 'lg',
        version: '5',
        cls: 'd-none d-lg-block d-xxl-none d-xl-none d-md-none d-sm-none d-xs-none',
      },
      {
        tag: 'xl',
        version: '5',
        cls: 'd-none d-xl-block d-xxl-none d-lg-none d-md-none d-sm-none d-xs-none',
      },
      {
        tag: 'xxl',
        version: '5',
        cls: 'd-none d-xxl-block d-xl-none d-lg-none d-md-none d-sm-none d-xs-none',
      },
    ]

    var container = document.createElement('div')
    container.className = CONTAINER_CLS
    elements.forEach(({ tag, version, cls }) => {
      const element = document.createElement('div')
      element.className = cls
      element.setAttribute(ATTR_TAG, tag)
      element.setAttribute(ATTR_VERSION, version)
      container.append(element)
    })
    document.body.append(container)
  }

  const isActive = (computedStyle) =>
    computedStyle['box-sizing'] === 'border-box' &&
    computedStyle.display === 'block'

  function getResponsiveClass() {
    const children = Array.from(
      window.document.querySelector(CONTAINER_SELECTOR).children
    )
    let lastActive = null
    let current = {}
    for (let child of children) {
      const computedStyle = window.getComputedStyle(child, null)
      current = {
        tag: child.getAttribute(ATTR_TAG),
        version: child.getAttribute(ATTR_VERSION),
      }
      if (lastActive) {
        if (
          lastActive.version !== current.version || current.version === '4'
            ? isActive(computedStyle)
            : !isActive(computedStyle)
        ) {
          return lastActive.tag
        }
      } else if (isActive(computedStyle)) {
        lastActive = current
        continue
      }
      lastActive = null
    }
    return lastActive ? lastActive.tag : null
  }

  function sendMessage() {
    browser.runtime.sendMessage({
      responsiveClass: getResponsiveClass(),
    })
  }
  window.addEventListener('resize', resizeThrottler, false)

  // Inspired by: https://developer.mozilla.org/en-US/docs/Web/Events/resize
  var resizeTimeout
  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null
        sendMessage()
        // Will execute at a rate of 15fps
      }, 66)
    }
  }
  removeOldDOM()
  insertDOM()
  sendMessage()
})()
