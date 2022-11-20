import type * as kontra from 'kontra'
import Grid from './Grid.js'
import Board from './Board.js'
import Block from './Block.js'

const { init, GameLoop, initPointer, track, load, on, Pool } = window.kontra

export default class Game {
  canvas?: HTMLCanvasElement
  context?: CanvasRenderingContext2D
  gameLoop?: kontra.GameLoop
  grid?: Grid
  board?: Board
  numberOfCols: number
  numberOfRows: number
  blockSize: number
  assets: any[] = []
  blockPool?: kontra.Pool
  selectedBlock: Block | null = null
  targetBlock: Block | null = null
  isBoardBlocked = false
  isReversingSwap = false

  constructor(public width: number, public height: number) {
    this.numberOfCols = 8
    this.numberOfRows = 8
    this.blockSize = 35

    this.init()
  }

  init() {
    const { canvas, context } = init()
    this.canvas = canvas
    this.context = context

    initPointer()

    this.gameLoop = GameLoop({
      update: this.update.bind(this),
      render: this.render.bind(this),
    })

    this.createGrid()

    this.createBoard()

    this.load()
  }

  render() {
    this.grid!.render()
    if (this.blockPool) {
      ;(this.blockPool.getAliveObjects() as Block[]).forEach((block) => {
        if (block.selected) {
          block.context.globalAlpha = 0.6
        } else {
          block.context.globalAlpha = 1
        }

        block.render()
        block.context.globalAlpha = 1
      })
    }
  }

  update() {
    if (this.blockPool) {
      this.blockPool.update()
    }
  }

  load() {
    on('assetLoaded', (asset: any, url: string) => {
      asset.id = url
    })

    load(
      'assets/images/bean_blue.png',
      'assets/images/bean_green.png',
      'assets/images/bean_orange.png',
      'assets/images/bean_pink.png',
      'assets/images/bean_purple.png',
      'assets/images/bean_red.png',
      'assets/images/bean_yellow.png',
      'assets/images/bean_white.png',
      'assets/images/bean_dead.png',
    )
      .then((assets) => {
        this.assets = assets
        this.start()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  start() {
    this.gameLoop?.start()
    this.drawBoard()
  }

  createGrid() {
    this.grid = new Grid({
      numberOfRows: this.numberOfRows,
      numberOfCols: this.numberOfCols,
      cellSize: this.blockSize + 4,
      x: 25,
      y: 180,
      color: 'lavender',
    })
  }

  createBoard() {
    this.board = new Board(this, this.numberOfRows, this.numberOfCols, 6, false)
    ;(<any>window).board = this.board

    this.blockPool = Pool({
      // @ts-ignore
      create: () => {
        return new Block()
      },
    })
  }

  drawBoard() {
    for (let i = 0; i < this.numberOfRows; i++) {
      for (let j = 0; j < this.numberOfCols; j++) {
        const x = 28 + j * (this.blockSize + 4)
        const y = 183 + i * (this.blockSize + 4)

        const block = this.blockPool!.get({
          x,
          y,
          row: i,
          col: j,
          image: this.assets[this.board!.grid[i][j]],
          ttl: Infinity,
        }) as Block

        block.onDown = () => {
          this.pickBlock(block)
        }

        track(block)
      }
    }
  }

  pickBlock(block: Block) {
    if (!this.board) return
    if (this.isBoardBlocked) {
      return
    }

    // if this the first block that was picked
    if (!this.selectedBlock) {
      block.selected = true
      this.selectedBlock = block
    } else {
      // second block you are selected is our target block
      this.targetBlock = block

      if (this.board.checkAdjacent(this.selectedBlock, this.targetBlock)) {
        this.isBoardBlocked = true

        this.swapBlocks(this.selectedBlock, this.targetBlock)
      } else {
        this.clearSelection()
      }
    }
  }

  swapBlocks(block1: Block, block2: Block) {
    // swap the location of the two blocks
    const tempX = block1.x
    const tempY = block1.y
    block1.x = block2.x
    block1.y = block2.y
    block2.x = tempX
    block2.y = tempY

    this.board?.swap(block1, block2)

    if (!this.isReversingSwap) {
      // check for chains
      if (!this.board) return
      const chains = this.board.findAllChains()
      if (chains?.length > 0) {
        this.updateBoard()
      } else {
        this.isReversingSwap = true
        this.swapBlocks(block1, block2)
      }
    } else {
      this.isReversingSwap = false
      this.clearSelection()
    }
  }

  clearSelection() {
    this.isBoardBlocked = false
    if (this.selectedBlock) this.selectedBlock.selected = false
    this.selectedBlock = null
  }

  updateBoard() {
    if (!this.board) return
    this.board.clearChains()
    this.board.updateGrid()

    const chains = this.board.findAllChains()

    if (chains.length > 0) {
      this.updateBoard()
    } else {
      this.clearSelection()
    }
  }

  getBlockFromColRow(position: { row: number; col: number }): Block | null {
    let foundBlock = null

    ;(this.blockPool?.getAliveObjects() as Block[]).some((block) => {
      if (block.row === position.row && block.col === position.col) {
        foundBlock = block
        return true
      }
      return false
    })

    return foundBlock
  }

  dropBlock(sourceRow: number, targetRow: number, col: number) {
    const block = this.getBlockFromColRow({ col, row: sourceRow })
    if (!block) return
    const targetY = 183 + targetRow * (this.blockSize + 4)
    block.row = targetRow
    block.y = targetY
  }

  dropReserveBlock(sourceRow: number, targetRow: number, col: number) {
    const x = 28 + col * (this.blockSize + 4)
    const y = 183 + targetRow * (this.blockSize + 4)
    const block = this.blockPool?.get({
      x,
      y,
      col,
      row: targetRow,
      image: this.assets[this.board!.grid[targetRow][col]],
      ttl: Infinity,
    }) as Block
    if (!block) return

    block.onDown = () => {
      this.pickBlock(block)
    }

    track(block)
  }
}
