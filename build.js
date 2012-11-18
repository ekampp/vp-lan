var ender = require('ender')

  , packages =
    [ 'reqwest'
    , 'bean'
    , 'bonzo'
    , 'q'
    ]
  , options =
    { output: 'client/js/ender'
    }

ender.build(packages, options, function() {
})
