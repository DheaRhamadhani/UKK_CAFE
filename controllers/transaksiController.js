const { request, response } = require("express");
const req = require("express/lib/request");
const { Op } = require("sequelize");

let transaksiModel = require("../models/index").transaksi;
let menuModel = require("../models/index").menu;
let mejaModel = require("../models/index").meja;
let detailTransaksiModel = require("../models/index").detail_transaksi;
let userModel = require("../models/index").user;

exports.ubahstatus = async (request, response) => {
  // id_transaksi yang mau diubah
  let id = request.params.id_transaksi;

  //mendapatkan data transaksi sesuai id
  let result = await transaksiModel.findOne({ where: { id_transaksi: id } });
  let id_meja = result.id_meja;

  // mengupdate stastus dari pembayaran transaksi tersebut menjadi lunaas
  await transaksiModel.update({ status: "lunas" }, { where: { id_transaksi: id } });

  // meng update status meja
  await mejaModel.update({ status: true }, { where: { id_meja: id_meja } });

  return response.json({
    message: "Data Status Telah di Ubah",
  });
};

exports.filterTransaksi = async (request, response) => {
  // filter tanggal awal - tanggal akhir
  let start = request.body.start;
  let end = request.body.end;

  let data = await transaksiModel.findAll({
    include: [
      "user",
      "meja",
      {
        model: detailTransaksiModel,
        as: "detail_transaksi",
        include: ["menu"],
      },
    ],
    where: {
      tgl_transaksi: {
        [Op.between]: [start, end],
      },
    },
  });
  return response.json(data);
};

exports.searchTransaksi = async (request, response) => {
  let keyword = request.body.keyword;
  let sequelize = require(`sequelize`);
  let Op = sequelize.Op;

  let data = await transaksiModel.findAll({
    include: [
      "user",
      "meja",
      {
        model: detailTransaksiModel,
        as: "detail_transaksi",
        include: ["menu"],
      },
    ],
    where: {
      [Op.or]: {
        // tgl_transaksi: { [Op.like] : `%${keyword}%` }
        id_user: { [Op.like]: `%${keyword}%` },
        nama_pelanggan: { [Op.like]: `%${keyword}%` },
        status: { [Op.like]: `%${keyword}%` },
      },
    },
  });
  return response.json(data);
};

exports.getDataTransaksi = async (request, response) => {
  let data = await transaksiModel.findAll({
    include: [
      "user",
      "meja",
      {
        model: detailTransaksiModel,
        as: "detail_transaksi",
        include: ["menu"],
      },
    ],
  });
  return response.json(data);
};

exports.addData = async (request, response) => {
  let newTransaksi = {
    tgl_transaksi: request.body.tgl_transaksi,
    id_user: request.body.id_user,
    id_meja: request.body.id_meja,
    nama_pelanggan: request.body.nama_pelanggan,
    status: `belum_bayar`,
  };

  //Update Status Meja
  await mejaModel.update({ status: false }, { where: { id_meja: request.body.id_meja } });

  // insert ke tabel
  transaksiModel
    .create(newTransaksi)
    .then(async (result) => {
      let detail_transaksi = request.body.detail_transaksi;
      // asumsinya detail_    transaksi itu bertipe array
      let id = result.id_transaksi;
      for (let i = 0; i < detail_transaksi.length; i++) {
        detail_transaksi[i].id_transaksi = id;
      }

      // insert ke tabel detail_transaksi
      await detailTransaksiModel
        .bulkCreate(detail_transaksi)
        // create = insert 1 baris / 1 data
        // bulkCreate = bisa banyak data(array)
        .then((result) => {
          return response.json({
            message: `Data transaksi berhasil ditambahkan`,
          });
        })
        .catch((error) => {
          return response.json({
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        message: error.message,
      });
    });
};

// UPDATE DATA
exports.updateData = (request, response) => {
  let id = request.params.id_transaksi;

  // define data yang diubah di tabel transaksi
  let newTransaksi = {
    tgl_transaksi: request.body.tgl_transaksi,
    id_user: request.body.id_user,
    id_meja: request.body.id_meja,
    nama_pelanggan: request.body.nama_pelanggan,
    status: request.body.status,
  };

  // eksekusi update tabel transaksi
  transaksiModel
    .update(newTransaksi, { where: { id_transaksi: id } })
    .then(async (result) => {
      // ada 2 detail -> 1 detail
      // kita hapus data detail yg lama
      // insert data detail terbaru

      // step 1: hapus semua detail berdasarkan id_transaksi
      await detailTransaksiModel.destroy({
        where: {
          id_transaksi: request.params.id_transaksi,
        },
      });

      // step 2: insert kembali data detail
      let detail_transaksi = request.body.detail_transaksi;
      // asumsinya detail_transaksi itu bertipe array
      let id = request.params.id_transaksi;
      for (let i = 0; i < detail_transaksi.length; i++) {
        detail_transaksi[i].id_transaksi = id;
      }

      // insert ke tabel detail_transaksi
      detailTransaksiModel
        .bulkCreate(detail_transaksi)
        // create = insert 1 baris / 1 data
        // bulkCreate = bisa banyak data(array)
        .then((result) => {
          return response.json({
            message: `Data transaksi berhasil diubah`,
          });
        })
        .catch((error) => {
          return response.json({
            message: error.message,
          });
        });
    })
    .catch((error) => console.log(error));
};

// DELETE DATA
exports.deleteData = (request, response) => {
  let id = request.params.id_transaksi;

  // hapus detail pelanggaran siswa
  detailTransaksiModel
    .destroy({
      where: {
        id_transaksi: id,
      },
    })
    .then((result) => {
      let id = request.params.id_transaksi;

      // hapus data pelanggaran siswa
      transaksiModel
        .destroy({
          where: {
            id_transaksi: id,
          },
        })
        .then((result) => {
          return response.json({
            message: ` Data transaksi berhasil dihapus`,
          });
        })
        .catch((error) => {
          return response.json({
            message: error.message,
          });
        });
    })
    .catch((error) => console.log(error));
};
