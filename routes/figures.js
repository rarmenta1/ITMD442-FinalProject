var express = require('express');
var router = express.Router();
const figuresController = require('../controllers/figureController');
const { body  } = require('express-validator');


/* GET users listing. */
router.get('/', figuresController.figures_list);

/* GET create figures form. */
router.get('/add', figuresController.figures_create_get);

/* POST create figures. */
router.post('/add', 
body('seriesName').trim().notEmpty().withMessage('Series Name can NOT be empty!'),
body('figureName').trim().notEmpty().withMessage('Figure Name can NOT be empty!'),
figuresController.figures_create_post);

/* GET single figures. */
router.get('/:uuid', figuresController.figures_detail);

/* GET delete figures form. */
router.get('/:uuid/delete', figuresController.figures_delete_get);

/* POST delete figures. */
router.post('/:uuid/delete', figuresController.figures_delete_post);

/* GET edit figures form. */
router.get('/:uuid/edit', figuresController.figures_edit_get);

/* POST edit figures. */
router.post('/:uuid/edit',
body('seriesName').trim().notEmpty().withMessage('Series Name can NOT be empty!'),
body('figureName').trim().notEmpty().withMessage('Figure Name can NOT be empty!'),
figuresController.figures_edit_post);

module.exports = router;
