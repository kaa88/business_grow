/* 
	Set transition timeout in CSS only.
	
	Init params {obj}: 
	- elem - element name (default = 'modal')
	- linkName - modal link name (default = 'modal-link')
	- closeOldIfNew - close previous opened window if new one is opened (default = false)
	- on: {'modal-window': {open, close}} - event function(event, content, timeout){}
		'modal-window' name can be 'any' - trigger on any window

	On-func example:
	modal.init({
		on: {
			'modal-contact': {
				close: function(event, content, timeout) {setTimeout(() => {formToEmail.clean(document.querySelector('.question-form'))}, 700)}
			},
			'modal-imgpreview': {
				open: function(event, content, timeout) {
					let source = event.currentTarget.children[event.currentTarget.children.length-1];
					let img = document.querySelector('#modal-imgpreview img');
					img.src = source.getAttribute('src').replace('.','-preview.');
					if (source.srcset) img.srcset = source.srcset.replace('@2x.','-preview@2x.');
					else img.srcset = '';
				},
				close: function(event, content) {
					let img = document.querySelector('#modal-imgpreview img');
					setTimeout(() => {
						img.src = img.srcset = '';
					}, modal.timeout)
				},
			},
			'modal-video': {
				open: function(event, content, timeout) {setTimeout(() => {videoPlayer.play(content)}, timeout)},
				close: function(event, content, timeout) {videoPlayer.pause(content)}
			}
		}
	})
*/
const modal = {
	refs: {
		translock: transitionLock,
		scrlock: scrollLock,
		header: header.menu
	},
	init: async function(params = {}){
		this.elemName = params.elem || 'modal';
		this.elem = document.querySelector('.' + this.elemName);
		if (!this.elem) return;
		this.timeout = parseFloat(getComputedStyle(document.body).getPropertyValue('--timer-modal'))*1000 || 0;
		this.windows = this.elem.querySelectorAll('.' + this.elemName + '__window');
		this.links = document.querySelectorAll(params.linkName ? '.' + params.linkName : '.modal-link');
		for (let i = 0; i < this.links.length; i++) {
			this.links[i].addEventListener('click', this.open.bind(this));
		}
		this.elem.addEventListener('click', function(e) {
			if (!e.target.closest('.' + this.elemName + '__wrapper')) this.closeAll();
		}.bind(this));
		let closeButtons = this.elem.querySelectorAll('.' + this.elemName + '__close-button');
		for (let i = 0; i < closeButtons.length; i++) {
			closeButtons[i].addEventListener('click', this.closeThis.bind(this));
		}
		this.on = params.on || {};
		this.cssZindex = 111;
		this.closeOldIfNew = params.closeOldIfNew || false;
	},
	open: function(e, modalName){
		if (this.refs.translock.check(this.timeout)) return;
		if (e) e.preventDefault();

		this.refs.header.toggle(false, true); // close header menu if opened

		// closeOldIfNew part 1
		let oldWindow = false;
		if (this.closeOldIfNew) {
			for (let i = 0; i < this.windows.length; i++) {
				if (this.windows[i].classList.contains('_open')) oldWindow =  this.windows[i];
			}
		}
		//
		if (!modalName) modalName = e.currentTarget.getAttribute('href');
		else if (!modalName.match(/\#/)) modalName = '#' + modalName;
		let currentModal = this.elem.querySelector(modalName);
		currentModal.classList.add('_open');
		currentModal.style.zIndex = this.cssZindex++;

		this.toggleMainWindow(this.check()); // поставил перед on.func, т.к. там window.scroll, а scroll-lock его блокирует, надо было поменять очередность

		let onFuncContent = currentModal.querySelector('.' + this.elemName + '__content > *:not(.' + this.elemName + '__close-button)');
		if (this.on[currentModal.id] && this.on[currentModal.id].open)
			this.on[currentModal.id].open(e ? e : false, onFuncContent, this.timeout);
		if (this.on['any'] && this.on['any'].open)
			this.on['any'].open(e ? e : false, onFuncContent, this.timeout);

		// closeOldIfNew part 2 (wrong turn-off fix, must run after on-function)
		if (this.closeOldIfNew) this.closeThis(false, oldWindow);
		//
	},
	closeThis: function(e, elemToClose){
		if (!elemToClose && this.refs.translock.check(this.timeout)) return;
		let currentModal = elemToClose ? elemToClose : e.target.closest('.' + this.elemName + '__window');
		currentModal.classList.remove('_open');
		let onFuncContent = currentModal.querySelector('.' + this.elemName + '__content > *:not(.' + this.elemName + '__close-button)');
		if (this.on[currentModal.id] && this.on[currentModal.id].close)
			this.on[currentModal.id].close(e, onFuncContent, this.timeout);
		if (this.on['any'] && this.on['any'].close)
			this.on['any'].close(e, onFuncContent, this.timeout);

		if (!elemToClose) this.toggleMainWindow(this.check());
	},
	closeAll: function(noTransLock){
		if (!noTransLock && this.refs.translock.check(this.timeout)) return;
		for (let i = 0; i < this.windows.length; i++) {
			if (this.windows[i].classList.contains('_open')) {
				this.windows[i].classList.remove('_open');
				if (this.on[this.windows[i].id] && this.on[this.windows[i].id].close)
					this.on[this.windows[i].id].close(0,0,this.timeout);
			}
		}
		if (this.on['any'] && this.on['any'].close)
			this.on['any'].close(0,0,this.timeout);
		this.toggleMainWindow(this.check());
	},
	check: function(){
		for (let i = 0; i < this.windows.length; i++) {
			if (this.windows[i].classList.contains('_open')) return true;
		}
		return false;
	},
	toggleMainWindow: function(openedWindows) {
		if (openedWindows) {
			this.elem.classList.add('_visible');
			this.refs.scrlock.lock();
		}
		else {
			this.elem.classList.remove('_visible');
			if (!this.refs.header.menuElem.classList.contains('_active'))
				this.refs.scrlock.unlock(this.timeout);
		}
	}
}