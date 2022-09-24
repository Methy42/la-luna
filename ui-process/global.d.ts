export {}

declare global {
  import type { App } from 'vue'

  export interface Window {
    require: any; // 👈️ turn off type checking
    AppContext: App;
  }
}