const listaNekretnina = [{
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
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 32000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2009.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2003.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 3,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 4,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
}]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]

let statistika = StatistikaNekretnina();
statistika.init(listaNekretnina, listaKorisnika);

let izracunaj = document.getElementById('izracunaj');
izracunaj.addEventListener('click', izracunajProsjecnuKvadraturu);

function izracunajProsjecnuKvadraturu() {
    console.log('radi');
    var kriterij = {
        tip_nekretnine: null,
        min_kvadratura: null,
        max_kvadratura: null,
        min_cijena: null,
        max_cijena: null
    }
    var tipCheckbox = document.querySelector('input[name="tipCheckbox"]');
    if (tipCheckbox.checked) {
        var tipSelect = document.querySelector('select[name="tipNekretnine"]');
        var tip_nekretnine = tipSelect.options[tipSelect.selectedIndex].value;
        kriterij.tip_nekretnine = tip_nekretnine
    } 

    var minKvadraturaCheckbox = document.querySelector('input[name="minKvadraturaCheckbox"]');
    if (minKvadraturaCheckbox.checked) {
        var min_kvadratura = parseInt(document.querySelector('input[name="minKvadraturaInput"]').value);
        kriterij.min_kvadratura = min_kvadratura;
    } 

    var maxKvadraturaCheckbox = document.querySelector('input[name="maxKvadraturaCheckbox"]');
    if (maxKvadraturaCheckbox.checked) {
        var max_kvadratura = parseInt(document.querySelector('input[name="maxKvadraturaInput"]').value);
        kriterij.max_kvadratura = max_kvadratura;
    } 

    var minCijenaCheckbox = document.querySelector('input[name="minCijenaCheckbox"]');
    if (minCijenaCheckbox.checked) {
        var min_cijena = parseInt(document.querySelector('input[name="minCijenaInput"]').value);
        kriterij.min_cijena = min_cijena;
    } 

    var maxCijenaCheckbox = document.querySelector('input[name="maxCijenaCheckbox"]');
    if (maxCijenaCheckbox.checked) {
        var max_cijena = parseInt(document.querySelector('input[name="maxCijenaInput"]').value);
        kriterij.max_cijena = max_cijena;
    } 
    console.log(kriterij);
    var prosjecnaKvadratura = statistika.prosjecnaKvadratura(kriterij);
    document.getElementById('prosjecnaKvadratura').innerText = prosjecnaKvadratura;
}