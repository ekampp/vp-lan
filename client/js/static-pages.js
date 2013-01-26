;(function() {
	$.page('/static-pages', function(ctx) {
		var md = new (require('showdown').converter)().makeHtml
		$('.js-select-page').on('change', function(event) {
			var select = event.target
			$.ajax(
				{ url: '/static-pages/' + select.value
				, method: 'get'
				, type: 'json'
				, accept: 'application/json'
				})
				.promise.then(function(res) {
					var data = res.body
					Object.keys(data).forEach(function(key) {
						$('[name=' + key + ']').val(data[key])
					})
					updatePreviewArea()
				})
		})
		$('.js-btn-preview').on('click', updatePreviewArea)
		$('.js-chk-preview-auto').on('change', function(event) {
			var checkbox = event.target
			  , method = checkbox.checked ? 'on' : 'off'
			$('[name=content], [name=name]')[method]('keyup', updatePreviewArea)
		})

		function updatePreviewArea() {
			var markdown = $('[name=content]').val()
			  , html = md(markdown)
			$('.js-preview-content').html(html)

			$('.js-preview-header').html($('[name=name]').val())
		}
	})
})()
