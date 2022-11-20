const { Sprite } = window.kontra;
// @ts-ignore
const SpriteClass = Sprite.class;
export default class Block extends SpriteClass {
    row = 0;
    col = 0;
    selected = false;
    kill() {
        this.ttl = 0;
    }
}
