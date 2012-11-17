var ender = require('ender')

  , packages =
    [ 'reqwest'
    , 'bean'
    , 'bonzo'
    , 'q'
    ]
  , options =
    { output: 'static/js/ender'
    }

ender.build(packages, options, function() {
})
