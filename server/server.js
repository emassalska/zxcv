
var addUser = function (username, email, password, role, dbuser_id) {
    var user_id = Accounts.createUser({ username: username, email: email, password: password });
    Rola.insert({ meteor_user: user_id, role: role, dbuser_id: dbuser_id });
}

Meteor.startup(function () {

    //Uczen.remove({});
    //tworzymy dane
    if (Uczen.find().count() == 0) {
        //czyszczenie pozostalych tabel na wszelki wypadek
        Uczen.remove({});
        Nauczyciel.remove({});
        Przedmiot.remove({});
        Ocena.remove({});
        Rola.remove({});
        Meteor.users.remove({});

        //dodajemy uczniow
        var u1_id = Uczen.insert({
            imie: "Karol",
            nazwisko: "Kowalski"
        });
        var u2_id = Uczen.insert({
            imie: "Ania",
            nazwisko: "D¹b"
        });
        var u3_id = Uczen.insert({
            imie: "Dominik",
            nazwisko: "Wawry³o"
        });
        var u4_id = Uczen.insert({
            imie: "Zbigniew",
            nazwisko: "Noga"
        });
        var u5_id = Uczen.insert({
            imie: "Piotr",
            nazwisko: "Pasieka"
        });
        var u6_id = Uczen.insert({
            imie: "Katarzyna",
            nazwisko: "Stonoga"
        });

        //dodajemy uzytkownikow - uczniow
        addUser("Karol Kowalski", "u1@wp.pl", "uczen", "uczen", u1_id);
        addUser("Ania D¹b", "u2@wp.pl", "uczen", "uczen", u2_id);
        addUser("Dominik Wawry³o", "u3@wp.pl", "uczen", "uczen", u3_id);
        addUser("Zbigniew Noga", "u4@wp.pl", "uczen", "uczen", u4_id);
        addUser("Piotr Pasieka", "u5@wp.pl", "uczen", "uczen", u5_id);
        addUser("Katarzyna Stonoga", "u6@wp.pl", "uczen", "uczen", u6_id);

        //dodajemy przedmioty
        var biologia_id = Przedmiot.insert({
            nazwa: "Biologia"
        });

        //dodajemy przedmioty
        var chemia_id = Przedmiot.insert({
            nazwa: "Chemia"
        });

        //dodajemy przedmioty
        var fizyka_id = Przedmiot.insert({
            nazwa: "Fizyka"
        });

        //dodajemy nauczycieli
        var n1_id = Nauczyciel.insert({
            imie: "Marcin",
            nazwisko: "Klon",
            przedmiot: [biologia_id, chemia_id]
        });

        var n2_id = Nauczyciel.insert({
            imie: "Kamila",
            nazwisko: "Mucha",
            przedmiot: [chemia_id, fizyka_id]
        });

        //dodajemy uzytkownikow - nauczycieli
        addUser("Marcin Klon", "n1@wp.pl", "nauczyciel", "nauczyciel", n1_id);
        addUser("Kamila Mucha", "n2@wp.pl", "nauczyciel", "nauczyciel", n2_id);

        //dodajemy uczniom oceny z przedmiotow

        Ocena.insert({
            ocena: 1,
            uczen: u1_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })

        Ocena.insert({
            ocena: 3,
            uczen: u2_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })

        Ocena.insert({
            ocena: 2,
            uczen: u2_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })

        Ocena.insert({
            ocena: 5,
            uczen: u3_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })

        Ocena.insert({
            ocena: 2,
            uczen: u1_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })

        Ocena.insert({
            ocena: 1,
            uczen: u4_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })

        Ocena.insert({
            ocena: 1,
            uczen: u1_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })

        Ocena.insert({
            ocena: 1,
            uczen: u1_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })

        Ocena.insert({
            ocena: 4,
            uczen: u1_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })

        Ocena.insert({
            ocena: 1,
            uczen: u1_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })

        Ocena.insert({
            ocena: 1,
            uczen: u1_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })

        Ocena.insert({
            ocena: 1,
            uczen: u1_id,
            nauczyciel: n1_id,
            przedmiot: biologia_id
        })
    }

});

Meteor.publish("przedmioty", function () {
    return Przedmiot.find();
});


Meteor.publish("uczniowie", function () {
    return [
        Uczen.find(),
        Ocena.find()
    ]; //jesli pobieramy uczniow to chcemy tez ich wszystkie oceny
});

Meteor.publish("nauczyciele", function () {
    return Nauczyciel.find();
});

Meteor.publish("rola", function (user_id) {
    if (this.userId == user_id && user_id) {
        return Rola.find({ meteor_user: this.userId });
    } else {
        return {};
    }
})

var sprawdzCzyJestemNauczycielem = function () {
    var nauczyciel = Rola.findOne({ meteor_user: Meteor.userId() });
    if (!nauczyciel) {
        throw new Meteor.Error(401, 'Brak uprawnien! Zaloguj siê!');
    } else if (nauczyciel.role != 'nauczyciel') {
        throw new Meteor.Error(401, 'Brak uprawnien! Nie jestes nauczycielem');
    }
}

function isInt(value) {
    return !isNaN(value) &&
           parseInt(Number(value)) == value &&
           !isNaN(parseInt(value, 10));
}

var sprawdzOcene = function (ocena) {
    if (!isInt(ocena)) {
        throw new Meteor.Error(500, 'Podana wartosc nie jest ocena');
    } else {
        var val = parseInt(ocena);
        if (val <= 0 || val > 6) {
            throw new Meteor.Error(500, 'Wartosc spoza zakresu 1-6');
        }
    }
}

Meteor.methods({
    zmienOcene: function (ocena_id, wartosc) {
        sprawdzCzyJestemNauczycielem();
        sprawdzOcene(wartosc);
        Ocena.update(ocena_id, { $set: { ocena: wartosc, nauczyciel: Rola.findOne({ meteor_user: Meteor.userId() }).dbuser_id } });
    },
    dodajOcene: function (uczen_id, przedmiot_id, wartosc) {
        sprawdzCzyJestemNauczycielem();
        sprawdzOcene(wartosc);
        Ocena.insert({
            ocena: wartosc,
            uczen: uczen_id,
            nauczyciel: Rola.findOne({ meteor_user: Meteor.userId() }).dbuser_id,
            przedmiot: przedmiot_id
        });
    },
    usunOcene: function (ocena_id) {
        sprawdzCzyJestemNauczycielem();
        Ocena.remove({ _id: ocena_id });
    }
});