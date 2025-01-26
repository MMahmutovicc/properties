const PoziviAjax = (() => {

    // fnCallback se u svim metodama poziva kada stigne
    // odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru
    // callback-a, a data je tada null

    function ajaxRequest(method, url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(null, xhr.responseText);
                } else {
                    callback({ status: xhr.status, statusText: xhr.statusText }, null);
                }
            }
        };
        xhr.send(data ? JSON.stringify(data) : null);
    }

    // vraća korisnika koji je trenutno prijavljen na sistem
    function impl_getKorisnik(fnCallback) {
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    console.log('Uspješan zahtjev, status 200');
                    fnCallback(null, JSON.parse(ajax.responseText));
                } else if (ajax.status == 401) {
                    console.log('Neuspješan zahtjev, status 401');
                    fnCallback("error", null);
                } else {
                    console.log('Nepoznat status:', ajax.status);
                }
            }
        };

        ajax.open("GET", "http://localhost:3000/korisnik/", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    // ažurira podatke loginovanog korisnika
    function impl_putKorisnik(noviPodaci, fnCallback) {

        ajaxRequest('PUT', '/korisnik', {noviPodaci}, (error, data) => {
            // Ako se dogodi greška pri dohvaćanju podataka, proslijedi grešku kroz callback
            if (error) {
                fnCallback(error, null);
            } else {
                // Ako su podaci uspješno dohvaćeni, parsiraj JSON i proslijedi ih kroz callback
                try {
                    const odgovor = JSON.parse(data);
                    fnCallback(null, odgovor);
                } catch (parseError) {
                    // Ako se dogodi greška pri parsiranju JSON-a, proslijedi grešku kroz callback
                    fnCallback(parseError, null);
                }
            }
        });
    }

    // dodaje novi upit za trenutno loginovanog korisnika
    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {

        ajaxRequest('POST', '/upit', {nekretnina_id, tekst_upita}, (error, data) => {
            // Ako se dogodi greška pri dohvaćanju podataka, proslijedi grešku kroz callback
            if (error) {
                fnCallback(error, null);
            } else {
                // Ako su podaci uspješno dohvaćeni, parsiraj JSON i proslijedi ih kroz callback
                try {
                    const odgovor = JSON.parse(data);
                    fnCallback(null, odgovor);
                } catch (parseError) {
                    // Ako se dogodi greška pri parsiranju JSON-a, proslijedi grešku kroz callback
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_getNekretnine(fnCallback) {
        // Koristimo AJAX poziv da bismo dohvatili podatke s servera
        ajaxRequest('GET', '/nekretnine', null, (error, data) => {
            // Ako se dogodi greška pri dohvaćanju podataka, proslijedi grešku kroz callback
            if (error) {
                fnCallback(error, null);
            } else {
                // Ako su podaci uspješno dohvaćeni, parsiraj JSON i proslijedi ih kroz callback
                try {
                    const nekretnine = JSON.parse(data);
                    fnCallback(null, nekretnine);
                } catch (parseError) {
                    // Ako se dogodi greška pri parsiranju JSON-a, proslijedi grešku kroz callback
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_postLogin(username, password, fnCallback) {
        console.log('Poziv funkcije impl_postLogin');
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback(ajax.statusText, null)
            }
        }
        ajax.open("POST", "http://localhost:3000/login", true)
        ajax.setRequestHeader("Content-Type", "application/json")
        var objekat = {
            "username": username,
            "password": password
        }
        forSend = JSON.stringify(objekat)
        ajax.send(forSend)
    }

    function impl_postLogout(fnCallback) {
        let ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback(ajax.statusText, null)
            }
        }
        ajax.open("POST", "http://localhost:3000/logout", true)
        ajax.send()
    }

    function impl_getTop5Nekretnina(lokacija, fnCallback) {
        ajaxRequest('GET', `/nekretnine/top5?lokacija=${lokacija}`, null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const nekretnine = JSON.parse(data);
                    fnCallback(null, nekretnine);
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_getMojiUpiti(fnCallback) {
        ajaxRequest('GET', '/upiti/moji', null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const upiti = JSON.parse(data);
                    fnCallback(null, upiti);
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_getNekretnina(nekretnina_id, fnCallback) {
        ajaxRequest('GET', `/nekretnina/${nekretnina_id}`, null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const nekretnina = JSON.parse(data);
                    fnCallback(null, nekretnina);
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_getNextUpiti(nekretnina_id, page, fnCallback) {
        ajaxRequest('GET', `/next/upiti/nekretnina/${nekretnina_id}?page=${page}`, null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const upiti = JSON.parse(data);
                    fnCallback(null, upiti);
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_getInteresovanja(nekretnina_id, fnCallback) {
        let ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, JSON.parse(ajax.responseText))
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback(ajax.statusText, null)
            }
        }
        ajax.open("GET", `http://localhost:3000/nekretnina/${nekretnina_id}/interesovanja`, true)
        ajax.send()
    }

    function impl_postNekretninaPonuda(nekretnina_id, tekst, ponudaCijene, datumPonude, idVezanePonude, odbijenaPonuda){
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                console.log("Response", ajax.responseText);
                fnCallback(ajax.responseText, null)
            }
        }
        ajax.open("POST", `http://localhost:3000/nekretnina/${nekretnina_id}/ponuda`, true)
        ajax.setRequestHeader("Content-Type", "application/json")

        let ponuda = {
            "tekst": tekst,
            "ponudaCijene": ponudaCijene,
            "datumPonude": datumPonude,
            "idVezanePonude": idVezanePonude,
            "odbijenaPonuda": odbijenaPonuda
        }

        forSend = JSON.stringify(ponuda)
        ajax.send(forSend)

        fnCallback(null, { poruka: 'Ponuda je uspjesno dodana' });
    }

    function impl_postNekretninaZahtjev(nekretnina_id, tekst, trazeniDatum, fnCallback){
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                console.log("Response", ajax.responseText);
                fnCallback(ajax.responseText, null)
            }
        }
        ajax.open("POST", `http://localhost:3000/nekretnina/${nekretnina_id}/zahtjev`, true)
        ajax.setRequestHeader("Content-Type", "application/json")
        let upit = {
            "tekst": tekst,
            "trazeniDatum": trazeniDatum
        }
        forSend = JSON.stringify(upit)
        ajax.send(forSend)

        fnCallback(null, { poruka: 'Zahtjev je uspješno dodan' });
    }

    function impl_putNekretninaZahtjev(nekretnina_id, zahtjev_id, odobren, addToTekst, fnCallback){
        let ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, JSON.parse(ajax.responseText))
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback(ajax.statusText, null)
            }
        }
        ajax.open("PUT", `http://localhost:3000/nekretnina/${nekretnina_id}/zahtjev/${zahtjev_id}`, true)
        ajax.setRequestHeader("Content-Type", "application/json")
        
        
        let izmjena = {
            odobren: odobren,
            addToTekst: addToTekst,
        }
        ajax.send(JSON.stringify(izmjena));

        fnCallback(null, { poruka: 'Zahtjev je uspješno ažuriran' });
    }

    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getTop5Nekretnina: impl_getTop5Nekretnina,
        getMojiUpiti: impl_getMojiUpiti,
        getNekretnina: impl_getNekretnina,
        getNextUpiti: impl_getNextUpiti,
        getInteresovanja: impl_getInteresovanja,
        postNekretninaPonuda: impl_postNekretninaPonuda,
        postNekretninaZahtjev: impl_postNekretninaZahtjev,
        putNekretninaZahtjev: impl_putNekretninaZahtjev
    };
})();