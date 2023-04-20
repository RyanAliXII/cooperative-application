// See https://kit.svelte.dev/docs/types#app

import type { SessionMeta } from "$lib/internal/session";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      session: SessionMeta;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
