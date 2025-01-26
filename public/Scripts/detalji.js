function getNekretninaIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

// const glavniElement = document.getElementById("upiti");
// const sviElementi = Array.from(glavniElement.getElementsByClassName("upit"));
const nekretninaId = getNekretninaIdFromURL();

const interesovanjaDiv = document.getElementById('interesovanja-lista');
const interesovanjeForma = document.getElementById('interesovanje-forma');
const tipInteresovanja = document.getElementById("tip-interesovanja");
const vezanaPonuda = document.getElementById("vezana-ponuda");
const cijenaPonude = document.getElementById("cijena-ponude");
const odbijenaPonuda = document.getElementById("odbijena-ponuda");
const datumInteresovanja = document.getElementById("datum-interesovanja");
const tekstInteresovanja = document.getElementById("tekst-interesovanja");

const svePonude = [];
// let carousel = postaviCarousel(glavniElement, sviElementi);

let upiti = [];
let carousel = null;
let prev = document.getElementsByClassName("prev")[0];
let next = document.getElementsByClassName("next")[0];
interesovanjeForma.style.display = "none";

function dodajInteresovanje() { 
    interesovanjeForma.style.display = "block";
    document.getElementById('dodaj-interesovanje').style.display = "none";
}

tipInteresovanja.addEventListener('change', () => {
    const selectedValue = tipInteresovanja.value;

    if (selectedValue === "ponuda") {
        cijenaPonude.style.display = "block";
        odbijenaPonuda.style.display = "inline-block";
        document.querySelector('label[for="odbijena-ponuda"]').style.display = "inline-block";
        vezanaPonuda.style.display = "block";
        datumInteresovanja.style.display = "none";

    } 
    else {
        cijenaPonude.style.display = "none";
        odbijenaPonuda.style.display = "none";
        document.querySelector('label[for="odbijena-ponuda"]').style.display = "none";
        vezanaPonuda.style.display = "none";
        datumInteresovanja.style.display = "none";
    }

    if (selectedValue === "zahtjev") {
        datumInteresovanja.style.display = "block";
    }
});

function posaljiInteresovanje() {
    const tip = tipInteresovanja.value;
    const cijena = cijenaPonude.value;
    const odbijena = odbijenaPonuda.checked;
    const vezana = vezanaPonuda.value;
    const datum = datumInteresovanja.value;
    const tekst = tekstInteresovanja.value;

    if (tip === "ponuda") {
        if ((cijena === "" || isNaN(cijena))) {
            alert("Morate unijeti cijenu");
            return;
        }
        
        const datumPonude = new Date().toISOString().split('T')[0];
        const idVezanePonude = vezana ? vezana : null;
        PoziviAjax.postNekretninaPonuda(nekretninaId, tekst, cijena, datumPonude, idVezanePonude, odbijena, (error, data) => {
            if (error) {
                alert("Došlo je do greške.");
                return;
            }

            alert("Interesovanje uspješno dodano.");
            window.location.reload();
        });

        return;
    }

    else if (tip === "zahtjev") {
        if (datum == "") {
            alert("Datum ne smije biti prazan.");
            return;
        }
        
        PoziviAjax.postNekretninaZahtjev(nekretninaId, tekst, datum, (error, data) => {
            if (error) {
                alert("Došlo je do greške.");
                return;
            }

            alert("Interesovanje uspješno dodano.");
            window.location.reload();
        });

        return;
    }

    else {
        PoziviAjax.postUpit(nekretninaId, tekst, (error, data) => {
            if (error) {
                alert("Došlo je do greške.");
                return;
            }
    
            alert("Interesovanje uspješno dodano.");
            window.location.reload();
        });
    }
}



PoziviAjax.getNekretnina(nekretninaId, (error, data) => {
    if(error){
        document.getElementById('osnovno').innerHTML = `<div class="error"><p>Došlo je do greške.</p>`;
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

    PoziviAjax.getInteresovanja(nekretninaId, (error, interesovanja) => {
        if (error) {
            document.getElementById('interesovanja').innerHTML = `<div class="error"><p>Došlo je do greške.</p>`;
            return;
        }
        console.log("Interesovanja:", interesovanja);
    
        if (interesovanja.length == 0) {
            interesovanjaDiv.innerHTML = `<p class="error">Nekretnina nema interesovanja.</p>`;
            return;
        }

        interesovanja.forEach(interesovanje => {
            if (interesovanje.datumPonude) {
                svePonude.push(interesovanje);

                if (interesovanje.vidljivost) {
                    const option = document.createElement('option');
                    option.value = interesovanje.id;
                    option.text = interesovanje.id;
                    document.getElementById('vezana-ponuda').appendChild(option);
                }
            }
        });

        if (svePonude.length == 0) {
            document.getElementById('vezana-ponuda').disabled = true;
        }

        carousel = postaviCarousel(interesovanjaDiv, interesovanja);
        interesovanjaDiv.innerHTML += prev.outerHTML;
        interesovanjaDiv.innerHTML += next.outerHTML;
    
    });

    // upiti = data.upiti;

    // if (upiti.length == 0) {
    //     glavniElement.innerHTML = `<p class="error">Nekretnina nema upita.</p>`;
    //     return;
    // }
    // console.log(upiti);

    // carousel = postaviCarousel(glavniElement, upiti);
    // glavniElement.innerHTML += prev.outerHTML;
    // glavniElement.innerHTML += next.outerHTML;

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
    interesovanjaDiv.innerHTML += prev.outerHTML;
    interesovanjaDiv.innerHTML += next.outerHTML;
}

function showNext() {
    if (carousel == null)
        return;
    carousel.fnDesno();
    interesovanjaDiv.innerHTML += prev.outerHTML;
    interesovanjaDiv.innerHTML += next.outerHTML;
}


