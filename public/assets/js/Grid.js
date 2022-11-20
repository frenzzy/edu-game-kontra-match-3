const { Sprite, Pool } = window.kontra;
export default class Grid {
    numberOfRows;
    numberOfCols;
    cellSize;
    color;
    x;
    y;
    width;
    height;
    backgroundSprite = null;
    gridSpritesPool = Pool({
        // @ts-ignore
        create: Sprite,
    });
    constructor(config) {
        this.numberOfRows = config.numberOfRows;
        this.numberOfCols = config.numberOfCols;
        this.cellSize = config.cellSize;
        this.color = config.color;
        this.x = config.x;
        this.y = config.y;
        this.width = this.numberOfCols * this.cellSize;
        this.height = this.numberOfRows * this.cellSize;
        this.init();
    }
    init() {
        this.backgroundSprite = Sprite({
            x: this.x,
            y: this.y,
            color: 'grey',
            width: this.width,
            height: this.height,
        });
        // vertical grid lines
        for (let i = 0; i < this.width + this.cellSize; i += this.cellSize) {
            this.gridSpritesPool.get({
                x: this.x + i,
                y: this.y + 0,
                color: this.color,
                width: 1,
                height: this.height,
            });
        }
        // horizontal grid lines
        for (let i = 0; i < this.height + this.cellSize; i += this.cellSize) {
            this.gridSpritesPool.get({
                x: this.x + 0,
                y: this.y + i,
                color: this.color,
                width: this.width,
                height: 1,
            });
        }
    }
    render() {
        if (this.backgroundSprite) {
            this.backgroundSprite.context.globalAlpha = 0.2;
            this.backgroundSprite.render();
            this.backgroundSprite.context.globalAlpha = 1;
        }
        this.gridSpritesPool.render();
    }
}
