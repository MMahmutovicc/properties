document.querySelector('select[name="opcija"]').addEventListener('change', function(event) {
    document.getElementById('rezultat').innerText = "";
    for (let i = 1; i <= 4; i++) {
        if(i == parseInt(event.target.value)) {
            document.getElementById('div'+i).style.display = 'block';
            document.getElementById('button'+i).style.display = 'block';
        }
        else {
            document.getElementById('div'+i).style.display = 'none';
            document.getElementById('button'+i).style.display = 'none';
        }
    }
});

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

let periodiInputs = [];
let rasponiCijenaInputs = [];
let div4 = document.getElementById('div4');

let statistika = StatistikaNekretnina();
statistika.init(listaNekretnina, listaKorisnika);

let button1 = document.getElementById('button1');
button1.addEventListener('click', izracunajProsjecnuKvadraturu);

let button2 = document.getElementById('button2');
button2.addEventListener('click', pronadiOutlier);

let button3 = document.getElementById('button3');
button3.addEventListener('click', pronadiNekretnine);

let dodajPeriodBtn = document.getElementById('dodajPeriodBtn');
dodajPeriodBtn.addEventListener('click', dodajPeriod);

let dodajCijenuBtn = document.getElementById('dodajCijenuBtn');
dodajCijenuBtn.addEventListener('click', dodajCijenu);

let button4 = document.getElementById('button4');
button4.addEventListener('click', iscrtajHistogram);

function izracunajProsjecnuKvadraturu() {
    console.log('radi');

    var kriterij = podesiKriterij(0);

    
    console.log(kriterij);

    var prosjecnaKvadratura = statistika.prosjecnaKvadratura(kriterij);
    document.getElementById('rezultat').innerText = "Rezultat: "+ prosjecnaKvadratura;
}

function pronadiOutlier() {
    var kriterij = podesiKriterij(1);
    console.log(kriterij);

    var nazivSvojstvaSelect = document.querySelector('select[name="nazivSvojstva"]');
    var outlier = nazivSvojstvaSelect.options[nazivSvojstvaSelect.selectedIndex].value;
    console.log(outlier);
    
    var outlierNekretnina = statistika.outlier(kriterij, outlier);
    console.log(outlierNekretnina);

    document.getElementById('rezultat').innerText = "Outlier: "+outlierNekretnina.naziv + ", " + outlier + "= " + outlierNekretnina[outlier];
}

function pronadiNekretnine() {

    var korisnikSelect = document.querySelector('select[name="korisnik"]');

    var korisnik = listaKorisnika.find(k => k.username === korisnikSelect.options[korisnikSelect.selectedIndex].value);
    console.log(korisnik);

    var nekretnine = statistika.mojeNekretnine(korisnik);
    console.log(nekretnine);

    document.getElementById('rezultat').innerText = "Nekretnine:\n";
    nekretnine.forEach((nekretnina, index) => {
        document.getElementById('rezultat').innerText += index + 1 +'. ' + nekretnina.naziv + "\n";
    });
}



function dodajPeriod() {
    periodiInputs.push({od: document.createElement('input'), do: document.createElement('input')});
    periodiInputs[periodiInputs.length-1].od.type = 'number';
    periodiInputs[periodiInputs.length-1].od.name = 'od'+periodiInputs.length;
    periodiInputs[periodiInputs.length-1].do.type = 'number';
    periodiInputs[periodiInputs.length-1].do.name = 'do'+periodiInputs.length;

    var inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    var label = document.createElement('label');
    label.innerText = 'Period Od:';
    inputGroup.appendChild(label);
    inputGroup.appendChild(periodiInputs[periodiInputs.length-1].od);
    
    var label = document.createElement('label');
    label.innerText = ' Do:';
    inputGroup.appendChild(label);
    inputGroup.appendChild(periodiInputs[periodiInputs.length-1].do);
    div4.insertBefore(inputGroup, document.getElementById('button4'));
}

function dodajCijenu() {
    rasponiCijenaInputs.push({od: document.createElement('input'), do: document.createElement('input')});
    rasponiCijenaInputs[rasponiCijenaInputs.length-1].od.type = 'number';
    rasponiCijenaInputs[rasponiCijenaInputs.length-1].od.name = 'od'+rasponiCijenaInputs.length;
    rasponiCijenaInputs[rasponiCijenaInputs.length-1].do.type = 'number';
    rasponiCijenaInputs[rasponiCijenaInputs.length-1].do.name = 'do'+rasponiCijenaInputs.length;

    var inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    var label = document.createElement('label');
    label.innerText = 'Cijena Od:';
    inputGroup.appendChild(label);
    inputGroup.appendChild(rasponiCijenaInputs[rasponiCijenaInputs.length-1].od);
    
    var label = document.createElement('label');
    label.innerText = ' Do:';
    inputGroup.appendChild(label);
    inputGroup.appendChild(rasponiCijenaInputs[rasponiCijenaInputs.length-1].do);

    div4.insertBefore(inputGroup, document.getElementById('button4'));
}



function iscrtajHistogram() {
    let periodi = [];
    let rasponiCijena = [];

    for (let i = 0; i < periodiInputs.length; i++) {
        periodi.push({od: parseInt(periodiInputs[i].od.value), do: parseInt(periodiInputs[i].do.value)});
    }

    for (let i = 0; i < rasponiCijenaInputs.length; i++) {
        rasponiCijena.push({od: parseInt(rasponiCijenaInputs[i].od.value), do: parseInt(rasponiCijenaInputs[i].do.value)});
    }

    let labele = [];
    for (let i = 0; i < rasponiCijena.length; i++) {   
        labele.push(rasponiCijena[i].od + '-' + rasponiCijena[i].do);
    }
    console.log(periodi);
    console.log(rasponiCijena);
    let histogram = statistika.histogramCijena(periodi, rasponiCijena);
    console.log(histogram);

    let podaci = histogram.map(h => h.brojNekretnina);
    console.log(podaci);

    for (let i = 0; i < periodi.length; i++) {
        let canvas = document.createElement('canvas');
        canvas.id = 'myBarChart' + i;
        div4.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        let podaciHistogram = [];
        for (let j = 0; j < rasponiCijena.length; j++) {
            podaciHistogram.push(podaci[i*periodi.length+j]);
        }
        const myBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labele,
                datasets: [{
                    label: 'Broj nekretnina u periodu: '+periodi[i].od+'-'+periodi[i].do,
                    data: podaciHistogram,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}


// Pomocna funkcija za podesavanje kriterija
function podesiKriterij(number) {
    var kriterij = {
        tip_nekretnine: null,
        min_kvadratura: null,
        max_kvadratura: null,
        min_cijena: null,
        max_cijena: null
    }

    var tipCheckbox = document.querySelectorAll('input[name="tipCheckbox"]')[number];
    if (tipCheckbox.checked) {
        var tipSelect = document.querySelectorAll('select[name="tipNekretnine"]')[number];
        var tip_nekretnine = tipSelect.options[tipSelect.selectedIndex].value;
        kriterij.tip_nekretnine = tip_nekretnine
    } 

    var minKvadraturaCheckbox = document.querySelectorAll('input[name="minKvadraturaCheckbox"]')[number];
    if (minKvadraturaCheckbox.checked) {
        var min_kvadratura = parseInt(document.querySelectorAll('input[name="minKvadraturaInput"]')[number].value);
        kriterij.min_kvadratura = min_kvadratura;
    } 

    var maxKvadraturaCheckbox = document.querySelectorAll('input[name="maxKvadraturaCheckbox"]')[number];
    if (maxKvadraturaCheckbox.checked) {
        var max_kvadratura = parseInt(document.querySelectorAll('input[name="maxKvadraturaInput"]')[number].value);
        kriterij.max_kvadratura = max_kvadratura;
    } 

    var minCijenaCheckbox = document.querySelectorAll('input[name="minCijenaCheckbox"]')[number];
    if (minCijenaCheckbox.checked) {
        var min_cijena = parseInt(document.querySelectorAll('input[name="minCijenaInput"]')[number].value);
        kriterij.min_cijena = min_cijena;
    } 

    var maxCijenaCheckbox = document.querySelectorAll('input[name="maxCijenaCheckbox"]')[number];
    if (maxCijenaCheckbox.checked) {
        var max_cijena = parseInt(document.querySelectorAll('input[name="maxCijenaInput"]')[number].value);
        kriterij.max_cijena = max_cijena;
    } 

    return kriterij;
}