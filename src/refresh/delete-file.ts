import { promises as fs } from 'node:fs'

export async function deleteFile (path) {
  await fs.unlink(path)
}
