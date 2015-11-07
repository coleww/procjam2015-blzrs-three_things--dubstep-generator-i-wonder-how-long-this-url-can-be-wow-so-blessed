var procjam2015BlzrsThreeThings = require('../')

document.getElementById('input').addEventListener('keyup', function (e) {
  document.getElementById('output').textContent = procjam2015BlzrsThreeThings(document.getElementById('input').value)
})
