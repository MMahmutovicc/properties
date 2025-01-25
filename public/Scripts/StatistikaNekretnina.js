let StatistikaNekretnina = function () {
    let listaNekretnina = [];
    let listaKorisnika = [];
    let spisakNekretnina =  SpisakNekretnina();

    let init = function (listaNekretnina, listaKorisnika) {
        spisakNekretnina.init(listaNekretnina, listaKorisnika);
        this.listaNekretnina = listaNekretnina;
        this.listaKorisnika = listaKorisnika;
    }

    let prosjecnaKvadratura = function (kriterij) {
        let filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine(kriterij);
        if (filtriraneNekretnine.length === 0)
            return 0;

        console.log(filtriraneNekretnine);
        console.log(filtriraneNekretnine.length);
        let suma = 0;

        for (let i = 0; i < filtriraneNekretnine.length; i++)
            suma += filtriraneNekretnine[i].kvadratura;

        return suma / filtriraneNekretnine.length;
    }

    let outlier = function (kriterij, nazivSvojstva) {
        let filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine(kriterij);
        let suma = 0;

        for (let i = 0; i < filtriraneNekretnine.length; i++) 
            suma += filtriraneNekretnine[i][nazivSvojstva];
        

        let prosjek = suma / filtriraneNekretnine.length;
        console.log(prosjek);
        let maxOdstupanje = -1;
        let outlierNekretnina = null;

        for (let i = 0; i < filtriraneNekretnine.length; i++) {
            let odstupanje = Math.abs(filtriraneNekretnine[i][nazivSvojstva] - prosjek);
            if (odstupanje > maxOdstupanje) {
                maxOdstupanje = odstupanje;
                outlierNekretnina = filtriraneNekretnine[i];
            }
        }

        return outlierNekretnina;
    }

    let mojeNekretnine = function (korisnik) {
        let nekretnine = [];
        for (let i = 0; i < this.listaNekretnina.length; i++) {
            let count = this.listaNekretnina[i].upiti.filter(upit => upit.korisnik_id === korisnik.id).length;
            if (count > 0) {
                nekretnine.push({ nekretnina: this.listaNekretnina[i], count: count });
            }
        }
        nekretnine.sort((a, b) => b.count - a.count);
        nekretnine = nekretnine.map(item => item.nekretnina);
        return nekretnine;
    }

    let histogramCijena = function (periodi, rasponiCijena) {
        
        let histogram = [];

        for (let i = 0; i < periodi.length; i++) {
            for (let j = 0; j < rasponiCijena.length; j++) {
                let brojNekretnina = this.listaNekretnina.filter(nekretnina => 
                    parseInt(nekretnina.datum_objave.split('.')[2]) >= periodi[i].od && 
                    parseInt(nekretnina.datum_objave.split('.')[2]) <= periodi[i].do &&
                    nekretnina.cijena >= rasponiCijena[j].od &&
                    nekretnina.cijena <= rasponiCijena[j].do
                ).length;

                histogram.push({
                    indeksPerioda: i,
                    indeksRasponaCijena: j,
                    brojNekretnina: brojNekretnina
                });
            }
        }

        return histogram;
    }

    return {
        init: init,
        prosjecnaKvadratura: prosjecnaKvadratura,
        outlier: outlier,
        mojeNekretnine: mojeNekretnine,
        histogramCijena: histogramCijena
    }
}