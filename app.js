const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");

const pool = mariadb.createPool({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "123",
  database: "planning",
  connectionLimit: 5,
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/peliculas", async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT id, title, overview FROM peliculas"
      );
  
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Se rompió el servidor" });
    } finally {
      if (conn) conn.release(); //release to pool
    }
  });

app.get("/peliculas/:id", async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT id, title, overview FROM peliculas WHERE id=?",
        [req.params.id]
      );
  
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Se rompió el servidor" });
    } finally {
      if (conn) conn.release(); //release to pool
    }
  });

app.post("/peliculas", async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
  
      const response = await conn.query(
        `INSERT INTO peliculas(title, overview) VALUES (?, ?)`,
        [req.body.title, req.body.overview]
      );
  
      res.json({
        id: parseInt(response.insertId),
        title: req.body.title,
        overview: req.body.overview
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Se rompió el servidor" });
    } finally {
      if (conn) conn.release(); // release to pool
    }
  });

app.delete("/peliculas/:id", async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("DELETE FROM peliculas WHERE id=?", [
        req.params.id,
      ]);
      res.json({ message: "Elemento eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Se rompió el servidor" });
    } finally {
      if (conn) conn.release(); //release to pool
    }
  });

  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
  