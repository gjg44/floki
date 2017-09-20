var Todos = require('../models/todoModel');
var bodyParser = require('body-parser');

// need to export the API endpoints
module.exports = function(app) {

  // use bodyParser middleware.
  // parse JSON out of http request
  // will make sure can handle url encoded database
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true}));

  // API ENDPOINT: get all todos for a given person
  app.get('/api/todos/:uname', function(req, res) {
    // search for all users with specified uname
    console.log(`API ENDPOINT: Get all todos for: ${req.params.uname}`);
    Todos.find({ username: req.params.uname }, function(err, todos) {
      if (err) throw err;
      res.send(todos);
    });
  });

  // API ENDPOINT: get todo by id
  app.get('/api/todo/:id', function(req, res) {
    // search for all todos with id :id
    console.log(`API ENDPOINT: Get todo with the ID: ${req.params.id}`);
    Todos.findById({ _id: req.params.id}, function(err, todo) {
      console.log(todo);
      if (err) throw err;
      res.send(todo);
    });
  });



  // API ENPOINT: post a new todo item
  app.post('/api/todo', function(req,res) {
    // check if this is a pre-existing todo by testing whether the todo has an id associated with it.  If there is an id associated with the todo, we assume this is an update to an existing todo.  Still need to check if the id matches any existing id's in the database.
    console.log(`API ENDPOINT: Post a todo with body:`);
    if (req.body.id) {
      // assume this is an update to an existing todo
      console.log(`Updating todo with ID: ${req.body.id}`);
      Todos.findByIdAndUpdate(req.body.id,
        {
          todo: req.body.todo,
          isDone: req.body.isDone,
          hasAttachment: req.body.hasAttachment
        }, function(err, todo) {
          if (err) throw err;
          res.send('Success');
        }
      );
    } else {
      // if no id was passed, we assume this is a new todo item
      var newTodo = Todos({
        username: 'test',
        todo: req.body.todo,
        isDone: req.body.isDone,
        hasAttachment: req.body.hasAttachment
      });
      console.log(`Updating todo with ID: ${newTodo}`);
      newTodo.save(function(err) {
        res.send(newTodo);
      });
    }
  });

  // API ENDPOINT: delete a todo with the given id
  app.delete('/api/todo', function(req, res) {
    console.log(`API ENDPOINT: Delete todos with ID: ${req.body.id}`);
    console.log(req.body);
    Todos.findByIdAndRemove(req.body.id, function(err) {
        if (err) throw err;
        res.send('Success');
    });
  });

}
