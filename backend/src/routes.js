const { Router } = require('express');
const DevController = require('./controllers/DevController')
const SearchController = require('./controllers/SearchController')

const routes = Router();

//Dev Controller
routes.get('/devs', DevController.index)
routes.post('/devs', DevController.store);
routes.patch('/devs', DevController.update);
routes.delete('/devs', DevController.destroy);

//Search Controller
routes.get('/search', SearchController.index);


module.exports = routes;