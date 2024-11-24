let glavniElement = document.getElementById("upiti");
let sviElementi = Array.from(glavniElement.getElementsByClassName("upit"));

let carousel = postaviCarousel(glavniElement, sviElementi);

let prev = document.getElementsByClassName("prev")[0];
let next = document.getElementsByClassName("next")[0];

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

//Vrati sve upite u glavni element kada se ne koristi carousel
window.addEventListener('resize', () => {
    if (window.innerWidth > 600) {
        glavniElement.innerHTML = "";
        sviElementi.forEach(element => {
            glavniElement.innerHTML += element.outerHTML;
        });
        glavniElement.innerHTML += prev.outerHTML;
        glavniElement.innerHTML += next.outerHTML;
    }
});
