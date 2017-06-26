const hideIconWhenNonActiveEl = document.querySelector('#hideIconWhenNonActive');
const valFormater = {
  bool: function(el) {
    return Boolean(el.checked);
  },
};
const setElementValue = {
  bool: function(el, val) {
    return el.checked = val;
  },
};

function onError(e) {
  console.error(e);
}

function initUi() {
  browser.storage.local.get()
    .then((res) => {
      for (let key of Object.keys(res)) {
        let el = document.querySelector(`form [data-settingKey=${key}]`);
        const type = el.getAttribute('data-settingType');
        setElementValue[type](el, res[key]);
      }
      hideIconWhenNonActiveEl.checked = document.querySelector();
    }, onError);
}

function getFormatedVal(el, type) {
  return valFormater[type](el);
}

function onChange(e) {
  const key = e.currentTarget.getAttribute('data-settingKey');
  const type = e.currentTarget.getAttribute('data-settingType');
  const newSettings = {};
  newSettings[key] = getFormatedVal(e.currentTarget, type);
  browser.storage.local.set(newSettings).then(null, onError);
}

initUi();
hideIconWhenNonActiveEl.addEventListener('change', onChange)
