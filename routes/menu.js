const express = require(`express`)
const app = express()

app.use(express.json()) // membaca data dalam format json

// call menu controller
let menuController = require("../controllers/menuController")

// call testMiddleware
let authorization = require("../middlewares/authorization")
let uploadGambar = require("../middlewares/uploadGambar")

// end-point get data menu
app.get("/", [
    authorization.authorization, menuController.getDataMenu])

// end-point add data menu
app.post("/", [
    uploadGambar.upload.single(`gambar`), authorization.authorization], menuController.addDataMenu)

// end-point edit data menu
app.put("/:id_menu", [
     uploadGambar.upload.single(`gambar`), authorization.authorization], menuController.editDataMenu)

// end-point delete data menu
app.delete("/:id_menu", [
    authorization.authorization], menuController.deleteDataMenu)

module.exports = app