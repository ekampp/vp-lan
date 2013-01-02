var ender = require('ender')

  , packages =
    [ 'fajax'
    , 'bean'
    , 'bonzo'
    , 'q'
    , 'page'
    , 'showdown'
    , 'mustache'
    ]
  , options =
    { output: 'client/js/ender'
    }

ender.build(packages, options, function() {
})
