class checkboxesSelect {
  constructor(select) {
    this.select = select;
    this.toggle = select.querySelector('.checkboxes-select__toggle');
    this.checkboxesList = select.querySelectorAll('input[type="checkbox"]');
    this.valueNode = select.querySelector('.checkboxes-select__value');
    this.dropdown = select.querySelector('.checkboxes-select__dropdown');
    this.selectName = this.checkboxesList[0].name;
    this.placeholder = select.dataset.placeholder;
    this.select.dataset.name = this.selectName;

    this.displayCheckedValues();

    this.toggle.addEventListener('click', this.onclickToggleHandler.bind(this));
    this.dropdown.addEventListener('change', this.onchangeDropdownHandler.bind(this));

    this._onclickWindowListener = this.onclickWindowHandler.bind(this);
  }

  // Handlers

  onchangeDropdownHandler(evt) {
    var target = evt.target;
    var checkbox = target.closest('input[type="checkbox"]');

    if (!checkbox) {
      return;
    }

    var value = checkbox.value;
    var isChecked = checkbox.checked;

    if (value === 'all') {
      if (isChecked) {
        this.checkAll();
      } else {
        this.uncheckAll();
      }
    } else {
      if (this.isCheckAll()) {
        this.checkItemValueAll();
      } else {
        this.uncheckItemValueAll();
      }
    }

    this.displayCheckedValues();
  }

  onclickToggleHandler(evt) {
    evt.preventDefault();

    var isSelectOpen = this.select.classList.contains('checkboxes-select--open');

    if (!isSelectOpen) {
      this.openSelect();
    } else {
      this.closeSelect();
    }
  }

  onclickWindowHandler(evt) {
    var target = evt.target;
    var targetSelect = target.closest('.checkboxes-select');

    if (!targetSelect) {
      this.closeSelect();
    }
  }

  // Methods

  isCheckAll() {
    return [...this.checkboxesList].every((it, index) => {
      return index !== 0 ? it.checked : true;
    });
  }

  displayCheckedValues() {
    var values = this.getValuesString();
    this.valueNode.textContent = values ? values : this.placeholder;
  }

  checkAll() {
    [...this.checkboxesList].forEach((it) => {
      it.checked = true;
    });
  }

  uncheckAll() {
    [...this.checkboxesList].forEach((it) => {
      it.checked = false;
    });
  }

  checkItemValueAll() {
    this.checkboxesList[0].checked = true;
  }

  uncheckItemValueAll() {
    this.checkboxesList[0].checked = false;
  }

  getValuesList() {
    if (this.isCheckAll()) {
      var box = this.checkboxesList[0].parentElement;

      return [box.textContent.trim()];
    }

    return [...this.checkboxesList]
      .filter((it) => {
        return it.checked;
      })
      .map((it) => {
        var box = it.parentElement;
        return box.textContent.trim();
      });
  }

  getValuesString() {
    return this.getValuesList().join(', ');
  }

  openSelect() {
    this.select.classList.add('checkboxes-select--open');
    window.addEventListener('click', this._onclickWindowListener);
  }

  closeSelect() {
    this.select.classList.remove('checkboxes-select--open');
    window.removeEventListener('click', this._onclickWindowListener);
  }
}
