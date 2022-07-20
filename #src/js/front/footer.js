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