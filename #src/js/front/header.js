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