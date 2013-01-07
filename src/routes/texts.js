module.exports = function setup(app) {
	app.get('/texts/:group', loadTexts)
}

var l10n = require('../l10n')

function loadTexts(req, res) {
	var table = l10n.get(req.params.group)
	res.send(table || 404)
}
