﻿var assert = require('assert');
suite('Uprawnienia', function () {


    test('uczen moze sie zalogowac', function (done, server, client) {

        client.eval(function () {
            Meteor.loginWithPassword('u1@wp.pl', 'uczen', function () {
                emit('zalogowany');
            });

        }).once('zalogowany', function () {
            client.eval(function () {
                var rola = Rola.findOne({ meteor_user: Meteor.userId() }).role
                emit('sprawdzRole', rola);
            });
        }).once('sprawdzRole', function (rola) {
            assert.equal(rola, 'uczen');
            done();
        });
    });


    test('nauczyciel moze sie zalogowac', function (done, server, client) {

        client.eval(function () {
            Meteor.loginWithPassword('n1@wp.pl', 'nauczyciel', function () {
                emit('zalogowany');
            });

        }).once('zalogowany', function () {
            client.eval(function () {
                var rola = Rola.findOne({ meteor_user: Meteor.userId() }).role
                emit('sprawdzRole', rola);
            });
        }).once('sprawdzRole', function (rola) {
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

    test('uczen nie moze dodac oceny', function (done, server, client) {

        client.eval(function () {
            Meteor.loginWithPassword('u1@wp.pl', 'uczen', function () {
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
            assert.notEqual(error, undefined);
            done();
        });
    }); 

    test('uczen nie moze dodac oceny 2', function (done, server, client) {

        client.eval(function () {
            Meteor.loginWithPassword('u1@wp.pl', 'uczen', function () {
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

});