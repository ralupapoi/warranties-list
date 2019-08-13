var express = require('express');
var mysql = require('mysql');
var router = express.Router();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "warranties"
});

router.get('/', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    if(err) throw err;
    const sql = `SELECT id, name, DATE_FORMAT(purchaseDate, "%Y-%m-%d") as purchaseDate, DATE_FORMAT(expireDate, "%Y-%m-%d") as expireDate FROM products`;
    connection.query(sql, function(err, results) {
      if(err) throw err;
      connection.release();
      res.json(results);
    })
  })
});

router.delete('/delete', function(req, res, next) {
  const id = req.body.id;

  pool.getConnection(function(err, connection) {
    if(err) throw err;
    const sql = `DELETE FROM products WHERE id=?`;
    connection.query(sql, [id], function(err, results) {
      if(err) throw err;
      connection.release();
      res.json({success: true});
    })
  })
});

router.post('/create', function(req, res, next) {
  const name = req.body.name;
  const purchaseDate = req.body.purchaseDate;
  const expireDate = req.body.expireDate;
  pool.getConnection(function(err, connection) {
    if(err) throw err;
    const sql = `INSERT INTO products (id, name, purchaseDate, expireDate) VALUES (NULL, ?, ?, ?);`;
    connection.query(sql, [
        name, purchaseDate, expireDate
    ], function(err, results) {
      if(err) throw err;
      const id = results.insertId;
      connection.release();
      res.json({
        success: true,
        id: id,
      });
    })
  });  
});

router.put('/update', function(req, res, next) {
  const id = req.body.id;
  const name = req.body.name;
  const purchaseDate = req.body.purchaseDate;
  const expireDate = req.body.expireDate;

  pool.getConnection(function(err, connection) {
    if(err) throw err;
    const sql = `UPDATE products SET name=?, purchaseDate=?, expireDate=? WHERE id=?`;
    connection.query(sql, [
        name, purchaseDate, expireDate, id
    ], function(err, results) {
      if(err) throw err;
      connection.release();
      res.json({success: true});
    })
  })
});

module.exports = router;
