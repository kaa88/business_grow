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