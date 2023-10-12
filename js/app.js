const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objetoBusqueda = {
    moneda: "",
    criptomoneda: "",
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

document.addEventListener("DOMContentLoaded", () => {
    consultarCriptomonedas();
    formulario.addEventListener("submit", submitFormulario);

    criptomonedasSelect.addEventListener("change", leerValor)
    monedaSelect.addEventListener("change", leerValor)
})


function consultarCriptomonedas(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=30&tsym=USD`;
    
 fetch(url)
    .then( respuesta => respuesta.json())
    .then( resultado => obtenerCriptomonedas(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
    for(let i = 0; i < criptomonedas.length; i++){
        const { FullName, Name} = criptomonedas[i].CoinInfo;
        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    }
}

function leerValor(e) {
    objetoBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();
    const {moneda, criptomoneda} = objetoBusqueda;

    if(moneda === "" || criptomoneda === "") {
        mostrarAlerta("Ambos campos son obligatorios");
        return;
    }
    consultarAPI();
}

function mostrarAlerta(msg){

    const existeError = document.querySelector(".error");

    if(!existeError) {

        const divMensaje = document.createElement("div");
        divMensaje.classList.add("error");
    
        divMensaje.textContent = msg;
    
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function consultarAPI() {
    const {moneda, criptomoneda} = objetoBusqueda
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    })
}

function mostrarCotizacionHTML(cotizacion) {

    limpiarHTML();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.innerHTML = `El precio actual es: <span>${PRICE}</span>`;

 
    const precioMax = document.createElement("p");
    precioMax.innerHTML = `El precio máximo del día es: <span>${HIGHDAY}</span>`;

    const precioMin = document.createElement("p");
    precioMin.innerHTML = `El precio mínimo del día es: <span>${LOWDAY}</span>`;

    const porcentajeHoy = document.createElement("p");
    porcentajeHoy.innerHTML = `El porcentaje que cambió hoy es de: <span>${CHANGEPCT24HOUR} %</span>`;

    const ultimoUpdate = document.createElement("p");
    ultimoUpdate.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;
    

 
    resultado.appendChild(precio);
    resultado.appendChild(precioMax);
    resultado.appendChild(precioMin);
    resultado.appendChild(porcentajeHoy);
    resultado.appendChild(ultimoUpdate);
    
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement("div");
    spinner.classList.add("sk-folding-cube");
    spinner.innerHTML = `
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
    `;

    resultado.appendChild(spinner);
}