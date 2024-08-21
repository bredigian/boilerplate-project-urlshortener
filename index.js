require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()
const dns = require("dns")
const URL = require("url").URL

// Basic Configuration
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/public", express.static(`${process.cwd()}/public`))

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html")
})

const URL_SHORT_LINKS = []

app.post("/api/shorturl", function (req, res) {
  let url = req.body.url
  try {
    url = new URL(url)
  } catch (error) {
    console.error(error)
    return res.json({ error: "Invalid url" })
  }
  dns.lookup(url.hostname, function (err) {
    if (err) res.json({ error: "Invalid url" })
    else {
      const num = URL_SHORT_LINKS.length + 1
      URL_SHORT_LINKS.push({
        original_url: url,
        short_url: num,
      })
      res.json({
        original_url: url,
        short_url: num,
      })
    }
  })
})
app.get("/api/shorturl/:id", function (req, res) {
  const { id } = req.params

  const finded = URL_SHORT_LINKS.find((item) => item.short_url === Number(id))
  if (!finded) res.status(404).json({ error: "Not found" })
  else res.redirect(finded.original_url)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
