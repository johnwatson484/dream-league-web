import { promises as fs } from 'node:fs'

export async function deleteFile (path: string): Promise<void> {
  await fs.unlink(path)
}
