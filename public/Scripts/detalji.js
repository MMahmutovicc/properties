function getNekretninaIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

const glavniElement = document.getElementById("upiti");
const sviElementi = Array.from(glavniElement.getElementsByClassName("upit"));
const nekretninaId = getNekretninaIdFromURL();

// let carousel = postaviCarousel(glavniElement, sviElementi);

let upiti = [];
let carousel = null;
let prev = document.getElementsByClassName("prev")[0];
let next = document.getElementsByClassName("next")[0];

PoziviAjax.getNekretnina(nekretninaId, (error, data) => {
    if(error){
        document.getElementById('osnovno').innerHTML = `<div class="greske"><p>Došlo je do greške.</p>`;
        return;
    }

    putanjaSlike = `../Resources/${data.id}.jpg`;

    document.getElementById('slika').src = putanjaSlike;
    document.getElementById('naziv').innerHTML = `<strong> Naziv: </strong> ${data.naziv}`;
    document.getElementById('kvadratura').innerHTML = `<strong> Kvadratura: </strong> ${data.kvadratura}`;
    document.getElementById('cijena').innerHTML = `<strong> Cijena: </strong> ${data.cijena}`;
    document.getElementById('tip-grijanja').innerHTML = `<strong> Tip grijanja: </strong> ${data.tip_grijanja}`;
    document.getElementById('lokacija').innerHTML = `<strong> Lokacija: </strong> <a href=# id=link-lokacija>${data.lokacija}`; //ubaci link
    document.getElementById('godina-izgradnje').innerHTML = `<strong> Godina izgradnje: </strong> ${data.godina_izgradnje}`;
    const godinaObjave = data.datum_objave.split('.')[2];
    document.getElementById('datum-objave').innerHTML = `<strong> Godina objave: </strong> ${godinaObjave}`;
    document.getElementById('opis').innerHTML = `<p> <strong> Opis: </strong> ${data.opis}</p>`;

    upiti = data.upiti;

    if (upiti.length == 0) {
        glavniElement.innerHTML = `<p class="error">Nekretnina nema upita.</p>`;
        return;
    }
    console.log(upiti);

    carousel = postaviCarousel(glavniElement, upiti);
    glavniElement.innerHTML += prev.outerHTML;
    glavniElement.innerHTML += next.outerHTML;

    document.getElementById('lokacija').addEventListener('click', () => {
        const lokacija = data.lokacija;

        PoziviAjax.getTop5Nekretnina(lokacija, (err, nekretnine) => {
            if (err) {
                return;
            }
            
            document.getElementById('top5').style.display = 'block';

            const top5Div = document.getElementById('top5__nekretnine');
            let prikaz = "";
            nekretnine.forEach(nekretnina => {
                prikaz += `
                    <div class="nekretnina">
                        <h3>${nekretnina.naziv}</h3>
                        <p>Kvadratura: ${nekretnina.kvadratura} m²</p>
                        <p>Cijena: ${nekretnina.cijena} BAM</p>
                        <a href="detalji.html?id=${nekretnina.id}" class="detalji-dugme">Detalji</a>
                    </div>
                `;
            });
            top5Div.innerHTML = prikaz;
        });
    });

});

function showPrevious() {
    if (carousel == null)
        return;
    carousel.fnLijevo();
    glavniElement.innerHTML += prev.outerHTML;
    glavniElement.innerHTML += next.outerHTML;
}

function showNext() {
    if (carousel == null)
        return;
    carousel.fnDesno();
    glavniElement.innerHTML += prev.outerHTML;
    glavniElement.innerHTML += next.outerHTML;
}


