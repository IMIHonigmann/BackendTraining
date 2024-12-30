import * as fs from 'jsr:@std/fs';

export default function createPathIfNotExists(dir: string | URL) {
  if (!fs.existsSync(dir)) {
    Deno.mkdirSync(dir, { recursive: true });
  }
}
