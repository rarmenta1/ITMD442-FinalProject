const figuresRepo = require('../src/figuresMongoRepository');
const { validationResult } = require('express-validator');
const Figure = require('../src/Figure');


/* GET users listing. */
exports.figures_list = async function(req, res, next) {
  const data = await figuresRepo.findAll();
  res.render('figures', {title: 'Express Figures', figures: data });
};

/* GET create figures form. */
exports.figures_create_get = function(req, res, next) {
  res.render('figures_add', {title: 'Add a figure' });
};

/* POST create figures. */
exports.figures_create_post = async function(req, res, next) {
  //console.log(req.body);
  const result = validationResult(req);
  if (!result.isEmpty())  {
      res.render('figures_add', { title: 'Add a figure', msg: result.array()});
  } else  {
    const newFigure = new Figure('', req.body.seriesName, req.body.figureName, req.body.version, req.body.scale, req.body.manufacturer, req.body.releaseDate, req.body.urlPage);
    await figuresRepo.create(newFigure)

    res.redirect('/figures');
  }
};

/* GET single figure. */
exports.figures_detail = async function(req, res, next) {
  const figure = await figuresRepo.findById(req.params.uuid);
  if(figure) {
    res.render('figure', {title: 'Figure Information', figure: figure });
  } else {
    res.redirect('/figures');
  }
};

/* GET delete figures form. */
exports.figures_delete_get = async function(req, res, next) {
  const figure = await figuresRepo.findById(req.params.uuid);
  res.render('figures_delete', {title: 'Delete Figure', figure: figure });
};

/* POST delete figures. */
exports.figures_delete_post = async function(req, res, next) {
  await figuresRepo.deleteByID(req.params.uuid);
  res.redirect('/figures');
};

/* GET edit figures form. */
exports.figures_edit_get = async function(req, res, next) {
  const figure = await figuresRepo.findById(req.params.uuid);
  res.render('figures_edit', {title: 'Edit figure', figure: figure });
};

/* POST edit figures. */
exports.figures_edit_post = async function(req, res, next) {
  //console.log(req.body);
  const result = validationResult(req);
  if (!result.isEmpty())  {
    const figure = await figuresRepo.findById(req.params.uuid);
    res.render('figures_edit', { title: 'Edit figure', msg: result.array(), figure: figure});
  } else  {
    const updatedFigure = new Figure(req.params.uuid, req.body.seriesName, req.body.figureName, req.body.version, req.body.scale, req.body.manufacturer, req.body.releaseDate, req.body.urlPage);
    await figuresRepo.update(updatedFigure);
    res.redirect('/figures/' + req.params.uuid);
  }
};