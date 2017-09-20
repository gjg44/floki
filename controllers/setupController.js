var Todos = require('../models/todoModel');

module.exports = function(app) {
  app.get('/api/setupTodos', function(req, res) {

    //seed database
    console.log('Seeding Database...')
    var starterTodos = [
      {
        username: 'test',
        todo: 'Buy soy milk',
        isDone: false,
        hasAttachment: false
      },
      {
        username: 'test',
        todo: 'Feed Kona',
        isDone: false,
        hasAttachment: false
      },
      {
        username: 'test',
        todo: 'Feed Charlie',
        isDone: false,
        hasAttachment: false
      }
    ];
    Todos.create(starterTodos, function(err, results) {
      res.send(results);
    });
  });
}
