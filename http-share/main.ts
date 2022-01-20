import http, { IncomingMessage, ServerResponse } from 'http'
import { NetworkInterfaceInfo, networkInterfaces, NetworkInterfaceInfoIPv4 } from 'os'
import { stdout } from 'process';
import qrcode from 'qrcode'
import fs from 'fs'
import mime from 'mime-types'
import path from 'path';

const PORT = 2673
const PROTOCOL = "http"

function concatenateOnSameLine(s1: string[], s2: string[] = []): string[] {
  const size = Math.max(s1.length, s2.length)
  const res: string[] = []
  for (let i = 0; i < size; ++i) {
    if (i < s1.length && i < s2.length) {
      res[i] = s1[i] + s2[i]
    } else if (i < s1.length) {
      res[i] = s1[i]
    } else {
      res[i] = s1[i]
    }
  }
  return res
}

const files: string[] = fs.readdirSync('.')

function serveSumary(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "text/html")
  res.writeHead(200)

  const list = files.map((file: string) => `<li><a href="${file}">${file}</a></li>`).join("")
  res.end(`<ul>${list}</ul>`)
}

function serveFile(req: IncomingMessage, res: ServerResponse) {
  let name = req.url?.substring(1)
  if (!name) {
    res.writeHead(404)
    res.end()
    return
  }
  name = decodeURI(name!)
  const file = files.find(f => f===name)
  if (!file) {
    res.writeHead(404)
    res.end()
    return
  }

  const mimeType = mime.contentType(path.extname(file))
  if (mimeType) {
    res.setHeader("Content-Type", mimeType as string)
  }

  const { size } = fs.statSync(file)


  let [x, y] = req.headers.range?.replace("bytes=", "").split("-") ?? ['0', '0'];


  let end = parseInt(y) || size - 1
  let start = parseInt(x) || 0

  if (start >= size || end >= size) {
    res.setHeader("Content-Range", `bytes */${size}`)
    res.writeHead(416)
    return res.end();
  }


  res.setHeader("Content-Length", end - start + 1)
  res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`)
  res.setHeader("Accept-Ranges", "bytes")
  res.writeHead(200)

  const stream = fs.createReadStream(file, {
    start,
    end
  })

  stream.pipe(res)
}

function request(req: IncomingMessage, res: ServerResponse) : void {
  if (!req.url || req.url == '/') {
    serveSumary(req, res)
    return
  }
  
  serveFile(req, res)
}

export default function () {
  const server = http.createServer(request)
  server.listen(PORT)

  const interfaces = networkInterfaces()
  const valid: NetworkInterfaceInfo | undefined = Object.keys(interfaces)
    .map((key : string) => interfaces[key])
    .filter(n => n !== undefined)
    .map(n => n as NetworkInterfaceInfo[])
    .reduce((res: NetworkInterfaceInfo[], arr: NetworkInterfaceInfo[]) => {
      return [...res, ...arr]
    }, [])
    .filter((n: NetworkInterfaceInfo) => n.family == 'IPv4')
    .find((n: NetworkInterfaceInfo) => !n.internal)

  if (valid) {
    const url = `${PROTOCOL}://${valid.address}:${PORT}`
    
    let info: string[] = [
      `Protocol: ${PROTOCOL}`,
      `Port: ${PORT}`,
      `Adress: ${valid.address}`,
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