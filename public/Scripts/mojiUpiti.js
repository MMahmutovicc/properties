async function postaviUpite() {
    var upiti = await PoziviAjax.getMojiUpiti((error, data) => {
        if(error) {
            if(error.status === 404) {
                document.getElementById("upiti").innerHTML = `<p class="error">Niste postavili nijedan upit.</p>`;
                return;
            }
            else if(error.status === 401) {
                window.location.href = "prijava.html";

                return;
            }
        }
        var upiti = '<div>';
        for(var i = 0; i < data.length; i++) {
            upiti += `  <div class="upit">
                        <strong>Nekretnina: ${data[i].id_nekretnine}</strong>
                        <p>${data[i].tekst_upita}</p>
                        </div>`;
        }
        upiti += '</div>';
        document.getElementById("upiti").innerHTML = upiti;
                
    });

    return upiti;
}

postaviUpite();