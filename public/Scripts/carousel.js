function getNekretninaIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

function postaviCarousel(glavniElement, sviElementi, indeks = 0) {
    if (glavniElement == null || sviElementi.length == 0 || indeks < 0 || indeks >= sviElementi.length)
        return null;

    let page = 0;
    let pokupljeno = false;

    for(let i = 0; i < sviElementi.length; i++) {
        if (sviElementi[i].trazeniDatum && !sviElementi[i].vidljivost) {
            sviElementi.splice(i, 1);
            i--;
        }
    }

    function odrediTip() {
        if (sviElementi[indeks].datumPonude) {
            return 0;
        }
        else if (sviElementi[indeks].trazeniDatum) {
            return 1;
        }
        else {
            return 2;
        }
    }

    function prikaziPonudu() {
        const status = sviElementi[indeks].odbijenaPonuda ? "Odbijena" : "Odobrena";

        glavniElement.innerHTML = `<div class="interesovanje">
            <p style="text-align:center"><strong>Ponuda</strong></p>
            <p><strong>ID Interesovanja: </strong>${sviElementi[indeks].id}</p>
            <p><strong>ID Korisnika: </strong>${sviElementi[indeks].korisnikId}</p>
            <p><strong>Status: </strong>${status}</p>
            ${sviElementi[indeks].vidljivost ? `
                <p><strong>Cijena ponude: </strong>${sviElementi[indeks].cijenaPonude}</p>
                <p><strong>Datum ponude: </strong>${sviElementi[indeks].datumPonude}</p>
            ` : ''}
            <p>${sviElementi[indeks].tekst}</p>
        </div>`;
    }

    function prikaziZahtjev() {
        const status = sviElementi[indeks].odobren === true ? "Odobren" : sviElementi[indeks].odobren === false ? "Odbijen" : "Na čekanju";
        glavniElement.innerHTML = `<div class="interesovanje">
            <p style="text-align:center"><strong>Zahtjev</strong></p>
            <p><strong>ID Interesovanja: ${sviElementi[indeks].id}</strong></p>
            <p><strong>ID Korisnika: </strong>${sviElementi[indeks].korisnikId}</p>
            <p><strong>Status: </strong>${status}</p>
            <p><strong>Datum: </strong>${sviElementi[indeks].trazeniDatum}</p>
            <p>${sviElementi[indeks].tekst}</p>
        </div>`;   
    }

    function prikaziUpit() {
        glavniElement.innerHTML = `<div class="interesovanje">
                <p style="text-align:center"><strong>Upit</strong></p>
                <p><strong>ID Interesovanja: </strong>${sviElementi[indeks].id}</p>
                <p><strong>ID Korisnika: </strong>${sviElementi[indeks].korisnikId}</p>
                <p>${sviElementi[indeks].tekst}</p>
            </div>`;
    }

    function prikaziTrenutni() {
        const funkcije = [prikaziPonudu, prikaziZahtjev, prikaziUpit];
        
        const tip = odrediTip();

        funkcije[tip](sviElementi[indeks]);
        
    }
    
    prikaziTrenutni();

    return {
        fnLijevo: function() {
            indeks = (indeks - 1 + sviElementi.length) % sviElementi.length;

            // if(!pokupljeno && indeks == 0) {
            //     page++;

            //     PoziviAjax.getNextUpiti(getNekretninaIdFromURL(), page, (error, data) =>{
            //         if(error){
            //             if(error.status === 404){
            //                 if(page == 0){
            //                     document.getElementById("upiti").innerHTML = `<div class="greske"><p>Nema postavljenih upita za ovu nekretninu.</p>`;
            //                 }
            //                 pokupljeno = true;
            //                 return;
            //             }
            //         }
            //         sviElementi.push(...data);
            //     });
            // }
            prikaziTrenutni();
        },
        fnDesno: function() {
            indeks = (indeks + 1) % sviElementi.length;

            // if(!pokupljeno && indeks == sviElementi.length - 1) {
            //     page++;
                
            //     PoziviAjax.getNextUpiti(getNekretninaIdFromURL(), page, (error, data) =>{
            //         if(error){
            //             if(error.status === 404){
            //                 if(page == 0){
            //                     document.getElementById("upiti").innerHTML = `<div class="greske"><p>Nema postavljenih upita za ovu nekretninu.</p>`;
            //                 }
            //                 pokupljeno = true;
            //                 return;
            //             }
            //         }
            //         sviElementi.push(...data);
            //     });
            // }
            prikaziTrenutni();
        }
    }
}


// function postaviCarousel(glavniElement, sviElementi, index = 0) {
//     if(glavniElement === null || glavniElement === undefined || sviElementi.length === 0 || index < 0 || index >= sviElementi.length) {
//         return null;
//     }

//     let page = 0;
//     let pokupljeno = false;

//     function prikaziTrenutni() {
//         glavniElement.innerHTML = ` <div class="upit">
//                                         <strong>Korisnik ID ${sviElementi[index].korisnik_id}</strong>
//                                         <p>${sviElementi[index].tekst_upita}</p>
//                                     </div>`;
//     }

//     function fnLijevo() {
//         index = (index - 1 + sviElementi.length) % sviElementi.length;

//         if(sviElementi.length % 3 == 0 && !pokupljeno && index == 0){
//             page++;
//             PoziviAjax.getNextUpiti(getNekretninaIdFromUrl(), page, (error, data) =>{
//                 if(error){
//                     if(error == "Not Found"){
//                         //ako je prazna lista upita
//                         if(page == 0){
//                             document.getElementById("upiti").innerHTML = `<div class="greske"><p>Nema postavljenih upita za ovu nekretninu.</p>`;
//                         }
//                         pokupljeno = true;
//                         return;
//                     }
//                 }
                
//                 sviElementi.push(...data);
//             });
//         }
//         prikaziTrenutni();
//     }

//     function fnDesno() {
//         index = (index + 1) % sviElementi.length;
        
//         if(sviElementi.length % 3 == 0 && !pokupljeno && index == sviElementi.length - 1){
//             page++;
//             PoziviAjax.getNextUpiti(getNekretninaIdFromUrl(), page, (error, data) =>{
//                 if(error){
//                     if(error == "Not Found"){
//                         //ako je prazna lista upita
//                         if(page == 0){
//                             document.getElementById("upiti").innerHTML = `<div class="greske"><p>Nema postavljenih upita za ovu nekretninu.</p>`;
//                         }
//                         pokupljeno = true;
//                         return;
//                     }
//                 }
                
//                 sviElementi.push(...data);
//             });
//         }

//         prikaziTrenutni();
//     }

//     prikaziTrenutni();

//     return {fnLijevo, fnDesno};
// }