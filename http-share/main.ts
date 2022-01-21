import http, { IncomingMessage, ServerResponse } from 'http'
import { validInterface } from './utilities'
import { argv, stdout } from 'process'
import qrcode from 'qrcode'
import { concatenateOnSameLine } from './utilities'
import serve from './server'

const PORT = 2673
const PROTOCOL = "http"

export default function () {
  const server = http.createServer(serve)
  server.listen(PORT)

  if (validInterface) {
    const url = `${PROTOCOL}://${validInterface.address}:${PORT}`
    
    let info: string[] = [
      `Protocol: ${PROTOCOL}`,
      `Port: ${PORT}`,
      `Adress: ${validInterface.address}`,
      `Url: ${url}`
    ]
  
    info = info.reduce((res: string[], s: string) => {
      return [...res, "", `\t${s}`]
    }, [])
    
    qrcode.toString(url, {type: 'terminal'}, (error: Error, qrStr: string) => {
      stdout.write(concatenateOnSameLine(qrStr.split("\n"), info).join('\n'))
    })
  } 
}