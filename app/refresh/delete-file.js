const fs = require('fs').promises

const deleteFile = async (path) => {
  await fs.unlink(path)
}

module.exports = {
  deleteFile,
}
