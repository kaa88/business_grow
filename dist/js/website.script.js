// Constants //
const mobileSwitchWidth = parseFloat(getComputedStyle(document.body).getPropertyValue('--media-mobile')) || 768;

//////////////////////////////////////////////////

// Random //
function getRandomNumber(min = 0, max = 99) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomId(length = 10) {
	let symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += symbols[getRandomNumber(0, symbols.length-1)];
	}
	return result;
}

//////////////////////////////////////////////////

// JS Media Queries //
/* 
	Module checks window resizing and runs funcs on breakpoints.
	There is 1 more index than number of breakpoints (from 0px to 1st breakpoint).

	Useful output:
	- jsMediaQueries.stateIndex
	
	Init params {obj}: breakpoints - {obj}
*/
const jsMediaQueries = {
	init: async function(params = {}) {
		this.breakpoints = params.breakpoints || null;
		if (!this.breakpoints) return;
		this.breakpoints.keys = Object.keys(this.breakpoints);
		for (let i = 0; i < this.breakpoints.keys.length; i++) {
			this.breakpoints.keys[i] = Number(this.breakpoints.keys[i]);
		}
		this.breakpoints.keys.push(0);
		this.breakpoints.keys.sort((a,b) => {return a - b});
		window.addEventListener('resize', this.check.bind(this));
		this.check(0, true);
	},
	check: function(e, init = false) {
		for (let i = 0; i < this.breakpoints.keys.length; i++) {
			if (window.innerWidth > this.breakpoints.keys[i]) this.state = this.breakpoints.keys[i];
			else break;
		}
		if (init) this.prev_state = this.state;
		if (this.state != this.prev_state && !init) {
			if (this.state > this.prev_state) this.breakpoints[this.state]();
			else this.breakpoints[this.prev_state]();
			this.prev_state = this.state;
		}
	}
}
jsMediaQueries.init({
	breakpoints: {
		568: () => {},
		782: () => {
			header.mobileViewService(); // required by Header module
		},
		1228: () => {},
	}
})

//////////////////////////////////////////////////

// Scroll lock //
/* 
	Module prevents window scrolling with menu, modals, etc. and
	prevents content jumps when scrollbar fades out.
	Script will find elements in default groups (main, footer) and 
	set 'padding-right' property to them.
	You can exclude them by setting a 'useDefaultGroups' param to 'false'.
	Header is not a default group, these elems must be added manually.
	
	Set an additional elems to list by setting classes to HTML:
	- 'scroll-lock-item-p' class - for static elems ('padding-right' prop.)
	- 'scroll-lock-item-m' class - for fixed elems ('margin-right' prop.)
	- 'scroll-lock-item-pm' class - for static elems that will be hidden in menu
		(they will get a 'padding-right' prop. only on desktop width)

	Usable functions: 
		scrollLock.lock()
		scrollLock.unlock( #timeout# )

	Init params {obj}: useDefaultGroups (default = true)
*/
const scrollLock = {
	refs: {
		mobile: mobileSwitchWidth
	},
	defaultElems: ['main', 'footer'],
	paddingItemClassName: 'scroll-lock-item-p',
	paddingMenuItemClassName: 'scroll-lock-item-pm',
	marginItemClassName: 'scroll-lock-item-m',
	lockedClassName: '_locked',

	init: async function(params = {}) {
		this.paddingItems = document.querySelectorAll('.' + this.paddingItemClassName);
		this.paddingMenuItems = document.querySelectorAll('.' + this.paddingMenuItemClassName);
		this.marginItems = document.querySelectorAll('.' + this.marginItemClassName);

		if (params.useDefaultGroups === false || params.useDefaultGroups === 'false')
			this.useDefaultGroups = false;
		else this.useDefaultGroups = true;

		if (this.useDefaultGroups) {
			let selector = '';
			for (let i = 0; i < this.defaultElems.length; i++) {
				selector += '.' + this.defaultElems[i];
				// 	selector += '.' + this.defaultElems[i] + '>*';
				if (i < this.defaultElems.length - 1) selector += ',';
			}
			let defaultItems = document.querySelectorAll(selector);
			let joinedPaddingItems = Array.from(defaultItems);
			for (let i = 0; i < this.paddingItems.length; i++) {
				let exist = false;
				for (let j = 0; j < defaultItems.length; j++) {
					if (defaultItems[j] == this.paddingItems[i]) exist = true;
				}
				if (!exist) joinedPaddingItems.push(this.paddingItems[i]);
			}
			this.paddingItems = joinedPaddingItems;
		}
	},

	lock: function() {
		if (document.body.classList.contains(this.lockedClassName)) return;
		this.scrollbarWidth = window.innerWidth - document.body.offsetWidth;
		let that = this;
		function f(items, prop) {
			for (let i = 0; i < items.length; i++) {
				items[i][prop] = parseFloat(getComputedStyle(items[i])[prop]);
				items[i].style[prop] = items[i][prop] + that.scrollbarWidth + 'px';
			}
		}
		if (window.innerWidth > this.refs.mobile)
			f(this.paddingMenuItems, 'paddingRight');
		f(this.paddingItems, 'paddingRight');
		f(this.marginItems, 'marginRight');
		document.body.classList.add(this.lockedClassName);
	},

	unlock: function(timeout = 0) {
		let that = this;
		setTimeout(() => {
			function f(items, prop) {
				for (let i = 0; i < items.length; i++) {
					items[i].style[prop] = '';
				}
			}
			f(this.paddingMenuItems, 'paddingRight');
			f(this.paddingItems, 'paddingRight');
			f(this.marginItems, 'marginRight');
			document.body.classList.remove(that.lockedClassName);
		}, timeout);
	}
}
scrollLock.init({
	useDefaultGroups: false
})

//////////////////////////////////////////////////

// Transition lock //
/* 
	Module prevents double-clicking on transitions, e.g. when menu slides.
	Use: if (transitionLock.check( #timeout# )) return;
*/
const transitionLock = {
	locked: false,
	check: function(timeout = 0) {
		let that = this,
		    result = this.locked;
		if (that.locked == false) {
			that.locked = true;
			setTimeout(function(){
				that.locked = false;
			}, timeout);
		}
		return result;
	}
}

//////////////////////////////////////////////////

// Header //
/* 
	Always init header to keep css variables working, even if header is empty
	Set transition timeout in CSS only
	
	Init params {obj}: (defaults = false)
	- menu - add menu module
	- submenu - add submenu module
	- hidingHeader - add hidingHeader module
	- elemAboveHeader - if there is something above the header, e.g. WordPress adminbar, set 'true' to calculate it as well
*/
const header = {
	refs: { // dependences
		mobile: mobileSwitchWidth,
		translock: transitionLock,
		scrlock: scrollLock
	},
	names: {
		// selectors:
		elemAboveHeader: '#wpadminbar',
		header: '.header',
		menu: '.header-menu-hide-wrapper',
		menuItems: '.header-menu__items',
		menuItem: '.header-menu__item',
		menuOpenBtn: '.header-menu-open-btn',
		menuCloseBtn: '.header-menu-close-btn',
		menuBackBtn: '.header-submenu-back-btn',
		menuArea: '.header-menu-turn-off-area',
		menuOptions: '#header-menu-options',
		submenu: '.header-submenu-hide-wrapper',
		submenuDropLink: '.submenu-drop-link',
		// classnames:
		noheader: 'header--empty',
		thisPageClass: 'this-page',
		// css variable names:
		varTimer: '--timer-menu',
		varWinHeight: '--window-height',
		varHeight: '--header-height',
		varPos: '--header-position',
		varOffset: '--header-offset',
	},
	init: function(params = {}) {
		this.headerElem = document.querySelector(this.names.header);
		if (!this.headerElem) {
			this.headerElem = document.createElement('header');
			this.headerElem.className = this.names.noheader;
			document.body.prepend(this.headerElem);
			// Create empty header to avoid errors if there is no header on the page. Content and footer metrics are working as well.
		}
		let timeout = parseFloat(getComputedStyle(document.body).getPropertyValue(this.names.varTimer))*1000 || 0;

		this.windowHeight =
		this.windowHeightPrev =
		this.headerHeight =
		this.headerHeightPrev =
		this.headerPosition =
		this.headerPositionPrev =
		this.headerOffset =
		this.headerOffsetPrev = 0;

		let elemAboveHeader = document.querySelector(this.names.elemAboveHeader);
		if (params.elemAboveHeader && elemAboveHeader)
			this.elemAboveHeader = elemAboveHeader;
		else this.elemAboveHeader = false;

		this.calcHeaderHeight();
		window.addEventListener('resize', this.calcHeaderHeight.bind(this));

		if (params.menu) this.menu.init(this, timeout, this.names);
		if (params.submenu) this.submenu.init(this, timeout, this.names);
		if (params.hidingHeader) window.addEventListener('load', () => this.hidingHeader.init(this));
	},
	calcHeaderHeight: function() {
		// This func controls the mobile menu height variable in css
		this.windowHeight = window.innerHeight;
		this.headerHeight = this.headerElem.offsetHeight;
		if (this.elemAboveHeader) {
			this.headerOffset = this.headerPosition = this.elemAboveHeader.offsetHeight;
		}
		else this.headerOffset = this.headerPosition = 0;
		this.setCssVar();
		this.hidingHeader.calc();
	},
	setCssVar: function() {
		if (this.windowHeight != this.windowHeightPrev) {
			document.body.style.setProperty(this.names.varWinHeight, this.windowHeight + 'px');
			this.windowHeightPrev = this.windowHeight;
		}
		if (this.headerHeight != this.headerHeightPrev) {
			document.body.style.setProperty(this.names.varHeight, this.headerHeight + 'px');
			this.headerHeightPrev = this.headerHeight;
		}
		if (this.headerPosition != this.headerPositionPrev) {
			document.body.style.setProperty(this.names.varPos, this.headerPosition + 'px');
			this.headerPositionPrev = this.headerPosition;
		}
		if (this.headerOffset != this.headerOffsetPrev) {
			document.body.style.setProperty(this.names.varOffset, this.headerOffset + 'px');
			this.headerOffsetPrev = this.headerOffset;
		}
	},
	mobileViewService: function() {
		this.menu.toggle();
		this.menu.hideOnViewChange();
		// this.hidingHeader.calc();
	},

	// Menu
	menu: {
		isLoaded: false,
		init: function(that, timeout, names) {
			this.isLoaded = true;
			this.root = that;
			this.timeout = timeout;
			this.menuElem = this.root.headerElem.querySelector(names.menu);
			this.toggleButtons = this.root.headerElem.querySelectorAll(`${names.menuOpenBtn}`);
			this.closeButtons = this.root.headerElem.querySelectorAll(`${names.menuCloseBtn}, ${names.menuArea}`);
			let newMenu = this.menuElem.querySelector(names.menuItems);

			// headerMenuOptions handler
			let headerMenuOptionsElem = document.querySelector(names.menuOptions);
			if (headerMenuOptionsElem) {
				if (typeof headerMenuOptions == 'object') {
					if (headerMenuOptions.links) {
						let clone = {};
						for (let i = 0; i < newMenu.children.length; i++) {
							clone[newMenu.children[i].dataset.name] = newMenu.children[i];
						}
						newMenu.innerHTML = '';
						for (let i = 0; i < headerMenuOptions.links.length; i++) {
							newMenu.appendChild(clone[headerMenuOptions.links[i]]);
						}
					}
					if (headerMenuOptions.activeLink) {
						for (let i = 0; i < newMenu.children.length; i++) {
							if (newMenu.children[i].dataset.name == headerMenuOptions.activeLink) {
								newMenu.children[i].firstElementChild.classList.add(names.thisPageClass);
								break;
							}
						}
					}
				}
				headerMenuOptionsElem.parentElement.removeChild(headerMenuOptionsElem);
			}

			for (let i = 0; i < this.toggleButtons.length; i++) {
				this.toggleButtons[i].addEventListener('click', this.toggle.bind(this));
			}
			for (let i = 0; i < this.closeButtons.length; i++) {
				this.closeButtons[i].addEventListener('click', this.close.bind(this));
			}
		},
		toggle: function(e, noLock) {
			if (!this.isLoaded) return;
			if (this.menuElem.classList.contains('_active')) this.close(false, noLock);
			else if (e) this.open(e, noLock);
		},
		open: function(e, noLock) {
			if (!this.isLoaded) return;
			if (!noLock && this.root.refs.translock.check(this.timeout)) return;

			this.menuElem.classList.add('_active');
			this.root.headerElem.classList.add('_active');
			for (let i = 0; i < this.toggleButtons.length; i++) {
				this.toggleButtons[i].classList.add('_active');
			}
			for (let i = 0; i < this.closeButtons.length; i++) {
				this.closeButtons[i].classList.add('_active');
			}
			if (!noLock) this.root.refs.scrlock.lock();
			this.root.hidingHeader.scroll(0, true); // hidingHeader reference
		},
		close: function(e, noLock) {
			if (!this.isLoaded) return;
			if (!noLock && this.root.refs.translock.check(this.timeout)) return;

			this.menuElem.classList.remove('_active');
			this.root.headerElem.classList.remove('_active');
			for (let i = 0; i < this.toggleButtons.length; i++) {
				this.toggleButtons[i].classList.remove('_active');
			}
			for (let i = 0; i < this.closeButtons.length; i++) {
				this.closeButtons[i].classList.remove('_active');
			}
			if (!noLock) this.root.refs.scrlock.unlock(this.timeout);
			this.root.submenu.closeAll(); // submenu reference
		},

		hideOnViewChange: function() {
			// this func prevents menu blinking on mobile view switch
			if (this.isLoaded) {
				let that = this;
				// this.menuElem.style.visibility = 'hidden';
				this.menuElem.style.display = 'none';
				setTimeout(() => {
					that.menuElem.style.display = '';
					that.root.calcHeaderHeight();
				}, that.timeout)
			}
		}
	},
	// /Menu

	// SubMenu
	submenu: {
		isLoaded: false,
		init: function(that, timeout, names){
			this.isLoaded = true;
			this.root = that;
			this.timeout = timeout;
			this.sMenuElems = this.root.headerElem.querySelectorAll(names.submenu);
			if (this.sMenuElems.length == 0) {
				console.log('Error: No submenu detected');
				return;
			}
			this.links = this.root.headerElem.querySelectorAll(names.submenuDropLink);
			this.backButtons = this.root.headerElem.querySelectorAll(names.menuBackBtn);
			// if menu-item contains submenu
			if (this.links[0]) {
				if (this.links[0].closest(names.menuItem).querySelector(names.submenu)) this.isOutside = false;
				else this.isOutside = true;
			}
			// setting events
			for (let i = 0; i < this.backButtons.length; i++) {
				this.backButtons[i].addEventListener('click', this.toggle.bind(this));
			}
			for (let i = 0; i < this.links.length; i++) {
				this.links[i].addEventListener('click', this.toggle.bind(this));
				this.links[i].addEventListener('mouseover', this.toggle.bind(this));
				if (!this.isOutside)
					this.links[i].closest(names.menuItem).addEventListener('mouseleave', this.toggle.bind(this));
			}
			if (this.isOutside)
				this.root.headerElem.addEventListener('mouseleave', this.toggle.bind(this));
		},
		toggle: function(e) {
			if (!e) return;
			let that = this, mobile = false;
			if (window.innerWidth <= this.root.refs.mobile) mobile = true;

			function is(name) {
				let str = that.root.names[name];
				if (str.match(/[#.]/)) str = str.substring(1);
				return e.currentTarget.classList.contains(str);
			}
			
			if (mobile) {
				if (e.type == 'click') {
					if (is('submenuDropLink')) this.open(e, mobile);
					if (is('menuBackBtn')) this.close(e, mobile);
				}
			}
			else {
				if (e.type == 'mouseover') {
					if (is('submenuDropLink')) this.open(e, mobile);
				}
				if (e.type == 'mouseleave') {
					if (is('menuItem') || is('header')) this.close(e, mobile);
				}
			}
		},
		open: function(e, m) {
			e.preventDefault();
			if (m && this.root.refs.translock.check(this.timeout)) return;
			if (this.isOutside) {
				for (let i = 0; i < this.links.length; i++) {
					this.links[i].classList.add('_active');
				}
				for (let i = 0; i < this.sMenuElems.length; i++) {
					this.sMenuElems[i].classList.add('_active');
				}
			}
			else {
				e.currentTarget.classList.add('_active');
				e.currentTarget.nextElementSibling.classList.add('_active');
			}
		},
		close: function(e, m) {
			if (m && this.root.refs.translock.check(this.timeout)) return;
			if (this.isOutside) {
				let items = this.root.headerElem.querySelectorAll(`${this.root.names.menuItem} ._active, ${this.root.names.submenu}._active`);
				for (let i = 0; i < items.length; i++) {
					items[i].classList.remove('_active');
				}
			}
			else {
				let parent = e.currentTarget.closest(this.root.names.submenu).parentElement;
				for (let i = 0; i < parent.children.length; i++) {
					parent.children[i].classList.remove('_active');
				}
			}
		},
		closeAll: function() {
			if (this.isLoaded) {
				for (let i = 0; i < this.links.length; i++) {
					this.links[i].classList.remove('_active');
				}
				for (let i = 0; i < this.sMenuElems.length; i++) {
					this.sMenuElems[i].classList.remove('_active');
				}
			}
		}
	},
	// /SubMenu

	// Hiding Header
	hidingHeader: {
		isLoaded: false,
		init: function(that) {
			this.isLoaded = true;
			this.root = that;
			this.hiddenPositionOffset = 0; // set this one if you want to move header by value that differs it's height
			this.firstScroll = true;
			window.addEventListener('scroll', this.scroll.bind(this));
		},
		calc: function() {
			if (!this.isLoaded) return;
			this.Y = this.YPrev = pageYOffset;
			this.diff = 0;
			this.currentPos = this.root.headerOffset;
		},
		scroll: function(e, click) {
			if (!this.isLoaded) return;
			if (window.innerWidth > this.root.refs.mobile) return;

			// this 'if' prevents header's jump after page reloading in the middle of the content
			if (this.firstScroll) {
				this.firstScroll = false;
				this.calc();
				return;
			}
			// click-move
			if (click) {
				this.currentPos = this.root.headerPosition = this.root.headerOffset;
				this.root.setCssVar();
				return;
			}
			// lazyLoad check
			if ((pageYOffset < (this.Y + this.diff) && this.Y > this.YPrev) || (pageYOffset > (this.Y + this.diff) && this.Y < this.YPrev)) {
				this.diff = pageYOffset - this.Y;
			}
			// scroll-move
			let currentPos = this.root.headerPosition;
			let visiblePos = this.root.headerOffset;
			let hiddenPos = visiblePos - this.root.headerHeight - this.hiddenPositionOffset;
			this.YPrev = this.Y;
			this.Y = pageYOffset - this.diff;
			currentPos -= this.Y - this.YPrev;
			if (currentPos > visiblePos) currentPos = visiblePos;
			if (currentPos < hiddenPos) currentPos = hiddenPos;
			this.root.headerPosition = currentPos;
			this.root.setCssVar();
		}
	},
	// /Hiding Header
}
header.init({
	menu: true,
	// submenu: true,
	// hidingHeader: true,
	// elemAboveHeader: true
})

const headerMenuOpenButton = document.querySelector('.header-menu-open-btn');
headerMenuOpenButton.addEventListener('click', function() {
	window.scroll({top: 0, behavior: 'smooth'});
})

//////////////////////////////////////////////////

// Footer //
/* 
	This module calculates footer's height and sets css variable.
*/
const footer = {
	init: function() {
		this.footerElem = document.querySelector('.footer');
		if (!this.footerElem) return;
		this.footerHeight = this.footerHeightPrev = 0;
		this.calcFooterHeight();
		window.addEventListener('resize', this.calcFooterHeight.bind(this));
	},
	calcFooterHeight: function() {
		this.footerHeight = this.footerElem.offsetHeight;
		if (this.footerHeight != this.footerHeightPrev) {
			document.body.style.setProperty('--footer-height', this.footerHeight + 'px');
			this.footerHeightPrev = this.footerHeight;
		}
	}
}
footer.init()

//////////////////////////////////////////////////

// Modal window //
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

// modal closing with header menu button
const headerMenuCloseButton = document.querySelector('.header-menu-close-btn');
headerMenuCloseButton.addEventListener('click', function() {
	modal.closeAll(true);
})
//

// clone footer to modal window to provide scrolling
const footerCloneContainers = document.body.querySelectorAll('.modal__footer-clone');
for (let i = 0; i < footerCloneContainers.length; i++) {
	footerCloneContainers[i].innerHTML = document.body.querySelector('.footer').outerHTML;
}
//

// moved modal.init to the end because of swiper links late loading

//////////////////////////////////////////////////

// Select //
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
const select_consult_activity = new Select({
	elem: 'consult-form__select',
	firstOptSelected: true,
	// onselect: (selection) => {console.log(selection)}
})

//////////////////////////////////////////////////

// Swiper //
const swipers = {
	selectors: {
		features: '.features-slider',
		consult_top: '.modal__title-slider',
		consult_bot: '.consult-form__slider',
		modal_call: '.modal__call-slider',
		modal_msg: '.modal__msg-slider',
		modal_access: '.modal__access-slider',
		cases_top: '.cases-slider__top',
		cases_bot: '.cases-slider__bottom',
		materials: '.materials-slider .swiper',
	},
	settings: {
		speed: 500,
		spaceBetween: 30,
	}
};

// Check number of slides in materials-slide
swipers.checkMaterialSlides = function() {
	let maxSlides = 9;
	let sliderWrapperEl = document.querySelector(this.selectors.materials + ' .swiper-wrapper');
	if (!sliderWrapperEl) return;
	let newWrapperString = '', lastSlideElString = sliderWrapperEl.querySelector('.last-slide').outerHTML;
	for (let i = 0; i <= maxSlides; i++) {
		if (i == maxSlides && sliderWrapperEl.children[i]) {
			newWrapperString += lastSlideElString;
			break;
		}
		if (i > sliderWrapperEl.children.length -1) newWrapperString += '<span class="swiper-slide _empty"></span>';
		else newWrapperString += sliderWrapperEl.children[i].outerHTML;
	}
	sliderWrapperEl.innerHTML = newWrapperString;
}
swipers.checkMaterialSlides();
//

// Building Swipers
if (typeof Swiper !== 'undefined') {
	swipers.features = new Swiper(swipers.selectors.features, {
		slidesPerView: 'auto',
		slidesOffsetBefore: 30,
		slidesOffsetAfter: 30,
		spaceBetween: 10,
		freeMode: true,
	})
	swipers.consult_top = new Swiper(swipers.selectors.consult_top, {
		speed: swipers.settings.speed,
		spaceBetween: swipers.settings.spaceBetween,
		allowTouchMove: false
	})
	swipers.consult_bot = new Swiper(swipers.selectors.consult_bot, {
		speed: swipers.settings.speed,
		spaceBetween: swipers.settings.spaceBetween,
		allowTouchMove: false
	})
	swipers.modal_call = new Swiper(swipers.selectors.modal_call, {
		speed: swipers.settings.speed,
		spaceBetween: swipers.settings.spaceBetween,
		allowTouchMove: false
	})
	swipers.modal_msg = new Swiper(swipers.selectors.modal_msg, {
		speed: swipers.settings.speed,
		spaceBetween: swipers.settings.spaceBetween,
		allowTouchMove: false
	})
	swipers.modal_access = new Swiper(swipers.selectors.modal_access, {
		speed: swipers.settings.speed,
		spaceBetween: swipers.settings.spaceBetween,
		allowTouchMove: false
	})
	swipers.cases_top = new Swiper(swipers.selectors.cases_top, {
		navigation: {
			nextEl: '.cases-slider__nav-next',
			prevEl: '.cases-slider__nav-prev',
		},
		loop: true,
		speed: swipers.settings.speed,
		spaceBetween: 20,
	})
	swipers.cases_bot = new Swiper(swipers.selectors.cases_bot, {
		loop: true,
		speed: swipers.settings.speed,
		spaceBetween: 20,
	})
	swipers.cases_top.controller.control = swipers.cases_bot;
	swipers.cases_bot.controller.control = swipers.cases_top;
	swipers.materials = new Swiper(swipers.selectors.materials, {
		navigation: {
			prevEl: '.materials-slider__button-prev',
			nextEl: '.materials-slider__button-next',
		},
		freeMode: true,
		slidesPerView: 'auto',
		spaceBetween: 10,
		slidesOffsetBefore: 30,
		slidesOffsetAfter: 30,
		breakpoints: {
			[mobileSwitchWidth]: {
				direction: 'vertical',
				allowTouchMove: false,
				slidesPerGroup: 5,
				slidesPerView: 5,
				freeMode: false,
				spaceBetween: 0,
				speed: 400,
				slidesOffsetBefore: 0,
				slidesOffsetAfter: 0,
			}
		}
	})
}
//

// Quiz
const modalProgressBar = {
	init: async function() {
		let modalCheck = document.querySelector('#modal-consult');
		if (!modalCheck) return;
		this.isLoaded = true;
		this.elem = document.querySelector('.modal__progressbar-inner');
		this.total = document.querySelector('.consult-form__slider .swiper-wrapper').children.length;
		this.i = 1;
		this.expand();
	},
	expand: function() {
		if (this.isLoaded) this.elem.style.width = this.i / this.total * 100 + '%';
	}
}
modalProgressBar.init();
//

swipers.consultSlideButtons = document.querySelectorAll('.swiper-slide-button');
for (let i = 0; i < swipers.consultSlideButtons.length; i++) {
	swipers.consultSlideButtons[i].addEventListener('click', function(e) {
		e.preventDefault();
		if (transitionLock.check( swipers.settings.speed )) return;
		swipers.consult_top.slideNext();
		swipers.consult_bot.slideNext();
		if (modalProgressBar.i < modalProgressBar.total) modalProgressBar.i++;
		modalProgressBar.expand();
	})
}
//////////////////////////////////////////////////

// Print version QR-code //
/* 
	Init params:
	1) QR-code size in 'px' (square) (default = 100)
*/
async function printQRcode(size = 100) {
	let elem = document.querySelector('.header__print-address-qr');
	if (!elem) return;
	let str = '<img src="https://chart.googleapis.com/chart?cht=qr&chs=' + size + 'x' + size + '&choe=UTF-8&chld=H|0&chl=' + window.location.href + '" alt="">';
	elem.innerHTML = str;
}
printQRcode(100); // param = size

//////////////////////////////////////////////////

// Send form to email //
/*
	Init params:
	1) demo mode: all checks and response messages, but disabled php (default = false)
*/
const formToEmail = {

	messages: {
		ok: 'Your message has been sent',
		okDemo: 'Your message has been sent (demo)',
		error: 'Error when sending a message',
		emptyReqField: 'Fill in the required fields, please',
		emptyReqOneOfFields: 'Fill in one of the required fields, please',
		incorrectName: 'Incorrect name',
		incorrectPhone: 'Incorrect phone number',
		incorrectEmail: 'Incorrect email',
	},
	
	init: async function(params = {}){
		this.demo = params.demo ? true : false;
		this.inputs = document.querySelectorAll('form input, form textarea');
		for (let i = 0; i < this.inputs.length; i++) {
			this.inputs[i].addEventListener('input', function(){
				this.classList.remove('_error');
			})
			if (this.inputs[i].getAttribute('name') == 'phone') {
				this.inputs[i].addEventListener("input", this.editPhoneByMask, false);
				this.inputs[i].addEventListener("focus", this.editPhoneByMask, false);
				this.inputs[i].addEventListener("blur", this.editPhoneByMask, false);
				this.inputs[i].addEventListener("keydown", this.editPhoneByMask, false)
			}
		}
		for (let i = 0; i < document.forms.length; i++) {
			document.forms[i].addEventListener('submit', this.send.bind(this));
		}
		this.onsend = params.onsend || function(){};
		this.onerror = params.onerror || function(){};

		// Checkbox correct values
		let checkboxes = document.body.querySelectorAll('.checkbox input');
		for (let i = 0; i < checkboxes.length; i++) {
			checkboxes[i].addEventListener('input', this.setCheckboxValue);
			this.setCheckboxValue(false, checkboxes[i]);
		}
	},

	send: async function(e) {
		e.preventDefault();
		let report = e.target.querySelector('.form-report');
		report.classList.remove('ok');
		report.classList.remove('er');

		let errors = this.check(e.target);
		if (errors[0]) {
			report.classList.add('er');
			if (errors[0] == 1)
				report.innerHTML = errors[1][0];
			else
				report.innerHTML = this.messages.emptyReqField;
			return;
		}
		else report.innerHTML = '';

		let formData = new FormData(e.target);
		formData.append('form', e.target.getAttribute('name'));
		// Add elems that ignored by new FormData 
		this.addCustomInputs(e, formData, 'input-range');
		// /

		this.log(formData); // Console log to check the correctness

		e.target.classList.add('_sending');
		let response;

		if (this.demo) { // demo code
			response = await new Promise(function(resolve, reject) {
				setTimeout(() => resolve(), 2000);
			});
			response = {ok: true};
		}
		else {
			response = await fetch('php/sendmail.php', {
				method: 'POST',
				body: formData
			});
		}
		if (response.ok) {
			report.classList.add('ok');
			if (this.demo) report.innerHTML = this.messages.okDemo;
			else report.innerHTML = this.messages.ok;
			this.clean(e.target, false);
		}
		else {
			report.classList.add('er');
			report.innerHTML = this.messages.error;
		}
		e.target.classList.remove('_sending');

		// on-function
		this.onsend(e.target);
		this.onerror(e.target);
	},

	check: function(form) {
		let that = this, errors = [];
		function correctness(item) {
			switch (item.getAttribute('name')) {
				case 'name':
					if (item.value && /^.{2,99}$/.test(item.value) == false) {
						item.classList.add('_error');
						errors.push(that.messages.incorrectName);
					}
					break;
				case 'email':
					if (item.value && /^.{2,99}@.{2,99}\..{2,20}$/.test(item.value) == false) {
						item.classList.add('_error');
						errors.push(that.messages.incorrectEmail);
					}
					break;
				case 'phone':
					if (item.value && /^\+\d\s\(\d{3}\)\s\d{3}(-\d\d){2}$/.test(item.value) == false) {
						item.classList.add('_error');
						errors.push(that.messages.incorrectPhone);
					}
					break;
			}
		}
		let inputs = form.querySelectorAll('input, textarea');
		for (let i = 0; i < inputs.length; i++) {
			inputs[i].classList.remove('_error');
			if (inputs[i].classList.contains('_req') && inputs[i].value == '') {
				inputs[i].classList.add('_error');
				errors.push(this.messages.emptyReqField);
				continue;
			}
			if (inputs[i].classList.contains('_req-one')) continue;
			correctness(inputs[i]);
		}
		// this script for group of elems that has at least one requered elem
		let inputsReqOne = form.querySelectorAll('._req-one');
		let reqOneFilled = [];
		for (let i = 0; i < inputsReqOne.length; i++) {
			if (inputsReqOne[i].value != '') reqOneFilled.push(i);
		}
		if (inputsReqOne.length > 0 && reqOneFilled.length == 0) {
			for (let i = 0; i < inputsReqOne.length; i++) {
				inputsReqOne[i].classList.add('_error');
			}
			errors.push(this.messages.emptyReqOneOfFields);
		}
		else {
			for (let i = 0; i < reqOneFilled.length; i++) {
				correctness(inputsReqOne[reqOneFilled[i]]);
			}
		}
		//
		return [errors.length, errors];
	},

	log: function(formData) {
		console.log('# # # Form entries: # # #');
		for (let pair of formData.entries()) {
			console.log(pair[0] + ': ' + pair[1]);
		}
		console.log('# # # end # # #');
	},

	addCustomInputs: function(e, form, elemName) {
		let elem = e.target.querySelectorAll('.' + elemName);
		for (let i = 0; i < elem.length; i++) {
			form.append(elem[i].getAttribute('name'), elem[i].getAttribute('value'));
		}
	},

	clean: function(form, all = true) {
		if (!form) return;
		let inputs = form.querySelectorAll('input:not(.time-select__input), textarea'); // checkbox, radio, text, textarea
		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i].hasAttribute('name')) {
				switch(inputs[i].type) {
					case 'checkbox':
						inputs[i].checked = true;
						this.setCheckboxValue(false, inputs[i]);
						break;
					case 'radio':
						inputs[i].parentElement.querySelector('input').checked = true;
						break;
					case 'submit':
						break;
					default:
						inputs[i].value = '';
				}
			}
			if (all) inputs[i].classList.remove('_error');
		}
		let selects = form.querySelectorAll('select');
		for (let i = 0; i < selects.length; i++) {
			// 'onsend' resets the selects
			if (all) selects[i].classList.remove('_error');
		}
		if (all) {
			let report = form.querySelector('.form-report');
			report.classList.remove('ok');
			report.classList.remove('er');
			report.innerHTML = '';
		}
	},

	setCheckboxValue: function(e, elem = this) {
		elem.setAttribute('value', elem.checked ? elem.checked : ''); // пустое для скрипта формы, чтобы вешал класс error
	},

	// Phone mask
	editPhoneByMask: function(event) {
		event.keyCode && (keyCode = event.keyCode);
		var pos = this.selectionStart;
		if (pos < 3) event.preventDefault();
		var matrix = "+7 (___) ___-__-__",
			i = 0,
			def = matrix.replace(/\D/g, ""),
			val = this.value.replace(/\D/g, ""),
			new_value = matrix.replace(/[_\d]/g, function(a) {
				return i < val.length ? val.charAt(i++) || def.charAt(i) : a
			});
		i = new_value.indexOf("_");
		if (i != -1) {
			i < 5 && (i = 3);
			new_value = new_value.slice(0, i)
		}
		var reg = matrix.substr(0, this.value.length).replace(/_+/g,
			function(a) {
				return "\\d{1," + a.length + "}"
			}).replace(/[+()]/g, "\\$&");
		reg = new RegExp("^" + reg + "$");
		if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
		if (event.type == "blur" && this.value.length < 5)  this.value = ""
	},

}
formToEmail.init({
	demo: true,
	onsend: function(form) {
		if (form.name == 'consult-form') {
			modal.open(false, 'modal-confirm');
			setTimeout(() => {
				swipers.consult_top.slideTo(0);
				swipers.consult_bot.slideTo(0);
				modalProgressBar.i = 1;
				modalProgressBar.expand();
				select_consult_activity.reset();
			}, modal.timeout);
		}
		if (form.name == 'call-form') {
			swipers.modal_call.slideNext();
		}
		if (form.name == 'message-form') {
			swipers.modal_msg.slideNext();
		}
		if (form.name == 'access-form') {
			swipers.modal_access.slideNext();
		}
	}
});

//////////////////////////////////////////////////

// Time select
const timeSelect = {
	names: {
		activeClass: '_active',
		selectedClass: '_selected',
		selectionClass: '_selection',
	},
	init: async function() {
		this.elem = document.querySelector('.time-select');
		if (!this.elem) return;

		// Inputs
		let inputs = this.elem.querySelectorAll('.time-select__input');
		this.inputH = inputs[0];
		this.inputM = inputs[1];
		this.inputH.addEventListener('click', this.focusInput.bind(this))
		this.inputM.addEventListener('click', this.focusInput.bind(this))
		this.inputH.addEventListener('blur', this.checkInputBlur.bind(this))
		this.inputM.addEventListener('blur', this.checkInputBlur.bind(this))
		this.inputH.addEventListener('keydown', this.checkInputValue.bind(this))
		this.inputM.addEventListener('keydown', this.checkInputValue.bind(this))
		this.inputH.addEventListener('input', this.checkInputTimeFormat.bind(this))
		this.inputM.addEventListener('input', this.checkInputTimeFormat.bind(this))
		//

		// Selectors
		let selectors = this.elem.querySelectorAll('.time-select__selector');
		this.selectorH = selectors[0];
		this.selectorM = selectors[1];

		function fillSelector(that, selector, i) {
			let timeStr = i.toString();
			if (i < 10) timeStr = '0' + timeStr;
			let item = document.createElement('span');
			item.innerHTML = timeStr;
			selector.appendChild(item);
			item.addEventListener('mousedown', that.selectTime.bind(that));
		}
		for (let i = 0; i <= 23; i++) {
			fillSelector(this, this.selectorH, i);
		}
		for (let i = 0; i <= 59; i += 5) {
			fillSelector(this, this.selectorM, i);
		}
		//

		// Open/close events
		this.toggleButton = this.elem.querySelector('.time-select__header-expander');
		this.toggleButton.addEventListener('click', this.toggleSelectorBox.bind(this));
		window.addEventListener('click', this.toggleSelectorBox.bind(this));
		//

		// Scrolling parameters
		this.selectorItem = this.selectorH.children[0];
		this.computeSelectorHeight();
		window.addEventListener('resize', this.computeSelectorHeight.bind(this));
		
		this.selectTime('init', this.selectorH);
		this.selectTime('init', this.selectorM);
	},

	getPair: function(item) {
		if (!item) return false;
		if (item == this.inputH) return this.selectorH;
		if (item == this.inputM) return this.selectorM;
		if (item == this.selectorH) return this.inputH;
		if (item == this.selectorM) return this.inputM;
	},

	focusInput: function(e, elem) {
		if (e) elem = e.target;
		this.selection = elem;
		elem.select();
	},

	removeSelection: function() {
		this.selection = false;
	},

	checkInputValue: function(e) {
		// choose the input
		let isHour = true;
		if (e.target == this.inputM) isHour = false;
		// clear the input
		if (this.selection == e.target && e.key != 'Tab') {
			e.target.setAttribute('value', '');
			e.target.value = '';
			this.removeSelection();
		}
		// check value
		if (e.key.match(/[0-9]/) && e.target.value.length >= 2) {
			if (isHour) this.inputM.select();
			else e.preventDefault();
		}
		if (e.key == 'Backspace' && e.target.value.length == 0) {
			if (!isHour) {
				e.preventDefault();
				this.focusInput(false, this.inputH);
			}
		}
		if (e.key == 'Tab') {
			e.preventDefault();
			if (isHour) this.focusInput(false, this.inputM);
			else this.focusInput(false, this.inputH);
		}
	},
	checkInputTimeFormat: function(e) {
		// this.removeSelection();
		let maxValue = 23; // hours
		if (e.target == this.inputM) maxValue = 59; // minutes
		if (e.target.value > maxValue) e.target.value = maxValue;
	},
	checkInputBlur: function(e) {
		// this.removeSelection();
		if (e.target.value.length == 0) e.target.value = '00';
		if (e.target.value.length == 1) e.target.value = '0' + e.target.value;

		this.selectTime(false, this.getPair(e.target));
	},

	selectTime: function(e, selectorEl) { // events: init(1,1), select(1,0), blur(0,1)
		// fill input on selection
		if (e && e != 'init') {
			let targetInput = this.getPair(e.target.parentElement);
			targetInput.setAttribute('value', e.target.innerHTML);
			targetInput.value = e.target.innerHTML;
		}
		//

		// mark selector item
		let s = selectorEl ? selectorEl : e.target.parentElement;
		for (let i = 0; i < s.children.length; i++) {
			s.children[i].classList.remove(this.names.selectedClass);
		}

		let markingTarget, inputValue, index;
		if (selectorEl) {
			inputValue = this.getPair(selectorEl).value;
			for (let i = 0; i < selectorEl.children.length; i++) {
				if (selectorEl && selectorEl.children[i].innerHTML == inputValue) {
					markingTarget = selectorEl.children[i];
					index = i;
					break;
				}
			}
			// scroll into view
			if (markingTarget) markingTarget.parentElement.scrollTop = this.selectorHeight * (index - 2);
		}
		else markingTarget = e.target;
		if (markingTarget) markingTarget.classList.add(this.names.selectedClass);
	},

	computeSelectorHeight: function() {
		this.selectorHeight = parseFloat(getComputedStyle(this.selectorItem).height);
	},

	toggleSelectorBox: function(e) {
		e.stopPropagation();
		if (e.currentTarget == this.toggleButton) {
			if (this.elem.classList.contains(this.names.activeClass)) this.elem.classList.remove(this.names.activeClass);
			else this.elem.classList.add(this.names.activeClass);
		}
		else {
			if (e.target.closest('.time-select')) return;
			else if (this.elem.classList.contains(this.names.activeClass)) this.elem.classList.remove(this.names.activeClass);
		}
	},
}
timeSelect.init()

//////////////////////////////////////////////////

// Decor image settings
const decorImage = {
	init: function() {
		this.elem = document.querySelector('.decor-img');
		if (!this.elem) return;

		this.clone = document.querySelector('.about__image');
		if (this.clone) {
			this.clone.innerHTML = this.elem.outerHTML;
			this.clone = this.clone.children[0];
		}

		let angle = 'rotate(' + getRandomNumber(0, 360) + 'deg)';
		this.elem.querySelector('img').style.transform = angle;
		if (this.clone) this.clone.querySelector('img').style.transform = angle;

		let that = this;
		window.addEventListener('DOMContentLoaded', function() {
			setTimeout(()=> {
				that.elem.classList.add('loaded');
				if (that.clone) that.clone.classList.add('loaded');
			}, 200)
		})
	}
}
decorImage.init()

//////////////////////////////////////////////////

// Mobile background height calculator
const mobileBackground = {
	init: async function() {
		this.elem = document.body.querySelector('.mobile-background');
		this.calcItem = document.body.querySelector('.mob-bg-calc');
		if (!this.elem || !this.calcItem) return;
		
		this.iScroll = this.iHeight = 0;
		window.addEventListener('resize', this.setHeight.bind(this));
		this.setHeight();
	},
	setHeight: function() {
		let iScroll = Math.round(this.calcItem.getBoundingClientRect().y + scrollY);
		let iHeight = this.calcItem.offsetHeight;
		if (iScroll != this.iScroll || iHeight != this.iHeight) {
			this.iScroll = iScroll;
			this.iHeight = iHeight;
			this.elem.style.height = this.iScroll + this.iHeight + 'px';
		}
	}
}
mobileBackground.init();

//////////////////////////////////////////////////

modal.init({
	closeOldIfNew: true,
	on: {
		'any': {
			open: function(event, content, timeout) {
				header.headerElem.classList.add('_active-modal-z');

				if (content.className.match(/--light/)) {
					header.headerElem.classList.remove('_active-modal-dark');
					header.headerElem.classList.add('_active-modal-light');
				}
				if (content.className.match(/--dark/)) {
					header.headerElem.classList.remove('_active-modal-light');
					header.headerElem.classList.add('_active-modal-dark');
				}
				
				headerMenuCloseButton.classList.add('_active');
				window.scroll({top: 0, behavior: 'smooth'});
			},
			close: function(event, content, timeout) {
				let openedModals = modal.check();
				if (!openedModals) {
					header.headerElem.classList.remove('_active-modal-light');
					header.headerElem.classList.remove('_active-modal-dark');
					header.headerElem.classList.remove('_active-modal-transform'); //?
					headerMenuCloseButton.classList.remove('_active');
					setTimeout(()=>{header.headerElem.classList.remove('_active-modal-z')}, timeout);
				}
			},
		},
		'modal-call': {
			close: function(event, content, timeout) {
				setTimeout(() => {
					swipers.modal_call.slidePrev();
				}, timeout);
			}
		},
		'modal-message': {
			close: function(event, content, timeout) {
				setTimeout(() => {
					swipers.modal_msg.slidePrev();
				}, timeout);
			}
		},
		'modal-access': {
			close: function(event, content, timeout) {
				setTimeout(() => {
					swipers.modal_access.slidePrev();
				}, timeout);
			}
		}
	}
})

//////////////////////////////////////////////////

// Prevent 'tabbing'
let noTabElements = document.body.querySelectorAll('a, button, input, textarea');
for (let i = 0; i < noTabElements.length; i++) {
	noTabElements[i].setAttribute('tabindex','-1');
}
