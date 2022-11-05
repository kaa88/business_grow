// Developer panel //
@@include('front/_dev_panel.js')
// window.addEventListener('load', developer_panel.init);

//////////////////////////////////////////////////

// User Agent
	// if (navigator.userAgent.toLowerCase().match(/mac|ios|iphone|ipad/)) document.body.classList.add('useragent-safari');
	// if (navigator.userAgent.toLowerCase().match(/firefox/)) document.body.classList.add('useragent-firefox');

	// console.log(navigator.userAgent)
	// console.log(navigator.platform)
	// if (navigator.userAgent.includes('Firefox')) console.log('Firefox');

		// Ключевые слова по браузерам:
		// Chrome / Safari - Chrome Safari
		// Firefox - Firefox
		// Opera - Chrome Safari OPR
		// Edge - Chrome Safari Edg
		// Yandex - Chrome Safari YaBrowser Yowser

		// navigator.userAgent в консоли:
		// chrome - Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36
		// Safari - Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/ ... Version/12.1.2. Safari/605.1.15
		// Firefox - Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0

//////////////////////////////////////////////////

// Constants //
const mobileSwitchWidth = parseFloat(getComputedStyle(document.body).getPropertyValue('--media-mobile')) || 768;

//////////////////////////////////////////////////

// Random //
@@include('front/random.js')

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
@@include('front/js_media_queries.js')
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
@@include('front/scroll_lock.js')
scrollLock.init({
	useDefaultGroups: false
})

//////////////////////////////////////////////////

// Transition lock //
@@include('front/trans_lock.js')

//////////////////////////////////////////////////

// Header //
@@include('front/header.js')
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
@@include('front/footer.js')
footer.init()

// console.log(document.querySelector('.header').offsetHeight + ' ' + document.querySelector('.main').offsetHeight + ' ' + document.querySelector('.footer').offsetHeight + ' ' + document.body.offsetHeight)

//////////////////////////////////////////////////

// Modal window //
@@include('front/modal.js')

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

// Popup //
// @ @include('front/popup.js')
// let test_popup = new Popup({
// 	elem: 'test-popup'
// });
// Place each popup's code below

//////////////////////////////////////////////////

// Select //
@@include('front/select.js')
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

// Swiper no-internet version
else {
	swipers.settings = {
		spaceBetween: 30,
		overflowHidden: true
	}
	@@include('front/swiper.js')
}
//

// Quiz
const modalProgressBar = {
	init: function() {
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
// swipers.callSlideButton = document.querySelector('#modal-call .text-button-simple');
// swipers.callSlideButton.addEventListener('click', function(e) {
// 	e.preventDefault();
// 	if (transitionLock.check( swipers.settings.speed )) return;
// 	swipers.modal_call.slideNext();

// 	header.headerElem.classList.add('_active-modal-transform');
// })
// swipers.msgSlideButton = document.querySelector('#modal-message .text-button-simple');
// swipers.msgSlideButton.addEventListener('click', function(e) {
// 	e.preventDefault();
// 	if (transitionLock.check( swipers.settings.speed )) return;
// 	swipers.modal_msg.slideNext();

// 	header.headerElem.classList.add('_active-modal-transform');
// })

// console.log(swipers)

// delete the folowing
// swipers.slideBackButtons = document.querySelectorAll('.slider-back-button');
// for (let i = 0; i < swipers.slideBackButtons.length; i++) {
// 	swipers.slideBackButtons[i].addEventListener('click', function(e) {
// 		e.preventDefault();
// 		if (transitionLock.check( 500 )) return;
// 		swipers.consult_top.slidePrev();
// 		swipers.consult_bot.slidePrev();
// 		if (modalProgressBar.i > 0) modalProgressBar.i--;
// 		modalProgressBar.expand();
// 	})
// }

//////////////////////////////////////////////////

// Print version QR-code //
@@include('front/qr_code.js')
printQRcode(100); // param = size

//////////////////////////////////////////////////

// Send form to email //
@@include('back/form_to_email.js')
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

// JSON Load //
// @ @include('back/json_load.js')

//////////////////////////////////////////////////

// Time select
const timeSelect = {
	names: {
		activeClass: '_active',
		selectedClass: '_selected',
		selectionClass: '_selection',
	},
	init: function() {
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
	
	// checkInputHourValue: function(e) {
	// 	if (this.selection != e.target && e.target.value.length >= 2 && e.key.match(/[0-9]/)) {
	// 		this.inputM.select();
	// 	}
	// },
	// checkInputMinuteValue: function(e) {
	// 	if (this.selection != e.target && e.target.value.length >= 2 && e.key.match(/[0-9]/)) {
	// 		e.preventDefault();
	// 	}
	// 	if (e.target.value.length == 0 && e.key == 'Backspace') {
	// 		e.preventDefault();
	// 		this.inputH.select();
	// 	}
	// },
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
timeSelect.init();

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
decorImage.init();

//////////////////////////////////////////////////

// Mobile background height calculator
const mobileBackground = {
	init: function() {
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
