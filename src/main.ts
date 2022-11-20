import Game from './Game.js'
import { resize } from './resize.js'

const WIDTH = 360
const HEIGHT = 640

const game = new Game(WIDTH, HEIGHT)

resize(WIDTH, HEIGHT)

window.addEventListener(
  'resize',
  () => {
    resize(WIDTH, HEIGHT)
  },
  false,
)
