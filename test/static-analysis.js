describe('static-analysis.js', function() {
	var sa = require('../src/static-analysis')
	describe('When analyzing the l10n part', function() {
		var l10n = require('../src/l10n')
		it('should have no unmet refs', function() {
			return expect(sa.l10n.unmetRefs(__dirname + '/../views', l10n.get))
				.to.eventually.have.property('length', 0)
		})
	})
})
