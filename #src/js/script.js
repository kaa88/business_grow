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

//////////////////////////////////////////////////

// Modal window //
@@include('front/modal.js')
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
