const defaultSettings = {
  hideExtensionIcon: false,
  xs: '#dd4b39',
  sm: '#f39c12',
  md: '#00c0ef',
  lg: '#0073b7',
  xl: '#800080',
};

const settings = {
  hideExtensionIcon: {
    el: document.getElementById('hideExtensionIcon'),
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
        for (let key of Object.keys(settings)) {
          settings[key].set(res[key]);
        }
        resolve();
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

function resetOptionsToDefault() {
  browser.storage.local.set(defaultSettings)
    .then(() => {
      removeListeners();
      start();
    })
    .catch(onError);
}

function onResetOptions() {
  if (window.confirm("Clicking `Ok` will reset the options to default.")) resetOptionsToDefault();
}

function initListeners() {
  for (let key of Object.keys(settings)) {
    settings[key].el.addEventListener('change', onChange);
  }
  document.getElementById('resetOptions').addEventListener('click', onResetOptions);
}

function removeListeners() {
  for (let key of Object.keys(settings)) {
    settings[key].el.removeEventListener('change', onChange);
  }
  document.getElementById('resetOptions').removeEventListener('click', onResetOptions);
}

function start() {
  initUi()
    .then(initListeners)
    .catch(onError)
  ;
}
start();

