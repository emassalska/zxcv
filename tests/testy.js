var assert = require('assert');
suite('submitMainPosts', function () {
    // ensure that -
    // (1) if the "Posts" collection exists
    // (2) we can connect to the collection
    // (3) the collection is empty
    test('nauczyciel moze sie zalogowac', function (done, server, client) {
        client.eval(function () {
            Meteor.loginWithPassword('n1@wp.pl', 'nauczyciel');
            emit('zalogowany');
        }).once('zalogowany', function () {
            assert.equal(Rola.findOne({ meteor_user: Meteor.userId() }).role, 'nauczyciel');
            done();
        });
    });
});