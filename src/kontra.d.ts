import type * as kontra from 'kontra'

declare global {
  interface Window {
    kontra: typeof kontra
  }
}
