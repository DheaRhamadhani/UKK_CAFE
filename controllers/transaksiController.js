const { request, response } = require("express")
const req = require("express/lib/request")

let transaksiModel = require("../models/index").transaksi
let menuModel = require("../models/index").menu
let mejaModel = require("../models/index").meja
let detailTransaksiModel = require("../models/index").detail_transaksi
let userModel = require("../models/index").user

exports.getDataTransaksi = async(request, response) => {
    let data = await transaksiModel.findAll({
        include: ["user", "meja", {
            model:  detailTransaksiModel,
            as:  "detail_transaksi",
            include: ["menu"]
        }]
    })
    return response.json(data)
}

exports.addData = async(request, response) => {
    let newTransaksi = {
        tgl_transaksi: request.body.tgl_transaksi,
        id_user: request.body.id_user,
        id_meja: request.body.id_meja,
        nama_pelanggan: request.body.nama_pelanggan,
        status: request.body.status
    }

    // insert ke tabel 
    transaksiModel.create(newTransaksi)
    .then(async result => {
        let detail_transaksi =request.body.detail_transaksi
        // asumsinya detail_    transaksi itu bertipe array
        let id = result.id_transaksi
        for (let i = 0; i < detail_transaksi.length; i++) {
            detail_transaksi[i].id_transaksi = id
        }

        // insert ke tabel detail_transaksi
        await detailTransaksiModel.bulkCreate(detail_transaksi)
        // create = insert 1 baris / 1 data
        // bulkCreate = bisa banyak data(array)
        .then(result => {
            return response.json({
                message:`Data transaksi berhasil ditambahkan`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}