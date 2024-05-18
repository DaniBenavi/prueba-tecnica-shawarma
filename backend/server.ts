import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'
import { buffer } from 'stream/consumers'

const app = express()

const port = process.env.PORT ?? 3000

const storage = multer.memoryStorage()
const upload = multer({ storage })

app.use(cors())

//#region

// post

let userData: Array<Record<string, string>> = []

app.post('/api/files', upload.single('file'), async (req, res) => {
  const { file } = req

  if (!file) {
    return res.status(500).json({ message: 'file is required' })
  }

  if (file.mimetype !== 'text/csv') {
    return res.status(500).json({ message: 'file must be a csv' })
  }

  let json: Array<Record<string, string>> = []

  try {
    const rawCsv = Buffer.from(file.buffer).toString('utf-8')

    json = csvToJson.fieldDelimiter(',').csvStringToJson(rawCsv)
  } catch (error) {
    res.status(500).json({ message: 'Error parsing the file' })
  }
  userData = json
  return res.status(200).json({ data: json, message: 'file upload successful' })
})

app.get('/api/users', (req, res) => {
  const { q } = req.query

  if (!q) {
    return res.status(500).json({ message: 'q is required' })
  }

  const search = q.toString().toLowerCase()

  const filteredData = userData.filter(row => {
    return Object.values(row).some(value => value.toLowerCase().includes(search))
  })

  return res.status(200).json({ data: filteredData })
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
