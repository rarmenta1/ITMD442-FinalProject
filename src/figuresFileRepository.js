const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const db = new Map();

//db.set('a593c7cf-889d-4e81-bf0a-76cfd2d9810d', {firstName: 'John', lastName: "Doe", email: 'johndoe@gmail.com', notes: 'Sample Notes Text', id: 'a593c7cf-889d-4e81-bf0a-76cfd2d9810d'})
//db.set('7054c36e-d85e-41d3-8fd8-a996e0cac276', {firstName: 'Jodio', lastName: "Joestar", email: 'jjoestar@gmail.com', notes: 'This is a story about...', id: '7054c36e-d85e-41d3-8fd8-a996e0cac276'})

const loadData = () => {
  const jsonData = fs.readFileSync(path.join(__dirname, '../data/figures.json'));
  const figuresArray = JSON.parse(jsonData);
  figuresArray.forEach(element => {
    db.set(element[0], element[1]);
  });
};

const saveData = () => {
  const stringifyData = JSON.stringify(Array.from(db));
  fs.writeFileSync(path.join(__dirname, '../data/figures.json'), stringifyData);
};



const repo = {
  findAll: () => Array.from(db.values()),
  findById: (uuid) => db.get(uuid),
  create: (figures) => {
    const newFigures = {
      id: crypto.randomUUID(),
      seriesName: figures.seriesName,
      figureName: figures.figureName,
      version: figures.version,
      scale: figures.scale,
      manufacturer: figures.manufacturer,
      releaseDate: figures.releaseDate,
      urlPage: figures.urlPage,
    };
    db.set(newFigures.id, newFigures);
    saveData();
  },
  deleteByID: (uuid) => {
    db.delete(uuid)
    saveData();
  },
  update: (figure) => {
    db.set(figure.id, figure)
    saveData();
  },
};

loadData();

module.exports = repo;