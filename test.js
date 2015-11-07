var tap = require('tape')

var procjam2015BlzrsThreeThings = require('./')

tap.test('does the thing', function (t) {
  t.plan(1)
  t.equal(procjam2015BlzrsThreeThings('world'), 'hello world', 'does it')
})
