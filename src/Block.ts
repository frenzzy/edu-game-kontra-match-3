import * as kontra from 'kontra'

const { Sprite } = window.kontra

// @ts-ignore
const SpriteClass = Sprite.class as kontra.SpriteConstructor

export default class Block extends SpriteClass {
  row = 0
  col = 0
  selected = false

  kill() {
    this.ttl = 0
  }
}
