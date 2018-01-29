const settings = {
  hideIconWhenNonActive: {
    el: document.getElementById('hideIconWhenNonActive'),
    set: function (val) { this.el.checked = val },
    get: function () { return Boolean(this.el.checked) },
  },
  xs: {
    el: document.getElementById('xs'),
    set: function (val) { this.el.value = val },
    get: function () { return String(this.el.value) },
  },
  sm: {
    el: document.getElementById('sm'),
    set: function (val) { this.el.value = val },
    get: function () { String(this.el.value) },
  },
  md: {
    el: document.getElementById('md'),
    set: function (val) { this.el.value = val },
    get: function () { return String(this.el.value) },
  },
  lg: {
    el: document.getElementById('lg'),
    set: function (val) { this.el.value = val },
    get: function () { return String(this.el.value) },
  },
  xl: {
    el: document.getElementById('xl'),
    set: function (val) { this.el.value = val },
    get: function () { return String(this.el.value) },
  },
};

function onError(e) {
  console.error(e);
}

function initUi() {
  return new Promise((resolve, reject) => {
    browser.storage.local.get()
      .then((res) => {
        // let cfg = Object.assign({}, res);
        for (let key of Object.keys(settings)) {
          // const val = !(key in res) ? settings[key].defaultValue : res[key];
          // cfg[key] = val;
          settings[key].set(res[key]);
        }
        // browser.storage.local.set(cfg).then(resolve, onError);
      }, reject);

  });
}

function onChange(e) {
  const key = e.currentTarget.id;
  browser.storage.local.get()
  .then((res) => {
    res[key] = settings[key].get();
    browser.storage.local.set(res).then(null, onError);
    }, onError);
}

function initListeners() {
  for (let key of Object.keys(settings)) {
    settings[key].el.addEventListener('change', onChange);
  }
}

initUi()
  .then(initListeners)
  .catch(onError)
;
