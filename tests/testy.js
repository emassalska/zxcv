var assert = require('assert');
suite('Uprawnienia Ucznia', function () {


    test('uczen moze sie zalogowac', function (done, server, client) {

        client.eval(function () {
            Meteor.loginWithPassword('u1@wp.pl', 'uczen', function () {
                emit('zalogowanyu');
            });

        }).once('zalogowanyu', function () {
            server.eval(function () {
                var rola = Rola.findOne({ meteor_user: this.userId }).role;
                emit('sprawdzRoleu', rola);
            });
        });
        server.once('sprawdzRoleu', function (rola) {
            assert.equal(rola, 'uczen');
            done();
        });
    });

    test('uczen nie moze dodac oceny', function (done, server, client) {

        client.eval(function () {
            Meteor.loginWithPassword('u1@wp.pl', 'uczen', function () {
                emit('zalogowanyy');
            });

        }).once('zalogowanyy', function () {
            client.eval(function () {
                var uczen_id = Uczen.findOne({})._id;
                var przedmiot_id = Przedmiot.findOne({})._id;
                Meteor.call('dodajOcene', uczen_id, przedmiot_id, 4, function (error, result) {
                    emit('ocenaDodana', error);
                });
            });
        }).once('ocenaDodana', function (error) {
            assert.notEqual(error, undefined);
            done();
        });
    });
});
suite('Uprawnienia Nauczyciela', function () {

    test('nauczyciel moze sie zalogowac', function (done, server, client) {

        client.eval(function () {
            Meteor.loginWithPassword('n1@wp.pl', 'nauczyciel', function () {
                emit('zalogowany');
            });

        }).once('zalogowany', function () {
            client.eval(function () {
                var rola = Rola.findOne({ meteor_user: Meteor.userId() }).role;
                emit('sprawdzRole', rola);
            });
        });
        client.once('sprawdzRole', function (rola) {
            assert.equal(rola, 'nauczyciel');
            done();
        });
    });

    test('nauczyciel moze dodac ocene', function (done, server, client) {

        client.eval(function () {
            Meteor.loginWithPassword('n1@wp.pl', 'nauczyciel', function () {
                emit('zalogowany');
            });

        }).once('zalogowany', function () {
            client.eval(function () {
                var uczen_id = Uczen.findOne({})._id;
                var przedmiot_id = Przedmiot.findOne({})._id;
                Meteor.call('dodajOcene', uczen_id, przedmiot_id, 4, function (error, result) {
                    emit('ocenaDodana', error);
                });
            });
        }).once('ocenaDodana', function (error) {
            assert.equal(error, undefined);
            done();
        });
    });

    test('nauczyciel moze zmienic ocene', function (done, server, client) {
        var ocena_id = null;
        server.eval(function () {
            var uczen_id = Uczen.findOne({})._id;
            var przedmiot_id = Przedmiot.findOne({})._id;
            var nauczyciel_id = Nauczyciel.findOne({})._id;
            ocena_id = Ocena.insert({
                ocena: 4,
                uczen: uczen_id,
                nauczyciel: nauczyciel_id,
                przedmiot: przedmiot_id
            });
            emit('sprawdzOcene');
        }).once('sprawdzOcene', function () {
            client.eval(function () {
                Meteor.loginWithPassword('n1@wp.pl', 'nauczyciel', function () {
                    emit('zalogowany');
                });

            });
        });

        client.once('zalogowany', function () {
            client.eval(function () {
                var uczen_id = Uczen.findOne({})._id;
                var przedmiot_id = Przedmiot.findOne({})._id;
                Meteor.call('zmienOcene', ocena_id, 1, function (error, result) {
                    emit('ocenaDodana', ocena_id);
                });
            });
        }).once('ocenaDodana', function (error) {
            var ocena = Ocena.findOne({ _id: ocena_id }).ocena;
            assert.equal(ocena, 1);
            done();
        });
    });
});