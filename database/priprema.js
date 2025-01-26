const db = require('./db.js'); // Importovanje Sequelize konekcije i modela

// Sinhronizacija baze i inicijalizacija podataka
db.sequelize.sync({ force: true }).then(function () {
  inicializacija().then(function () {
    console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
    process.exit();
  });
});

function inicializacija() {
  return new Promise(function (resolve, reject) {
    const korisniciListaPromisea = [];
    const nekretnineListaPromisea = [];
    const upitiListaPromisea = [];

    // Dodavanje korisnika
    const korisniciPodaci = [
      {
        id: 1,
        ime: "admin",
        prezime: "admin",
        username: "admin",
        password: "$2a$12$.kN1Ju2lJlMrsmjAzTGIA.9fzpYIes/4tIl0YeI9N4IzXzA/oOWl.",
        admin: true,
      },
      {
        id: 2,
        ime: "user",
        prezime: "user",
        username: "user",
        password: "$2a$12$ZbrOdHeX90XUizE0u1gwYeYOV6YKan2vhYOAlyefsPw3WbFx5FfK6",
        admin: false,
      }
    ];

    korisniciPodaci.forEach((korisnik) => {
      korisniciListaPromisea.push(db.korisnik.create(korisnik));
    });

    Promise.all(korisniciListaPromisea).then(function (korisnici) {
      const nekretninePodaci = [
        {
          id: 1,
          tip_nekretnine: "Stan",
          naziv: "Useljiv stan Sarajevo",
          kvadratura: 58,
          cijena: 232000,
          tip_grijanja: "plin",
          lokacija: "Novo Sarajevo",
          godina_izgradnje: 2019,
          datum_objave: "01.10.2023.",
          opis: "Sociis natoque penatibus.",
          upiti: [
            {
              korisnik_id: 1,
              tekst_upita: "Nullam eu pede mollis pretium.",
            },
            {
              korisnik_id: 2,
              tekst_upita: "Phasellus viverra nulla.",
            },
          ],
        },
        {
          id: 2,
          tip_nekretnine: "Poslovni prostor",
          naziv: "Mali poslovni prostor",
          kvadratura: 20,
          cijena: 70000,
          tip_grijanja: "struja",
          lokacija: "Centar",
          godina_izgradnje: 2005,
          datum_objave: "20.08.2023.",
          opis: "Magnis dis parturient montes.",
          upiti: [
            {
              korisnik_id: 2,
              tekst_upita: "Integer tincidunt.",
            },
          ],
        },
      ];

      nekretninePodaci.forEach((nekretnina) => {
        nekretnineListaPromisea.push(
          db.nekretnina
            .create({
              id: nekretnina.id,
              tip_nekretnine: nekretnina.tip_nekretnine,
              naziv: nekretnina.naziv,
              kvadratura: nekretnina.kvadratura,
              cijena: nekretnina.cijena,
              tip_grijanja: nekretnina.tip_grijanja,
              lokacija: nekretnina.lokacija,
              godina_izgradnje: nekretnina.godina_izgradnje,
              datum_objave: nekretnina.datum_objave,
              opis: nekretnina.opis,
            })
            .then(function (kreiranaNekretnina) {
              const upiti = nekretnina.upiti.map((upit) => ({
                korisnikId: upit.korisnik_id,
                tekst: upit.tekst_upita,
                nekretninaId: kreiranaNekretnina.id,
              }));

              upiti.forEach((upit) => {
                upitiListaPromisea.push(db.upit.create(upit));
              });

              return kreiranaNekretnina;
            })
        );
      });

      Promise.all(nekretnineListaPromisea)
        .then(() => Promise.all(upitiListaPromisea))
        .then(() => resolve())
        .catch((err) => {
          console.error("Greska prilikom kreiranja nekretnina ili upita:", err);
          reject(err);
        });
    });
  });
}