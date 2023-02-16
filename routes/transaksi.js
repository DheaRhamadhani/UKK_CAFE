const express = require(`express`)
const app = express()
const authorization = require("../middlewares/authorization")

app.use(express.json()) // membaca data dalam format json

let transaksiController = require("../controllers/transaksiController")

// end-point get data siswa
app.get("/", [authorization.authorization], transaksiController.getDataTransaksi)

// end-point add data siswa
app.post("/", [authorization.authorization], transaksiController.addData)

// end-point edit data siswa
app.put("/:id_transaksi", [authorization.authorization], transaksiController.updateData)

// end-point delete data siswa
app.delete("/:id_transaksi", [authorization.authorization], transaksiController.deleteData)

// end-point update status
app.get("/:id_transaksi", [authorization.authorization], transaksiController.ubahstatus)

module.exports = app