/*	
	Init params {obj}:
	- elem - element name (default = 'select')
	- firstOptSelected (default = false)
	- onselect - f(selection)
*/
class Select {
	constructor(params = {}) {
		this.elemName = params.elem || 'select';
		this.elem = document.querySelector('.' + this.elemName);
		if (!this.elem) return;

		this.header = this.elem.querySelector('.select__header');
		this.headertext = this.elem.querySelector('.select__header-text');
		this.listWrapper = this.elem.querySelector('.select__list-wrapper');
		this.listWrapper.innerHTML = '';

		this.basicSelect = this.elem.querySelectorAll('select option');

		let newList = document.createElement('ul');
		newList.classList.add('select__list');
		this.listWrapper.appendChild(newList);
		for (let i = 0; i < this.basicSelect.length; i++) {
			if (this.basicSelect[i].hasAttribute('disabled')) continue;
			let newLi = document.createElement('li');
			newLi.classList.add('select__option');
			newLi.innerHTML = this.basicSelect[i].innerHTML;
			newList.appendChild(newLi);
		}

		this.options = this.elem.querySelectorAll('.select__option');
		let that = this;
		for (let i = 0; i < this.options.length; i++) {
			this.options[i].addEventListener('click', function() {
				that.selectItem(event, that, i);
			});
		};
		this.header.addEventListener('click', this.showList.bind(this));
		window.addEventListener('click', this.hideList.bind(this), {capture: true});
		window.addEventListener('resize', this.hideList.bind(this));
		this.isOpened = false;

		if (params.firstOptSelected) {
			this.headertext.innerHTML = this.options[0].innerHTML;
			this.options[0].classList.add('_selected');
			this.basicSelect[0].parentElement.removeChild(this.basicSelect[0]);
		}
		else {
			this.headertext.innerHTML = this.basicSelect[0].innerHTML;
		}
		this.onselect = params.onselect || function(selection){};
	}
	hideList(e) {
		if (!this.isOpened) return;
		this.listWrapper.style.height = '';
		this.elem.classList.remove('_active');
		this.listWrapper.classList.remove('_active');
		let that = this;
		setTimeout(() => {that.isOpened = false}, 100);
	}
	showList(e) {
		if (this.isOpened) return;
		this.listWrapper.style.height = this.listWrapper.children[0].offsetHeight + 'px';
		this.elem.classList.add('_active');
		this.listWrapper.classList.add('_active');
		this.isOpened = true;
	}
	selectItem(e, that, i) {
		let target = e ? e.target : that.options[i];
		for (let j = 0; j < target.parentElement.children.length; j++) {
			target.parentElement.children[j].classList.remove('_selected');
			that.basicSelect[j].removeAttribute('selected');
		}
		target.classList.add('_selected');
		that.basicSelect[i+1].setAttribute('selected', 'true');
		that.onselect(that.basicSelect[i+1].value);
		that.headertext.innerHTML = target.innerHTML;
	}
	reset() { // function for form-controlled reset
		if (!this.elem) return;
		this.selectItem(false, this, 0);
		this.hideList();
	}
}