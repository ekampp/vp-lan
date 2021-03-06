;(function() {
	$.page('/user', handleProfile)
	$.page('/users/:username', handleProfile)
	$.page('/signup', handleProfile)
	function handleProfile(ctx) {
		$('form').on('submit', function(event) {
			var form = event.target
			  , errors = validationErrors(form)
			if(errors) {
				$.texts('users').then(function(texts) {
					$('.form__errs').html(errors.map(function(error) {
						return '<div>' + texts('users', error) + '</div>'
					}).join(''))
				}).done()
				event.preventDefault();
			}
		})
		$('.js-btn-del-user').on('click', function(event) {
			var button = event.target
			  , deletingSelf = !ctx.params.username
			if(confirm(button.getAttribute('data-txt-confirm'))) {
				$.ajax(
				{ method: 'delete'
				, url: '/user' + (deletingSelf ? '' : 's/' + ctx.params.username)
				}).promise.then(function(res) {
					if(res.status < 300) {
						sessionStorage.setItem('msg', button.getAttribute('data-txt-deleted'))
						location.href = deletingSelf ? '/event' : '/users'
					}
					console.log(res)
				})
			}
		})
	}

	function validationErrors(form) {
		var errors = []
		  , moment = require('moment')

		if(!form.username.value.trim()) {
			errors.push('VALIDATION NO USERNAME')
		}
		if($('label[for=in-password].form__lbl--mandatory').length
		&& !form.password.value.trim())
		{
			errors.push('VALIDATION NO PASSWORD')
		}
		if(!/.*@.*\..*/.test(form.email.value)) {
			errors.push('VALIDATION INVALID EMAIL')
		}
		if(!form.name.value.trim()) {
			errors.push('VALIDATION NO NAME')
		}
		if(!/\d{4}-\d{2}-\d{2}/.test(form.age.value)) {
			errors.push('VALIDATION AGE INVALID')
		} else {
			var age = moment(form.age.value)
			  , now = moment()
			if(now.diff(age, 'years', true) < 15) {
				errors.push('VALIDATION AGE TOO LOW')
			}
		}

		return errors.length ? errors : null
	}
})()
