var express = require('express');
var router = express.Router();
const figuresRepo = require('../src/figuresFileRepository');


/* GET users listing. */
router.get('/', function(req, res, next) {
  const data = figuresRepo.findAll();
  res.render('figures', {title: 'Express Figures', figures: data});
});

/* GET create figure form. */
router.get('/add', function(req, res, next) {
  res.render('figures_add', {title: 'Add a figure'});
});

/* POST create figure. */
router.post('/add', function(req, res, next) {
  //console.log(req.body);
  if (req.body.seriesName.trim() === '' || req.body.figureName.trim() === '')  {
    res.render('figures_add', { title: 'Add a contact', msg: 'Series and Figure Name text fields can NOT be empty!'});
} else  {
  figuresRepo.create({seriesName: req.body.seriesName, figureName: req.body.figureName, version: req.body.version, scale: req.body.scale, manufacturer: req.body.manufacturer, releaseDate: req.body.releaseDate, urlPage: req.body.urlPage})
  res.redirect('/figures');
}
});

/* GET single figures. */
router.get('/:uuid', function(req, res, next) {
  const figure = figuresRepo.findById(req.params.uuid);
  if(figure) {
    res.render('figure', {title: 'Figure Information', figure: figure });
  } else {
    res.redirect('/figures');
  }
});

/* GET delete contacts form. */
router.get('/:uuid/delete', function(req, res, next) {
  const figure = figuresRepo.findById(req.params.uuid);
  res.render('figures_delete', {title: 'Delete Figure', figure: figure });
});

/* POST delete contacts. */
router.post('/:uuid/delete', function(req, res, next) {
  figuresRepo.deleteByID(req.params.uuid);
  res.redirect('/figures');
});

/* GET edit contacts form. */
router.get('/:uuid/edit', function(req, res, next) {
  const figure = figuresRepo.findById(req.params.uuid);
  res.render('figures_edit', {title: 'Edit Figure', figure: figure });
});

/* POST edit contacts. */
router.post('/:uuid/edit', function(req, res, next) {
  //console.log(req.body);
  if (req.body.seriesName.trim() === '' || req.body.figureName.trim() === '')  {
    const figure = figuresRepo.findById(req.params.uuid);
    res.render('figures_edit', { title: 'Edit figure', msg: 'Series and Figure Name text fields can NOT be empty!', figure: figure});
  } else  {
    const updatedFigure = {id: req.params.uuid, seriesName: req.body.seriesName, figureName: req.body.figureName, version: req.body.version, scale: req.body.scale, manufacturer: req.body.manufacturer, releaseDate: req.body.releaseDate, urlPage: req.body.urlPage };
    figuresRepo.update(updatedFigure);
    res.redirect('/figures/' + req.params.uuid);
  }
});

module.exports = router;