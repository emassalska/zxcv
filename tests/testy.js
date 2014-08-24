var assert = require('assert');
suite('submitMainPosts', function () {
    // ensure that -
    // (1) if the "Posts" collection exists
    // (2) we can connect to the collection
    // (3) the collection is empty
    test('Initialization', function (done, server) {
        server.eval(function () {
            var collection = Posts.find({}).fetch();
            emit('collection', collection);
        }).once('collection', function (collection) {
            assert.equal(collection.length, 0);
            done();
        });
    });
});