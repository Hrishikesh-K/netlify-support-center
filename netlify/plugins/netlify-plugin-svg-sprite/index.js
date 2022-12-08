// noinspection JSCheckFunctionSignatures, JSUnusedGlobalSymbols

import {existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from 'fs'
import {resolve} from 'path'
import {watch} from 'chokidar'
function createSprites(plugin) {
  function writeSprites() {
    const fileNames = []
    writeFileSync(resolve(plugin.inputs.dist, './sprites.svg'), `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg">${readdirSync(plugin.inputs.src).reduce((previousString, currentFileName) => {
      fileNames.push(currentFileName)
      return previousString + readFileSync(resolve(plugin.inputs.src, currentFileName), 'utf-8').replace('<svg', `<symbol id="${currentFileName.slice(0, -4)}"`).replace('</svg', '</symbol')
    }, '')}</svg>`)
    if (plugin) {
      plugin.utils.status.show({
        summary: `SVG sprite created from ${fileNames.length} file(s)`,
        text: `Sprite(s) include:\n${fileNames.join(',\n')}`,
        title: 'Netlify Plugin SVG Sprite',
      })
    }
  }
  if (existsSync(plugin.inputs.dist)) {
    writeSprites()
  } else {
    mkdirSync(plugin.inputs.dist)
    writeSprites()
  }
}
export const onPreBuild = createSprites
export const onPreDev = plugin => {
  createSprites(plugin)
  watch(resolve(plugin.inputs.src)).on('all', () => {
    createSprites(plugin)
  })
}