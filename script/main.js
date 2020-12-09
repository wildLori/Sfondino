//LINK_ICONE:https://www.flaticon.com/search?word=mobile&style_id=1311
//Variabili Globali.

const API_KEY = "563492ad6f91700001000001d6a1a2f4768746edb5d2b3e0c6d2654b";
var indexImmagini;
var immaginiOttenute;
var prossima_pagina;

var scelte = {
    keyword: "wallpaper",
    colore: "#AA2B37",
    orientation: ""
};
var schermo = {
    Computer: "landscape",
    Cellulare: "portrait"
};

/* ------------------------------- Caricamento Pagina ------------------------------ */

$(function() {
    if (!location.hash) {
        setHash("#0");
        setTimeout(function() { setHash("1") }, 5000);
        generaColore();
        indexImmagini = 0;
        prossima_pagina = "";
    }

    //EVENTO : Cambio "#" nell'URL
    jQuery(window).on("hashchange", aggiornaStep);

});

/* --------------------------- Caricamento Pagina --------------------------- */

function setHash(numeroHash) {
    //Per dare un effetto di transizione:
    // 1: fadeOut
    // 2: -> dopo 300ms -> cambio Location.hash
    // 3: -> trigger sull'eveneto "hash change" -> vedi funzione aggiornaStep();
    $("#mioWrapper").fadeOut(300);
    setTimeout(function() { location.hash = numeroHash; }, 300);

}

function aggiornaStep() {
    // Single Page Application : mi muovo con location.hash 
    //Quando cambio pagina (step) faccio un fadeIn [vedi funzione setHash()]
    setTimeout(function() { $("#mioWrapper").fadeIn(300); }, 300);
    var elemento = document.getElementById('mioWrapper');
    var numeroStep = location.hash.substr(1);
    //Asincrona
    getStepHTML(numeroStep, function(contenutoReturnato) {
        if (numeroStep != 0) {
            elemento.innerHTML = contenutoReturnato;
            if (numeroStep == 1) {
                //STEP 1: Bottone Genera Colore -> Cambia sfondo e variabili CSS
                //STEP 1: Bottone Copia Colore -> Copia in ClipBoard il colore
                jQuery("#generaBottone").on("click", generaColore);
                jQuery("#colorCode").on("click", function() {
                    var colore = $(this).attr("data");
                    copyToClipboard($('.' + colore));

                });

            } else if (numeroStep == 2) {
                jQuery(".card").on('click', 'p', function(event) {
                    scelte.orientation = schermo[event.target.innerText];
                    setHash("#3");
                });
            } else if (numeroStep == 3) {
                getQuery(scelte.keyword, scelte.orientation, scelte.colore);
                jQuery("#bottoneQuery").on("click", function(event) {
                    event.preventDefault();
                    $("#ricercaQuery").toggle(300);

                });

                jQuery("#ricercaQuery").on('keyup', function(e) {
                    if (e.key === 'Enter' || e.keyCode === 13) {
                        var temp = jQuery("#ricercaQuery").val();

                        if (temp == "" || temp == undefined) {
                            alert("Non lasciare il campo vuoto.")
                        } else {
                            scelte.keyword = temp;
                            $("#immagineAttiva").fadeTo(500, 0.0);
                            setTimeout(function() {
                                getQuery(scelte.keyword, scelte.orientation, scelte.colore);
                            }, 900);
                        }

                    }
                });

                jQuery("#cambiaColore").on("click", function(event) {
                    event.preventDefault();
                    generaColore();
                    //let testo = jQuery("#txtInserimento").val();
                    $("#immagineAttiva").fadeTo(300, 0.0,
                        function() {
                            getQuery(scelte.keyword, scelte.orientation, scelte.colore);
                        });

                });

                jQuery(".bottoneSwitch").on('click', function() {
                    if ($(this).hasClass("next")) {
                        indexImmagini++;
                    } else {
                        if (!((indexImmagini - 1) < 0)) {
                            indexImmagini--;
                        }
                    }
                    //Fade dell'immagine che cambia
                    $("#immagineAttiva").fadeTo(300, 0.0);
                    setTimeout(function() {
                        mostraNuovaImmagine((indexImmagini));
                        $("#immagineAttiva").fadeTo(300, 1.0);
                    }, 299);
                });

                jQuery("#bottoneDownload").on('click', function() {
                    openInNewTab($("#immagineAttiva").prop('src'));
                })
            }
        } else {
            typeWriter(elemento);
        }
    })
}

function getStepHTML(step, callback) {
    //Scelgo il contenuto e lo comunico alla callback
    //Scelgo il contenuto:
    var html_ritorno;
    /*   
     * 1: Scegli Mood
     * 2: Scegli Dispositivo
     * 3: Mostra Riquadro Sfondi
     */
    switch (step) {
        case "1":
            html_ritorno = `<div class="container-center">
            <div class="row-center vert">
                <div class="col-4">
                    <div class="card">
                        <img class="icon" src="/assets/icon/color.svg" alt="">                        
                        <p id="colorCode" class="tooltip">Genera un colore 👇
                            <span class="tooltiptext">Copia il colore 🔗</span>
                        </p>                     
                    </div>
                    <button id="generaBottone">Genera!</button>
                </div>
                <a class="avanti" onclick="setHash('#2')">Avanti</a>
            </div>
        </div>`
            break;
        case "2":
            html_ritorno = `
        <div class="container-center">
            <div class="row-center vert">
                <div class="col-4">
                    <div class="card">
                        <img class="icon" src="/assets/icon/laptop.svg" alt="">
                        <p>Computer</p>
                    </div>
                </div>
                <p class="avanti"> Che dispositivo stai usando? </p>
                <div class="col-4">
                    <div class="card">
                        <img class="icon" src="/assets/icon/mobile.svg" alt="">
                        <p>Cellulare</p>
                    </div>
                </div>
            </div>
        </div>`
            break;
        case "3":
            html_ritorno = `<div id="mioWrapper">
            <div class="container-center">
                <div class="row-center vert">
                    <div class="row vert sfora-sotto">
                        <button id="changeImageIndietro" class="bottoneSwitch">⏪ Precedente</button>
                        <button id="changeImageAvanti" class="bottoneSwitch next">⏩ Successivo</button>
                    </div>
                    <div class="col-7">
                        <div class="card inv">
                            <img id="immagineAttiva" src="./assets/icon/rett.png" alt="">
                        </div>
                    </div>
                    <div class="row-center vert sfora-sopra">
                        <div class="col-8">
                            <div id="schedaImmagine" class="card stretto">
                                <a id="autore">📸 Autore : @</a>
                            </div>
                            <div class="row vert strumenti">
                                <div id="bottoneDownload" class="dot tooltip">
                                    <div id="iconaDownload" class="icon-piccola">
                                        <img class="icon-piccola" src="./assets/icon/pictures.svg" alt="">
                                    </div>
                                    <span class="tooltiptext">Scarica Immagine 🖼️</span>
                                </div>
    
                                <div id="cambiaColore" class="dot tooltip">
                                    <div id="iconaColore" class="icon-piccola">
                                        <img class="icon-piccola" src="./assets/icon/color.svg" alt="">
                                    </div>
                                    <span class="tooltiptext">Cambia Colore 🎨</span>
                                </div>
    
                                <div id="bottoneQuery" class="dot tooltip">
                                    <div id="iconaQuery" class="icon-piccola">
                                        <img class="icon-piccola" src="./assets/icon/search.svg" alt="">
                                    </div>
                                    <span class="tooltiptext">Cerca nuovamente 🔎</span>
                                </div>
                                <input id=\"ricercaQuery\"></input>
                            </div>
                        </div>
                    </div>
    
                </div>
            </div>
        </div>
        
    
        </div>
        <div id="mioWrapperGalleria"></div>
        `
            break;

        default:
            html_ritorno = "";
    }
    callback(html_ritorno);
}
//AJAX
function getQuery(keyword, verso, colore, next) {
    var testo = keyword;
    var mUrl;
    var mColore = colore.substr(1);
    if (next) {
        mUrl = prossima_pagina;
        $.ajax({
            //Parametro 1: Tipo Richiesta
            method: 'GET',
            //Parametro 2: Inserisco nell'Header la CHIAVE DELL'API
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", API_KEY);
            },
            //Parametro 3: URL
            //url: "https://api.pexels.com/v1/search?query=" + testo + "&orientation=" + verso + "&color=" + colore + "&per_page=15",
            url: mUrl,
            //Parametro 4 e 5: Callback Successo e Errore
            success: function(risposta) {
                mostrarispostaJSON(risposta);
                $("#immagineAttiva").fadeTo(400, 1.0);


            },
            error: function(errore) {
                console.log(errore);
            }

        });
    } else {
        mUrl = "https://api.pexels.com/v1/search?query=" + testo + "&color=" + mColore + "&orientation=" + verso + "&per_page=15";
        //Creo richiesta GET asincrona [ AJAX ]
        $.ajax({
            //Parametro 1: Tipo Richiesta
            method: 'GET',
            //Parametro 2: Inserisco nell'Header la CHIAVE DELL'API
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", API_KEY);
            },
            //Parametro 3: URL
            //url: "https://api.pexels.com/v1/search?query=" + testo + "&orientation=" + verso + "&color=" + colore + "&per_page=15",
            url: mUrl,
            //Parametro 4 e 5: Callback Successo e Errore
            success: function(risposta) {
                mostrarispostaJSON(risposta);
                $("#immagineAttiva").fadeTo(400, 1.0);
            },
            error: function(errore) {
                console.log(errore);
            }

        });
    }

}

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function mostraNuovaImmagine(index) {
    try {
        mImage = immaginiOttenute.photos[index].src.large;
        mAutore = immaginiOttenute.photos[index].photographer;
        mAutoreURL = immaginiOttenute.photos[index].photographer_url;
        $('#immagineAttiva').attr("src", mImage);
        $('#autore').text("📸 Autore : @" + mAutore);
        $('#autore').on("click", function() {
            window.open(mAutoreURL, '_blank');
        });

    } catch (error) {
        indexImmagini = 0;
        getQuery(scelte.keyword, scelte.orientation, scelte.colore, true);
    }

}

function mostrarispostaJSON(risposta) {

    //Chiamata anteprima della prima risposta JSON
    immaginiOttenute = risposta; //Aggiorno il JSON globale per renderlo visibile alle altre funzioni
    var mRispostaJS = risposta;
    mostraGalleria(risposta); //Costruisco Galleria
    prossima_pagina = mRispostaJS.next_page; //Estraggo URL prossima pagina di risultati
    mImage = mRispostaJS.photos[0].src.large; //URL Immagine large
    mAutore = mRispostaJS.photos[0].photographer; //Nome Fotografo
    mAutoreURL = mRispostaJS.photos[0].photographer_url; //URL Profilo Fotografo
    $('#immagineAttiva').attr("src", mImage);
    $('#autore').text("📸 Autore : @" + mAutore);
    $('#autore').on("click", function() {
        window.open(mAutoreURL, '_blank')
    })
}

function mostraGalleria(immagini) {

    $('html,body').animate({
        scrollTop: $('#mioWrapperGalleria').offset().top
    }, 'slow');

    var galleria = document.getElementById('mioWrapperGalleria');
    galleria.focus();
    galleria.innerHTML = "";
    //var quanti = Object.keys(immaginiOttenute.photos).length;
    var quanti = 15;
    for (let index = 0; index < quanti; index++) {
        const immagineGalleria = document.createElement("div");
        immagineGalleria.classList.add("immagineGalleria");
        var mFotografo = immagini.photos[index].photographer;
        var mUrl = immagini.photos[index].src.medium;
        immagineGalleria.innerHTML = `
            <img
                src="${mUrl}"
                alt=""
            />
            <div class="img-info card stretto">
                <p>${"@" + mFotografo}</p>
            </div>
        `;
        galleria.appendChild(immagineGalleria);
    };

}

function cambiaColore(nuovo_colore) {
    //Check con calcolo colore
    if (location.hash == "#1") {
        $("#colorCode").html(nuovo_colore + "<span class=\"tooltiptext\">Copia il colore 🔗</span>");
    }

    calcolaContrasto(nuovo_colore);
    $(':root').css('--themeColor', nuovo_colore); //Aggiorno Variabili CSS
    scelte.colore = nuovo_colore; //Aggiorno il JSON
}

function calcolaContrasto(coloreInHex) {

    //Tolgo l'Hashtag (#) dal colore Hex
    var numeroHex = coloreInHex.substr(1);
    //RegEx : Mi restituisce un array che divide la stringa nella singole componenti R,G,B.
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(numeroHex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    // Formula per calcolare luminosità del colore
    var luminosita = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Se è molto luminoso (>0.8) utilizzo un font nero, altrimenti un font bianco.
    if (luminosita > 0.8)
        $(':root').css('--fontColor', "#000000");
    else
        $(':root').css('--fontColor', "#FFFFFF");
}

function generaColore() {
    cambiaColore("#" + ((1 << 24) * Math.random() | 0).toString(16));
}

function typeWriter(elemento) {
    elemento.innerHTML = `<div class="container-center">
    <div class="row-center vert">
        <div class="col-5">
            <div class="card">
                <p class="typewriter">Benvenuto in Sfondino! 📌</p>
            </div>
    </div>
</div>`

}

function copyToClipboard(element) {
    //Per sfrutta il document.execCommand -> creo temporaneamente un <input> con display:none
    var $temp = $("<input>").css("display", "none");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

function downloadDataUrlFromJavascript(dataUrl) {

    var element = document.createElement('a');
    element.setAttribute('href', encodeURIComponent(dataUrl));
    element.setAttribute('download', "Sfondino.jpeg");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

function openInNewTab(url) {
    //Splitto la stringa al "?" in modo da aprire la foto originale
    var sub = url.split("?");
    var mUrl = sub[0];
    var win = window.open(mUrl, '_blank');
    win.focus();
}


/*TODO:
 * 
 *
 *
 */