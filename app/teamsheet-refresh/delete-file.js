const fs = require('fs')

const deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) console.error(err)
  })
}

module.exports = deleteFile
