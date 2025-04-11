const dataUriParser = require("datauri/parser")

const path = require("path")

const parser = new dataUriParser()

const getDataUri = (file) => {
    const extName = path.extname(file.originalname)
    return  parser.format(extName,file.buffer).content
}

module.exports = getDataUri
