import { promises as fs } from 'fs'

const deleteFile = async (path) => {
  await fs.unlink(path)
}

export { deleteFile }
