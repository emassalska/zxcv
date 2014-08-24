var assert = require('assert');

suite('submitMainPosts', function() {

  // ensure that -
  // (1) if the "Posts" collection exists
  // (2) we can connect to the collection
  // (3) the collection is empty
  test('Initialization', function(done, server) {
    server.eval(function() {
      var collection = Posts.find({}).fetch();
      emit('collection', collection);
    }).once('collection', function(collection) {
      assert.equal(collection.length, 0);
      done();
    });
  });


  // ensure that -
  // (1) we can add new "Posts" to the collection
  // (2) after data is added, we can retrieve it
  test('Server action', function(done, server, client) {
    server.eval(function() {
      Meteor.call('addPost',{text : "Im father of the tree ;"});
      var collection = Posts.find({}).fetch();
      emit('collection', collection);
    }).once('collection', function(collection) {
      assert.equal(collection.length, 1);
      done();
    });

    client.once('collection', function(collection) {
      assert.equal(Answers.find().fetch().length, 1);
      done();
    });
  });
  
});

suite('submitPostsWithComments', function() {

  // ensure that -
  // (1) if the "Posts" collection exists
  // (2) we can connect to the collection
  // (3) the set should be empty
  test('Initialization', function(done, server) {
    server.eval(function() {
      var collection = Posts.find().fetch();
      emit('collection', collection);
    }).once('collection', function(collection) {
      assert.equal(collection.length, 0);
      done();
    });
  });

  
  // ensure that -
  // (1) we can add "Comments" to the particular Post
  // (2) after "Comments" are added, we can retrieve them
  test('Server action', function(done, server, client) {
    server.eval(function() {
      var parent_id = Posts.insert({text : "This is my test insert"});
      
      Meteor.call('addPost',{text : "Im the first comment", parent: parent_id});
      Meteor.call('addPost',{text : "Im the second comment", parent: parent_id});
      
	  var collection = Posts.find({parent:parent_id}).fetch();
	  
      emit('collection', collection);
    }).once('collection', function(collection) { 
      assert.equal(collection.length, 2);
      done();
    });
	
    client.once('collection', function(collection) {
	var parent_id = collection.fetch()[0].parent;
     assert.equal(Posts.find({parent: parent_id}).fetch().length, 2);
      done();
    });
	
  });

});



suite('addNewLikes', function() {

  // ensure that -
  // (1) if the "Like" collection exists
  // (2) we can connect to the "likes" set
  // (3) the "likes" set is empty
  test('Initialization', function(done, server) {
    server.eval(function() {
      var collection = Likes.find().fetch();
      emit('collection', collection);
    }).once('collection', function(collection) {
      assert.equal(collection.length, 0);
      done();
    });
  });

  // ensure that -
  // (1) we can add few new "likes" 
  // (2) after "likes" are added to particular post, we can retrieve them
  test('Server action', function(done, server, client) {
    server.eval(function() {
	  var post_id = Posts.insert({"text":"some random text"});
      Meteor.call('addLike',{post: post_id});
      Meteor.call('addLike',{post: post_id});
      Meteor.call('addLike',{post: post_id});
      Meteor.call('addLike',{post: post_id}); // We're adding randomly 4 likes
	  
      var collection = Likes.find({"post" : post_id}).fetch();
      emit('collection', collection);
    }).once('collection', function(collection) {
      assert.equal(collection.length, 4);
      done();
    });

    client.once('collection', function(collection) {
		var post_id = collection[0].post;
      assert.equal(Likes.find({"post" : post_id}), 4);
      done();
    });
  });

});
