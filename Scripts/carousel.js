function postaviCarousel(glavniElement, sviElementi, indeks = 0) {
    if (glavniElement == null || sviElementi.length == 0 || indeks < 0 || indeks >= sviElementi.length)
        return null;
    return {
        fnLijevo: function() {
            indeks = (indeks - 1 + sviElementi.length) % sviElementi.length;
            console.log("indeks = " + indeks + " duzina " + sviElementi.length);
            glavniElement.innerHTML = sviElementi[indeks].outerHTML;
        },
        fnDesno: function() {
            indeks = (indeks + 1) % sviElementi.length;
            console.log("indeks = " + indeks + " duzina " + sviElementi.length);
            glavniElement.innerHTML = sviElementi[indeks].outerHTML;
        }
    }
}