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