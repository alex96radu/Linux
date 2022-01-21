import fs from "fs"
import { IncomingMessage, ServerResponse } from "http"
import { argv } from "process"

const files: string[] = fs.readdirSync('.')


function serveSumary(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "text/html")
  res.writeHead(200)

  const list = files.map((file: string) => `<li><a href="${file}">${file}</a></li>`).join("")
  res.write(`<ul>${list}</ul>`)



  res.end();
}

function serveFile(req: IncomingMessage, res: ServerResponse, file: string) {

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

export default function serve(req: IncomingMessage, res: ServerResponse) : void {
  if (argv.length >= 3) {
    serveFile(req, res, argv[2])
    return
  }

  if (!req.url || req.url == '/') {
    serveSumary(req, res)
    return
  }

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
  
  serveFile(req, res, name)
}
