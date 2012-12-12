var ender = require('ender')

  , packages =
    [ 'reqwest'
    , 'bean'
    , 'bonzo'
    , 'q'
    , 'page'
    , 'showdown'
    ]
  , options =
    { output: 'client/js/ender'
    }

ender.build(packages, options, function() {
})
