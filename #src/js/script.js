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
scrollLock.init()

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

//////////////////////////////////////////////////

// Footer //
@@include('front/footer.js')
footer.init()

// console.log(document.querySelector('.header').offsetHeight + ' ' + document.querySelector('.main').offsetHeight + ' ' + document.querySelector('.footer').offsetHeight + ' ' + document.body.offsetHeight)

//////////////////////////////////////////////////

// Modal window //
@@include('front/modal.js')

// modal closing with header menu button
let headerMenuCloseButton = document.querySelector('.header-menu-close-btn');
headerMenuCloseButton.addEventListener('click', function() {
	modal.closeAll(true);
})
//

// clone footer to modal window to provide scrolling
let footerCloneContainers = document.body.querySelectorAll('.modal__footer-clone');
for (let i = 0; i < footerCloneContainers.length; i++) {
	footerCloneContainers[i].innerHTML = document.body.querySelector('.footer').outerHTML;
}
//

modal.init({
	closeOldIfNew: true,
	on: {
		'any': {
			open: function(event, content, timeout) {
				header.headerElem.classList.add('_active-modal-z');

				if (content.className.match(/--light/)) header.headerElem.classList.add('_active-modal-light');
				if (content.className.match(/--dark/)) header.headerElem.classList.add('_active-modal-dark');
				
				headerMenuCloseButton.classList.add('_active');
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
		}
	}
})

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
	features: '.features-slider',
	consult_top: '.modal__title-slider',
	consult_bot: '.consult-form__slider',
	modal_call: '.modal__call-slider',
	modal_msg: '.modal__msg-slider',
	settings: {
		speed: 500,
		spaceBetween: 30,
	}
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
		speed: swipers.settings.speed,
		spaceBetween: swipers.settings.spaceBetween,
		allowTouchMove: false
	})
	swipers.new = swipers.consult_bot;
	swipers.consult_bot = new Swiper(swipers.new, {
		speed: swipers.settings.speed,
		spaceBetween: swipers.settings.spaceBetween,
		allowTouchMove: false
	})
	swipers.new = swipers.modal_call;
	swipers.modal_call = new Swiper(swipers.new, {
		speed: swipers.settings.speed,
		spaceBetween: swipers.settings.spaceBetween,
		allowTouchMove: false
	})
	swipers.new = swipers.modal_msg;
	swipers.modal_msg = new Swiper(swipers.new, {
		speed: swipers.settings.speed,
		spaceBetween: swipers.settings.spaceBetween,
		allowTouchMove: false
	})
}


// Swiper no-internet version
else {
	swipers.settings = {
		spaceBetween: 30,
		overflowHidden: true
	}
	@@include('front/swiper.js')
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
// @ @include('front/qr_code.js')
// printQRcode();

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
	}
});

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
		activeClass: '_active',
		selectedClass: '_selected'
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

		this.selectTime(false, this.getPair(e.target));
	},

	selectTime: function(e, selectorEl) { // events: init(1,1), select(1,0), blur(0,1)
		// fill input on selection
		if (e && e != 'init') {
			let targetInput = this.getPair(e.target.parentElement);
			targetInput.setAttribute('value', e.target.innerHTML);
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
			if (markingTarget) markingTarget.parentElement.scrollTop = this.selectorItemHeight * (index - 2);
		}
		else markingTarget = e.target;
		if (markingTarget) markingTarget.classList.add(this.names.selectedClass);
	},

	computeSelectorHeight: function() {
		this.selectorItemHeight = parseFloat(getComputedStyle(this.selectorItem).height);
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
