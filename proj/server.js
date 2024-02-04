const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;
const dtb = new sqlite3.Database('photo_database.db');

app.use(cors());

dtb.serialize(function() {
  dtb.run(`CREATE TABLE IF NOT EXISTS photos
  (
    poster CHAR(2048) NOT NULL,
    name CHAR(100) NOT NULL,
    year CHAR(100) NOT NULL,
    genre CHAR(256) NOT NULL,
    description CHAR(1024) NOT NULL,
    id INTEGER PRIMARY KEY
  )`
  );
});

app.use(express.json());

app.get("/hello", function (req, res) {
  response_body = { Hello: "World" };

  // This example returns valid JSON in the response, but does not yet set the
  // associated HTTP response header.  This you should do yourself in your
  // own routes!
  res.json(response_body);
});

app.get('/api/photos', function(req, res){
    dtb.all('SELECT * FROM photos', function(err, rows){
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
});
  
app.get('/api/photos/:id', function(req, res){
  const { id } = req.params;
  dtb.get('SELECT * FROM photos WHERE id = ?', [id], function(err, row){
    if (err) {
      res.status(500).json({error: err.message});
      return;
    }

    if (!row) {
      res.status(404).json({error: 'Photo not found'});
      return;
    }

    res.json({data: row});
  });
});
  
app.post('/api/photos', function(req, res){
  const { name, year, genre, poster, description } = req.body;
  if (!name || !year || !genre || !poster || !description) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }
  
  dtb.run('INSERT INTO photos (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)', [name, year, genre, poster, description], function(err){
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
  
    res.json({ id: this.lastID, name, year, genre, poster, description });
  });
});
  
app.put('/api/photos/:id', function(req, res){
    const { id } = req.params;
    const { name, year, genre, poster, description } = req.body;

    if (!(name && year && genre && poster && description)) {
      res.status(400).json({error: 'All fields are required'});
      return;
    }
  
    dtb.run('UPDATE photos SET name = ?, year = ?, genre = ?, poster = ?, description = ? WHERE id = ?', [name, year, genre, poster, description, id], function(err){
      if (err) {
        res.status(500).json({error: err.message});
        return;
      }
  
      if (this.changes == 0) {
        res.status(404).json({error:'Photo not found'});
        return;
      }
  
      res.json({ message: 'Photo updated successfully' });
    });
}); 
  
app.delete('/api/photos/:id', function(req, res){
  const {id} = req.params;
  
  dtb.run('DELETE FROM photos WHERE id = ?', [id], function(err){
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
  
    if (this.changes === 0) {
      res.status(404).json({error: 'Photo not found'});
      return;
    }
  
    res.json({ message: 'Photo deleted successfully' });
    });
});
  
app.listen(port, function(){
  console.log('Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/api/photos');
});


