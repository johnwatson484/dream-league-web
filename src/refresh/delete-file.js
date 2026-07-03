import { promises as fs } from 'node:fs'

const deleteFile = async (path) => {
  await fs.unlink(path)
}

export { deleteFile }
