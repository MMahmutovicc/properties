function getNekretninaIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

function postaviCarousel(glavniElement, sviElementi, indeks = 0) {
    if (glavniElement == null || sviElementi.length == 0 || indeks < 0 || indeks >= sviElementi.length)
        return null;

    let page = 0;
    let pokupljeno = false;

    function prikaziTrenutni() {
        glavniElement.innerHTML = `<div class="upit">
            <p><strong>${sviElementi[indeks].korisnik_id}</strong></p>
            <p>${sviElementi[indeks].tekst_upita}</p>
        </div>`;
    }
    
    prikaziTrenutni();

    return {
        fnLijevo: function() {
            indeks = (indeks - 1 + sviElementi.length) % sviElementi.length;

            if(!pokupljeno && indeks == 0) {
                page++;

                PoziviAjax.getNextUpiti(getNekretninaIdFromURL(), page, (error, data) =>{
                    if(error){
                        if(error.status === 404){
                            if(page == 0){
                                document.getElementById("upiti").innerHTML = `<div class="greske"><p>Nema postavljenih upita za ovu nekretninu.</p>`;
                            }
                            pokupljeno = true;
                            return;
                        }
                    }
                    sviElementi.push(...data);
                });
            }
            prikaziTrenutni();
        },
        fnDesno: function() {
            indeks = (indeks + 1) % sviElementi.length;

            if(!pokupljeno && indeks == sviElementi.length - 1) {
                page++;
                
                PoziviAjax.getNextUpiti(getNekretninaIdFromURL(), page, (error, data) =>{
                    if(error){
                        if(error.status === 404){
                            if(page == 0){
                                document.getElementById("upiti").innerHTML = `<div class="greske"><p>Nema postavljenih upita za ovu nekretninu.</p>`;
                            }
                            pokupljeno = true;
                            return;
                        }
                    }
                    sviElementi.push(...data);
                });
            }
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