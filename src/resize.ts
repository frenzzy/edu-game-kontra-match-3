export function resize(gameWidth: number, gameHeigh: number) {
  const canvas = document.getElementById('canvas')
  if (!canvas) throw new Error('Canvas not found')
  const width = window.innerWidth
  const height = window.innerHeight
  const windowRatio = width / height
  const gameWindowRatio = gameWidth / gameHeigh

  if (gameWindowRatio < windowRatio) {
    canvas.style.width = `${height * gameWindowRatio}px`
    canvas.style.height = `${height}px`
  } else {
    canvas.style.width = `${width}px`
    canvas.style.height = `${width / gameWindowRatio}`
  }
}
