// Constants //
const mobileSwitchWidth = parseFloat(getComputedStyle(document.body).getPropertyValue('--media-mobile')) || 768;

//////////////////////////////////////////////////

// Random //
// @ @include('front/random.js')

//////////////////////////////////////////////////

// Cookies //
// @ @include('front/cookies.js')
// let cookies = getCookie();
// console.log(cookies);

//////////////////////////////////////////////////

// Loadscreen //
// @ @include('front/loadscreen.js')
// loadscreen.init({
// 	timeout: 1000,
// 	scrollToTop: true
// })

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
	init: function(params = {}) {
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

	init: function(params = {}) {
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
scrollLock.init()

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
		this.headerHeight = this.headerElem.offsetHeight;
		if (this.elemAboveHeader) {
			this.headerOffset = this.headerPosition = this.elemAboveHeader.offsetHeight;
		}
		else this.headerOffset = this.headerPosition = 0;
		this.setCssVar();
		this.hidingHeader.calc();
	},
	setCssVar: function() {
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
		// this.menu.hideOnViewChange();
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
			this.buttons = this.root.headerElem.querySelectorAll(`${names.menuOpenBtn}, ${names.menuCloseBtn}, ${names.menuArea}`);
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

			for (let i = 0; i < this.buttons.length; i++) {
				this.buttons[i].addEventListener('click', this.toggle.bind(this));
			}
		},
		toggle: function(e) {
			if (!this.isLoaded) return;
			if (this.root.refs.translock.check(this.timeout)) return;
			
			if (this.menuElem.classList.contains('_active')) {
				this.menuElem.classList.remove('_active');
				this.root.headerElem.classList.remove('_active');
				for (let i = 0; i < this.buttons.length; i++) {
					this.buttons[i].classList.remove('_active');
				}
				this.root.refs.scrlock.unlock(this.timeout);
				this.root.submenu.closeAll(); // submenu reference
			}
			else {
				if (e) {
					this.menuElem.classList.add('_active');
					this.root.headerElem.classList.add('_active');
					for (let i = 0; i < this.buttons.length; i++) {
						this.buttons[i].classList.add('_active');
					}
					this.root.refs.scrlock.lock();
					this.root.hidingHeader.scroll(0, true); // hidingHeader reference
				}
			}
		},
		hideOnViewChange: function() {
			// this func prevents menu blinking on mobile view switch
			if (this.isLoaded) {
				let that = this;
				this.menuElem.style.visibility = 'hidden';
				setTimeout(() => {
					that.menuElem.style.visibility = '';
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
	- elem - element name (default = 'modal'),
	- linkName - modal link name (default = 'modal-link')
	- on: {'modal-window': {open, close}} - event function(event, content, timeout){}

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
		header: header.menu.menuElem
	},
	init: function(params = {}){
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
	},
	open: function(e){
		if (this.refs.translock.check(this.timeout)) return;
		e.preventDefault();
		let currentModal = this.elem.querySelector(e.currentTarget.getAttribute('href'));
		currentModal.classList.add('_open');
		if (this.on[currentModal.id] && this.on[currentModal.id].open)
			this.on[currentModal.id].open(
				e, 
				currentModal.querySelector('.' + this.elemName + '__content > *:not(.' + this.elemName + '__close-button)'),
				this.timeout
			);
		modal.check();
	},
	closeThis: function(e){
		if (this.refs.translock.check(this.timeout)) return;
		let currentModal = e.target.closest('.' + this.elemName + '__window');
		currentModal.classList.remove('_open');
		if (this.on[currentModal.id] && this.on[currentModal.id].close)
			this.on[currentModal.id].close(
				e, 
				currentModal.querySelector('.' + this.elemName + '__content > *:not(.' + this.elemName + '__close-button)'),
				this.timeout
			);
		modal.check();
	},
	closeAll: function(){
		if (this.refs.translock.check(this.timeout)) return;
		for (let i = 0; i < this.windows.length; i++) {
			if (this.windows[i].classList.contains('_open')) {
				this.windows[i].classList.remove('_open');
				if (this.on[this.windows[i].id] && this.on[this.windows[i].id].close)
					this.on[this.windows[i].id].close(0,0,this.timeout);
			}
		}
		modal.check();
	},
	check: function(){
		let openedWindows = 0;
		for (let i = 0; i < this.windows.length; i++) {
			if (this.windows[i].classList.contains('_open')) openedWindows++;
		}
		if (openedWindows) {
			this.elem.classList.add('_visible');
			this.refs.scrlock.lock();
		}
		else {
			this.elem.classList.remove('_visible');
			if (!this.refs.header.classList.contains('_active'))
				this.refs.scrlock.unlock(this.timeout);
		}
	}
}
modal.init()

//////////////////////////////////////////////////

// Popup //
// @ @include('front/popup.js')
// let test_popup = new Popup({
// 	elem: 'test-popup'
// });
// Place each popup's code below

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
		this.list = this.elem.querySelector('.select__list-wrapper');
		this.list.innerHTML = '';

		this.basicSelect = this.elem.querySelectorAll('select option');

		let newList = document.createElement('ul');
		newList.classList.add('select__list');
		this.list.appendChild(newList);
		for (let i = 0; i < this.basicSelect.length; i++) {
			if (this.basicSelect[i].hasAttribute('disabled')) continue;
			let newLi = document.createElement('li');
			newLi.classList.add('select__option');
			newLi.innerHTML = this.basicSelect[i].innerHTML;
			newList.appendChild(newLi);
		}

		this.options = this.elem.querySelectorAll('.select__option');
		this.listMaxHeight = this.elem.querySelector('.select__list').offsetHeight;
		let that = this;
		for (let i = 0; i < this.options.length; i++) {
			this.options[i].addEventListener('click', function() {
				that.selectItem(event, that, i);
			});
		};
		this.header.addEventListener('click', this.showList.bind(this));
		window.addEventListener('click', this.hideList.bind(this), {capture: true});
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
		this.list.style.height = '';
		this.elem.classList.remove('_active');
		this.list.classList.remove('_active');
		let that = this;
		setTimeout(() => {that.isOpened = false}, 100);
	}
	showList(e) {
		if (this.isOpened) return;
		this.list.style.height = this.listMaxHeight + 'px';
		this.elem.classList.add('_active');
		this.list.classList.add('_active');
		this.isOpened = true;
	}
	selectItem(e, that, i) {
		for (let j = 0; j < e.target.parentElement.children.length; j++) {
			e.target.parentElement.children[j].classList.remove('_selected');
			that.basicSelect[j].removeAttribute('selected');
		}
		e.target.classList.add('_selected');
		that.basicSelect[i+1].setAttribute('selected', 'true');
		that.onselect(that.basicSelect[i+1].value);
		that.headertext.innerHTML = e.target.innerHTML;
	}
}
const select_consult_activity = new Select({
	elem: 'consult-form__select',
	firstOptSelected: true,
	// onselect: (selection) => {console.log(selection)}
})

//////////////////////////////////////////////////

// Accordion //
// @ @include('front/accordion_js.js')
// const accordion = new Accordion({
// 	elem: '.js__accordion',
// 	isOpened: true
// });

//////////////////////////////////////////////////

// Simple counter //
// @ @include('front/simple_counter.js')
// const simpleCounter = new SimpleCounter({
// 	launcher: '.test-counter-button',
// 	output: '.test-counter',
// 	goal: 51806,
// 	timeout: 2,
// })
// simpleCounter.start()

//////////////////////////////////////////////////

// Input range colored //
// @ @include('front/input_range_colored.js')
// const iRangeClr = new InputRangeColored({
// 	elem: 'input-range'
// })

//////////////////////////////////////////////////

// Input range double //
// @ @include('front/input_range_double.js')
// const iRangeDbl = new InputRangeDouble({
// 	elem: 'form__input-range-dbl',
// 	start: 200,
// 	end: 492,
// 	thumbs: [250, 400],
// 	bubble: true,
// 	results: ['form__ir-result1', 'form__ir-result2']
// })

//////////////////////////////////////////////////

// Spoiler //
// @ @include('front/spoiler.js')
// spoiler.init();

//////////////////////////////////////////////////

// Tabs //
// @ @include('front/tabs.js')

//////////////////////////////////////////////////

// Up-button //
// @ @include('front/up_button.js')
// upButton.init();

//////////////////////////////////////////////////

// Intersection //
// @ @include('front/intersection.js')

//////////////////////////////////////////////////

// Parallax //
// @ @include('front/parallax.js')
// const parallax = new Parallax({
// 	parallaxElem: '.parallax',
// 	scrollElem: '.container',
// 	start: 500,
// 	distance: 30,
// })

//////////////////////////////////////////////////

// Pagination //
// @ @include('front/pagination.js')
// const pagination = new Pagination({
// 	elem: '.pagination',
// 	maxLength: 8,
// })

//////////////////////////////////////////////////

// Video player //
// @ @include('front/video_player.js')
// videoPlayer.init(80);

//////////////////////////////////////////////////

// Swiper //
const swipers = {
	features: '.features-slider',
	consult_top: '.modal__title-slider',
	consult_bot: '.consult-form__slider'
};

if (typeof Swiper !== 'undefined') {
	swipers.new = swipers.features;
	swipers.features = new Swiper(swipers.new, {
		slidesPerView: 'auto',
		slidesOffsetBefore: 30,
		slidesOffsetAfter: 15,
		spaceBetween: 10,
		freeMode: true,
	})
	swipers.new = swipers.consult_top;
	swipers.consult_top = new Swiper(swipers.new, {
		speed: 500,
		spaceBetween: 30,
		allowTouchMove: false
	})
	swipers.new = swipers.consult_bot;
	swipers.consult_bot = new Swiper(swipers.new, {
		speed: 500,
		spaceBetween: 30,
		allowTouchMove: false
	})

}


// Swiper no-internet version
else {
	let swipersSpaceBetween = 30;
	console.log('Swiper reserve "non-internet" code included!');

addSwiperReserveMovingScript = function(elem) {
	elem.children[0].classList.add('active-slide');

	elem.moveSlide = function(side) {
		let activeSlide = 0;
		for (let i = 0; i < this.children.length; i++) {
			if (this.children[i].classList.contains('active-slide')) {
				activeSlide = i;
				break;
			}
		}
		if (side == 'prev') {
			if (activeSlide == 0) return;
			this.children[activeSlide].classList.remove('active-slide');
			activeSlide--;
		}
		if (side == 'next') {
			if (activeSlide == this.children.length-1) return;
			this.children[activeSlide].classList.remove('active-slide');
			activeSlide++;
		}
		this.children[activeSlide].classList.add('active-slide');
		this.style.left = 'calc(' + activeSlide * -100 + '% - ' + swipers.spaceBetween * activeSlide + 'px';
	}

	elem.slidePrev = function() {
		elem.moveSlide('prev');
	}
	elem.slideNext = function() {
		elem.moveSlide('next');
	}
}

for (let swiperElem in swipers) {
	let newSwiperSelector = swipers[swiperElem] + ' .swiper-wrapper';
	swipers[swiperElem] = document.querySelector(newSwiperSelector);
	addSwiperReserveMovingScript(swipers[swiperElem]);
}

swipers.spaceBetween = swipersSpaceBetween;

let swiperReserveStyles = document.createElement('style');
document.head.appendChild(swiperReserveStyles);
swiperReserveStyles.innerHTML =
	'.swiper {width: 100%; position: relative;}' +
	'.swiper-wrapper {position: relative; top: 0; left: 0%; display: flex; transition: left .5s;}' +
	'.swiper-slide {flex: 0 0 100%;}' +
	'.swiper-slide:not(:first-child) {margin-left: ' + swipers.spaceBetween + 'px;}}';
}


// Quiz
let modalProgressBar = {
	elem: document.querySelector('.modal__progressbar-inner'),
	total: document.querySelector('.consult-form__slider .swiper-wrapper').children.length,
	i: 1,
	expand: function() {
		this.elem.style.width = this.i / this.total * 100 + '%';
	}
}
modalProgressBar.expand();


swipers.slideButtons = document.querySelectorAll('.swiper-slide-button');
for (let i = 0; i < swipers.slideButtons.length; i++) {
	swipers.slideButtons[i].addEventListener('click', function(e) {
		e.preventDefault();
		if (transitionLock.check( 500 )) return;
		swipers.consult_top.slideNext();
		swipers.consult_bot.slideNext();
		if (modalProgressBar.i < modalProgressBar.total) modalProgressBar.i++;
		modalProgressBar.expand();
	})
}
swipers.slideBackButtons = document.querySelectorAll('.slider-back-button');
for (let i = 0; i < swipers.slideBackButtons.length; i++) {
	swipers.slideBackButtons[i].addEventListener('click', function(e) {
		e.preventDefault();
		if (transitionLock.check( 500 )) return;
		swipers.consult_top.slidePrev();
		swipers.consult_bot.slidePrev();
		if (modalProgressBar.i > 0) modalProgressBar.i--;
		modalProgressBar.expand();
	})
}

//////////////////////////////////////////////////

// Print version QR-code //
// @ @include('front/qr_code.js')
// printQRcode();

//////////////////////////////////////////////////

// Send form to email //
// @ @include('back/form_to_email.js')
// formToEmail.init(true);

//////////////////////////////////////////////////

// JSON Load //
// @ @include('back/json_load.js')

//////////////////////////////////////////////////

// Body 'em' checker
// window.addEventListener('resize', bodyEmCheck);
// function bodyEmCheck() {
// 	console.log('Body "em" checker. Current font-size: ' + getComputedStyle(document.body).fontSize);
// }
// bodyEmCheck();

//////////////////////////////////////////////////

// Time select
let timeSelect = {
	names: {
		activeClass: 'active',
		selectedClass: 'selected'
	},
	init: function() {
		this.elem = document.querySelector('.time-select');
		if (!this.elem) return;

		// Inputs
		let inputs = this.elem.querySelectorAll('.time-select__input');
		this.inputH = inputs[0];
		this.inputM = inputs[1];
		this.inputH.addEventListener('click', function() {this.select()})
		this.inputM.addEventListener('click', function() {this.select()})
		this.inputH.addEventListener('keydown', this.checkInputHourValue.bind(this))
		this.inputM.addEventListener('keydown', this.checkInputMinuteValue.bind(this))
		this.inputH.addEventListener('input', this.checkInputTimeFormat.bind(this))
		this.inputM.addEventListener('input', this.checkInputTimeFormat.bind(this))
		this.inputH.addEventListener('blur', this.checkInputBlur.bind(this))
		this.inputM.addEventListener('blur', this.checkInputBlur.bind(this))
		//

		// Selectors
		let selectors = this.elem.querySelectorAll('.time-select__selector');
		this.selectorH = selectors[0];
		this.selectorM = selectors[1];

		function fillSelector(that, selector, i) {
			let timeStr = i.toString();
			if (i < 10) timeStr = '0' + timeStr;
			let newItem = document.createElement('span');
			newItem.innerHTML = timeStr;
			selector.appendChild(newItem);
			newItem.addEventListener('mousedown', that.selectTime.bind(that));
		}
		for (let i = 0; i <= 23; i++) {
			fillSelector(this, this.selectorH, i);
		}
		for (let i = 0; i <= 59; i += 5) {
			fillSelector(this, this.selectorM, i);
		}
		this.selectTime('init', this.selectorH.children[0]);
		this.selectTime('init', this.selectorM.children[0]);
		//

		// Open/close events
		this.toggleButton = this.elem.querySelector('.time-select__header-expander');
		this.toggleButton.addEventListener('click', this.toggleSelectorBox.bind(this));
		window.addEventListener('click', this.toggleSelectorBox.bind(this));
		//
	},

	getPair: function(item) {
		if (!item) return false;
		if (item == this.inputH) return this.selectorH;
		if (item == this.inputM) return this.selectorM;
		if (item == this.selectorH) return this.inputH;
		if (item == this.selectorM) return this.inputM;
	},

	checkInputHourValue: function(e) {
		if (window.getSelection().type != 'Range' && e.target.value.length >= 2 && e.key.match(/[0-9]/)) {
			this.inputM.select();
		}
	},
	checkInputMinuteValue: function(e) {
		if (window.getSelection().type != 'Range' && e.target.value.length >= 2 && e.key.match(/[0-9]/)) {
			e.preventDefault();
		}
		if (e.target.value.length == 0 && e.key == 'Backspace') {
			this.inputH.select();
		}
	},
	checkInputTimeFormat: function(e) {
		let maxValue = 23; // hours
		if (e.target == this.inputM) maxValue = 59; // minutes
		if (e.target.value > maxValue) e.target.value = maxValue;
	},
	checkInputBlur: function(e) {
		if (e.target.value.length == 0) e.target.value = '00';
		if (e.target.value.length == 1) e.target.value = '0' + e.target.value;

		// Choose & Mark time in Selector
		let markingTarget, markingSelector = this.getPair(e.target);
		for (let i = 0; i < markingSelector.children.length; i++) {
			if (markingSelector.children[i].innerHTML == e.target.value) {
				markingTarget =  markingSelector.children[i];
			}
		}
		this.selectTime(false, markingTarget);
	},

	selectTime: function(e, selectorItem) {
		if (e) {
			if (e != 'init') selectorItem = e.target;
			// fill input
			let targetInput = this.getPair(selectorItem.parentElement);
			targetInput.value = selectorItem.innerHTML;
		}

		// mark selector item
		let selector;
		if (selectorItem) selector = selectorItem.parentElement;
		else selector = this.selectorM;
		for (let i = 0; i < selector.children.length; i++) {
			selector.children[i].classList.remove('selected');
		}
		if (selectorItem) {
			selectorItem.classList.add('selected');
			if (!e) selectorItem.scrollIntoView({block: "center"});
		}
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
timeSelect.init();
