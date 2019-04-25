window.checkboxesSelect = (function (window) {
  var select = document.querySelector('.checkboxes-select');

  if (!select) {
    return;
  }

  var toggle = select.querySelector('.checkboxes-select__toggle');
  var checkboxesList = select.querySelectorAll('input[type="checkbox"]');
  var valueNode = select.querySelector('.checkboxes-select__value');
  var dropdown = select.querySelector('.checkboxes-select__dropdown');

  var selectName = checkboxesList[0].name;
  var placeholder = select.dataset.placeholder;
  select.dataset.name = selectName;

  displayCheckedValues();

  toggle.addEventListener('click', onclickToggleHandler);
  dropdown.addEventListener('change', onchangeDropdownHandler);

  function onchangeDropdownHandler(evt) {
    var target = evt.target;
    var checkbox = target.closest('input[type="checkbox"]');

    if (!checkbox) {
      return;
    }

    var value = checkbox.value;
    var isChecked = checkbox.checked;

    if (value === 'all') {
      if (isChecked) {
        checkAll();
      } else {
        uncheckAll();
      }
    } else {
      if (isCheckAll(checkboxesList)) {
        checkItemValueAll();
      } else {
        uncheckItemValueAll();
      }
    }

    displayCheckedValues();
  }

  function onclickToggleHandler(evt) {
    evt.preventDefault();

    var isSelectOpen = select.classList.contains('checkboxes-select--open');

    if (!isSelectOpen) {
      openSelect();
    } else {
      closeSelect();
    }
  }

  function onclickWindowHandler(evt) {
    var target = evt.target;
    var targetSelect = target.closest('.checkboxes-select');

    if (!targetSelect) {
      closeSelect();
    }
  }

  // Methods

  function isCheckAll(checkboxesList) {
    return [...checkboxesList].every((it, index) => {
      return index !== 0 ? it.checked : true;
    });
  }

  function displayCheckedValues() {
    var values = getValuesString();
    valueNode.textContent = values ? values : placeholder;
  }

  function checkAll() {
    [...checkboxesList].forEach((it) => {
      it.checked = true;
    });
  }

  function uncheckAll() {
    [...checkboxesList].forEach((it) => {
      it.checked = false;
    });
  }

  function checkItemValueAll() {
    checkboxesList[0].checked = true;
  }

  function uncheckItemValueAll() {
    checkboxesList[0].checked = false;
  }

  function getValuesList() {
    if (isCheckAll(checkboxesList)) {
      var box = checkboxesList[0].parentElement;

      return [box.textContent.trim()];
    }

    return [...checkboxesList]
      .filter((it) => {
        return it.checked;
      })
      .map((it) => {
        var box = it.parentElement;
        return box.textContent.trim();
      });
  }

  function getValuesString() {
    return getValuesList().join(', ');
  }

  function openSelect() {
    select.classList.add('checkboxes-select--open');
    window.addEventListener('click', onclickWindowHandler);
  }

  function closeSelect() {
    select.classList.remove('checkboxes-select--open');
    window.removeEventListener('click', onclickWindowHandler);
  }

})(window);
