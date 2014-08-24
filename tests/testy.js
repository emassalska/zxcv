var assert = require('assert');
suite('submitMainPosts', function () {
    // ensure that -
    // (1) if the "Posts" collection exists
    // (2) we can connect to the collection
    // (3) the collection is empty
    test('uczen moze sie zalogowac', function (done, server, client) {
        server.eval(function () {
            //dodajemy uczniow
            var u1_id = Uczen.insert({
                imie: "Karol",
                nazwisko: "Kowalski"
            });
            addUser("Karol Kowalski", "u1@wp.pl", "uczen", "uczen", u1_id);
        })

        client.eval(function () {
            Meteor.loginWithPassword('u1@wp.pl', 'uczen');
            emit('zalogowany');
        }).once('zalogowany', function () {
            assert.equal(Rola.findOne({ meteor_user: Meteor.userId() }).role, 'uczen');
            done();
        });
    });
});