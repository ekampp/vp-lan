$.page('/admin/games', function(ctx) {
	var md = new (require('showdown').converter)().makeHtml

	$('.js-select-game').on('change', function(event) {
		var select = event.target
		if(select.value) {
			$.ajax(
				{ url: '/games/' + select.value
				, method: 'get'
				, type: 'json'
				, accept: 'application/json'
				})
				.promise.then(function(res) {
					var data = res.body
					  , visibility = data.visibility || 'visible'
					delete data.visibility
					Object.keys(data).forEach(function(key) {
						$('[name=' + key + ']', '.js-form-games').val(''+data[key])
					})
					$('[name=visibility][value='+visibility+']', '.js-form-games')
						.attr('checked', true)
					updatePreviewArea()
				})
		}
	})

	$('.js-btn-delete').on('click', function() {
		var id = $('[name=id]', '.js-form-games').val()
		if(!id) {
			return
		}
		$.ajax('/games/' + id, { method: 'delete', accept: 'application/json' })
		$('.js-select-game [value="' + id + '"	]', '.js-form-games')
			.remove()
	})

	$('.js-btn-preview').on('click', updatePreviewArea)
	$('.js-chk-preview-auto').on('change', function(event) {
		var checkbox = event.target
		  , method = checkbox.checked ? 'on' : 'off'
		$('input, textarea', '.js-form-games')[method]('keyup', updatePreviewArea)
	})

	function updatePreviewArea() {
		var markdown = $('[name=text]', '.js-form-games').val()
		  , html = md(markdown)
		$('.js-preview-text').html(html)

		$('.js-preview-title').html($('[name=name]', '.js-form-games').val())
	}
})
