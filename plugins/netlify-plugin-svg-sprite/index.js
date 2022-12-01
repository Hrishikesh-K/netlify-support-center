// noinspection AnonymousFunctionJS, ChainedFunctionCallJS, JSUnusedGlobalSymbols, NestedFunctionCallJS, NestedFunctionJS

import {existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from 'fs'
import {resolve} from 'path'
import {watch} from 'chokidar'
const inputPath = new URL('../../src/icons', import.meta.url).pathname
function createSprites(plugin) {
  const outputPath = new URL('../../src/assets/', import.meta.url).pathname
  function writeSprites() {
    const fileNames = []
    writeFileSync(resolve(outputPath, './sprites.svg'), '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg">' + readdirSync(inputPath).reduce((previousString, currentFileName) => {
      fileNames.push(currentFileName)
      return previousString + readFileSync(resolve(inputPath, currentFileName), 'utf-8').replace('<svg', `<symbol id="${currentFileName.slice(0, -4)}"`).replace('</svg', '</symbol')
    }, '') + '</svg>')
    if (plugin) {
      plugin.utils.status.show({
        summary: `SVG sprite created from ${fileNames.length} file(s)`,
        text: `Sprite(s) include:\n${fileNames.join(',\n')}`,
        title: 'Netlify Plugin SVG Sprite',
      })
    }
  }
  if (existsSync(outputPath)) {
    writeSprites()
  } else {
    mkdirSync(outputPath)
    writeSprites()
  }
}
export const onPreBuild = createSprites
export const onPreDev = () => {
  createSprites()
  watch(inputPath).on('all', () => {
    createSprites()
  })
}