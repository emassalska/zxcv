//wybrany przedmiot
Session.setDefault('przedmiot_id', null);
Session.setDefault('edytowanaOcena_id', null);
Session.setDefault('dodajOcene', null);

////podlaczamy sie do danych z serwera
Meteor.subscribe("przedmioty", function () {
    if (!Session.get('przedmiot_id')) {
        var przedmiot = Przedmiot.findOne({}, { sort: { nazwa: 1 } });
        console.log('inicjuje przedmiot na ' + przedmiot);
        if (przedmiot)
            Session.set('przedmiot_id', przedmiot._id);
    }
});
//Meteor.subscribe("przedmioty");
Meteor.subscribe("uczniowie");
Meteor.subscribe("nauczyciele");
Meteor.subscribe("oceny");



Template.viewSelector.helpers({
    isNauczyciel: function () {
        var rola = Rola.findOne({ meteor_user: Meteor.userId() });
        if (rola && rola.role) {
            console.log("Rozpoznana rola: " + rola.role);
        }
        else {
            console.log("Rola nierozpoznana")
        }
        if (rola && rola.role == "nauczyciel") {
            return true;
        }
        else {
            return false;
        }
    },

    isUczen: function () {
        var rola = Rola.findOne({ meteor_user: Meteor.userId() });
        if (rola && rola.role) {
            console.log("Rozpoznana rola: " + rola.role);
        }
        else {
            console.log("Rola nierozpoznana")
        }
        if (rola && rola.role == "uczen") {
            return true;
        }
        else {
            return false;
        }
    }
});


Deps.autorun(function () {
    Meteor.subscribe('rola', Meteor.userId());
});


// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
    var ok = callbacks.ok || function () { };
    var cancel = callbacks.cancel || function () { };

    var events = {};
    events['keyup ' + selector + ', keydown ' + selector + ', focusout ' + selector] =
      function (evt) {
          if (evt.type === "keydown" && evt.which === 27) {
              // escape = cancel
              cancel.call(this, evt);

          } else if (evt.type === "keyup" && evt.which === 13 ||
                     evt.type === "focusout") {
              // blur/return/enter = ok/submit if non-empty
              var value = String(evt.target.value || "");
              if (value)
                  ok.call(this, value, evt);
              else
                  cancel.call(this, evt);
          }
      };

    return events;
};

var activateInput = function (input) {
    input.focus();
    input.select();
};

Template.listaPrzedmiotow.lista = function () {
    return Przedmiot.find({}, { sort: { nazwa: 1 } });
}

Template.listaPrzedmiotow.events(
{
    'click li': function (evt) {
        console.log('Zmieniam przedmiot na ' + this._id);
        Session.set("przedmiot_id", this._id);
    }
});

Template.listaPrzedmiotow.selected = function () {
    return Session.equals('przedmiot_id', this._id) ? 'selected' : '';
};

Template.listaUczniow.lista = function () {
    console.log('Renderuje liste uczniow dla przedmiotu ' + Session.get('przedmiot_id'))
    return Uczen.find({}, { sort: { nazwisko: 1 } });
}

Template.listaOcen.oceny = function () {
    console.log('Renderuje ocene dla przedmiotu ' + Session.get('przedmiot_id'))
    return Ocena.find({ uczen: this._id, przedmiot: Session.get('przedmiot_id') });
}

Template.listaOcen.nauczyciel = function () {
    console.log('nauczyciel id ' + this.nauczyciel)
    var nauczyciel = Nauczyciel.findOne({ _id: this.nauczyciel });
    if (nauczyciel) {
        return nauczyciel.imie + ' ' + nauczyciel.nazwisko;
    }
    else {
        return 'Nieznany';
    }
}

var obslugaBledowCall = function (error, result) {
    if (error) {
        alert(error);
    }
}

Template.listaOcen.events(
{
    'dblclick div.ocena': function (evt, tmpl) {
        console.log('Zmieniam edytowana ocene na ' + this._id);
        Session.set("edytowanaOcena_id", this._id);
        Deps.flush(); //renderujemy widok - pojawi sie input
        activateInput(tmpl.find("input"));
    },

    'click div.addOcena': function (evt, tmpl) {
        Session.set("dodajOcene", this._id);
        Deps.flush(); //renderujemy widok - pojawi sie input
        activateInput(tmpl.find("input"));
    },

    'click div.ocena .remove': function (evt, tmpl) {
        if (confirm('Czy na pewno chcesz usun¹æ t¹ ocenê?')) {
            Meteor.call('usunOcene', this._id, obslugaBledowCall);
        }
    }

});

Template.listaOcen.events(okCancelEvents(
  'div.ocena input',
  {
      ok: function (value) {
          console.log('Zapisalem edytowana ocene ' + value)
          Meteor.call('zmienOcene', this._id, value, obslugaBledowCall);
          Session.set('edytowanaOcena_id', null);
      },
      cancel: function () {
          console.log('Anulowalem edycje ocene ')
          Session.set('edytowanaOcena_id', null);
      }
  }));

Template.listaOcen.events(okCancelEvents(
  'div.addOcena input',
  {
      ok: function (value) {
          console.log('Zapisalem nowa ocene ' + value)
          Meteor.call('dodajOcene', this._id, Session.get('przedmiot_id'), value, obslugaBledowCall);
          Session.set('dodajOcene', null);
      },
      cancel: function () {
          console.log('Anulowalem nowa ocene')
          Session.set('dodajOcene', null);
      }
  }));

Template.listaOcen.editing = function () {
    return Session.equals('edytowanaOcena_id', this._id);
};

Template.listaOcen.adding = function () {
    return Session.equals('dodajOcene', this._id);
};


Template.listaOcenUcznia.oceny = function () {
    return Ocena.find({ uczen: Rola.findOne({ meteor_user: Meteor.userId() }).dbuser_id, przedmiot: Session.get('przedmiot_id') });
}

Template.listaOcenUcznia.nauczyciel = function () {
    console.log('nauczyciel id ' + this.nauczyciel)
    var nauczyciel = Nauczyciel.findOne({ _id: this.nauczyciel });
    if (nauczyciel) {
        return nauczyciel.imie + ' ' + nauczyciel.nazwisko;
    }
    else {
        return 'Nieznany';
    }
}