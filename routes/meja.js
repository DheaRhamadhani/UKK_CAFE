const express = require(`express`)
const app = express()
const authorization = require("../middlewares/authorization")

app.use(express.json()) // membaca data dalam format json

let mejaController = require("../controllers/mejaController")

// end-point get data siswa
app.get("/", [authorization.authorization], mejaController.getDataMeja)

// end-point add data siswa
app.post("/", [authorization.authorization], mejaController.addDataMeja)

// end-point edit data siswa
app.put("/:id_meja", [authorization.authorization], mejaController.editDataMeja)

// end-point delete data siswa
app.delete("/:id_meja", [authorization.authorization], mejaController.deleteDataMeja)

app.post("/find", [ authorization.authorization, mejaController.findMeja])  

module.exports = app