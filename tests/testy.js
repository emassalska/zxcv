var assert = require('assert');
suite('Uprawnienia', function () {


    test('uczen moze sie zalogowac', function (done, server, client) {

        client.eval(function () {
            Meteor.loginWithPassword('u1@wp.pl', 'uczen', function () {
                emit('zalogowany');
            });

        }).once('zalogowany', function () {
            assert.equal(Rola.findOne({ meteor_user: Meteor.userId() }).role, 'uczen');
            done();
        });
    });

    test('nauczyciel moze dodac ocene', function (done, server, client) {

        client.eval(function () {
            Meteor.loginWithPassword('n1@wp.pl', 'uczen', function () {
                emit('zalogowany');
            });

        }).once('zalogowany', function (uczen_id) {
            Meteor.call('dodajOcene', this._id, Session.get('przedmiot_id'), value, function (error, result) {
                assert.equal(error, undefined);
                done();
            });
        });
    });
});