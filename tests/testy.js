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
                var uczen_id = Uczen.findOne({})._id;
                var przedmiot_id = Przedmiot.findOne({})._id;
                emit('zalogowany', uczen_id, przedmiot_id, 4);
            });

        }).once('zalogowany', function (uczen_id, przedmiot_id, ocena) {
            client.eval(function () {
                Meteor.call('dodajOcene', uczen_id, przedmiot_id, ocena, function (error, result) {
                    eval('ocenaDodana', error);
                });
            });
        });

        client.once('ocenaDodana', function (error) {
            assert.equal(error, undefined);
            done();
        });
    });


    test('nauczyciel moze dodac ocene 2', function (done, server, client) {

        client.eval(function () {
            Meteor.loginWithPassword('n1@wp.pl', 'uczen', function () {
                var uczen_id = Uczen.findOne({})._id;
                var przedmiot_id = Przedmiot.findOne({})._id;
                emit('zalogowany', uczen_id, przedmiot_id, 4);
            });

        }).once('zalogowany', function (uczen_id, przedmiot_id, ocena) {
            client.eval(dodajOcene);
        });


        function dodajOcene() {
            Meteor.call('dodajOcene', uczen_id, przedmiot_id, ocena, function (error, result) {
                emit('ocenaDodana', error);
            });
        }

        client.once('ocenaDodana', function (error) {
            assert.equal(error, undefined);
            done();
        });
    });

});