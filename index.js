// Declaracion de constantes.

const CIRCUITOS = [
    [
        [  1,  2,  3,  4,  5,  6 ],
        [ 20, 21, 22, 23, 24,  7 ],
        [ 19, 32, 33, 34, 25,  8 ],
        [ 18, 31, 36, 35, 26,  9 ],
        [ 17, 30, 29, 28, 27, 10 ],
        [ 16, 15, 14, 13, 12, 11 ],
    ],
    [
        [  1,  2,  3,  4,  5,  6 ],
        [ 12, 11, 10,  9,  8,  7 ],
        [ 13, 14, 15, 16, 17, 18 ],
        [ 24, 23, 22, 21, 20, 19 ],
        [ 25, 26, 27, 28, 29, 30 ],
    ]
];

const TURNO_AZUL = 'TURNO_AZUL';
const TURNO_ROJO = 'TURNO_ROJO';

const CIRCUITO = CIRCUITOS[parseInt((Math.random()*(CIRCUITOS.length - 1)).toFixed())];
const CASILLA_OBJETIVO = CIRCUITO.length*CIRCUITO[0].length;
const TABLERO_VERDE = [0.4, 0.8, 0.5, '#00bfff', '#ff3333', '#e600ac', 'orange'];
const SUAVIZAR_COLOR = 3;
const TIMEOUT_VALOR = 2000;


// Declaracion de variables.

let turnoActual = TURNO_AZUL;
let posicionAzul = 1;
let posicionRojo = 1;
let bgColor = TABLERO_VERDE;


// Genera y prepara la escena.
$(document).ready(() => {
    generarInformacion();
    generarTabla();
    renderizarPieza(posicionAzul, bgColor[5]);
    prepararTurno();
});


// Genera un numero aleatorio y cambia el estado de la partida al clicar el boton
// siempre y cuando la partida no haya terminado.
$('#generarNumero').click(() => {
    const numero = ((Math.random() * 5) + 1).toFixed();
    $('#numero').text(numero);
    $('#numero')[0].className = turnoActual == TURNO_AZUL ? 
        'text-primary' : 
        'text-danger';

    moverPieza(parseInt(numero));
    comprobarVictoria(() => {
        cambiarTurno();
        prepararTurno();
    });
});


// Genera informacion adicional de ayuda.
function generarInformacion() {
    var textos = [
        'Pieza azul',
        'Pieza roja',
        'Piezas combinadas',
        'Meta',
    ];

    for (let i = 0; i < textos.length; i++) {
        $('#ayuda').append(`
            <div 
                class="d-inline-flex align-items-center ms-2">
                <div 
                    style="background-color: ${bgColor[i + 3]}; width: 15px; height: 15px"></div>
                    <div class="ms-1">${textos[i]}</div>
            </div>`
        );
    }
}


// Se genera la tabla con el recorrido que seguiran las piezas.
// Tambien aplica efectos visuales para poder encontrar facilmente
// las casillas de inicio y meta.
function generarTabla() {
    var table = '';

    for (let i = 0; i < CIRCUITO.length; i++) {
        table += '<tr>';

        for (let j = 0; j < CIRCUITO[i].length; j++) {
            const valor = CIRCUITO[i][j];
            table += `
                <td 
                    id="${valor}" 
                    class="p-5 text-center text-white border"
                    style="background-color: ${calcularColor(valor)}">
                    ${valor}
                </td>`
        }

        table += '</tr>';
    }

    $('#tabla').html(table);
    $('#1').text('');
    $(`#${CASILLA_OBJETIVO}`).text('');
    $(`#${CASILLA_OBJETIVO}`).css('background-color', `${bgColor[6]}`);
}


// Calcula el color segun un parametro (posicion de la casilla segun el circuito)
function calcularColor(casilla) {
    const aux = 255 - (casilla*255/CASILLA_OBJETIVO/SUAVIZAR_COLOR);
    return `rgb(${aux*bgColor[0]}, ${aux*bgColor[1]}, ${aux*bgColor[2]})`
}


// Modifica la posicion de una pieza segun el turno.
function moverPieza(numero) {
    switch (turnoActual) {
        case TURNO_AZUL:
            posicionAzul = actualizarPosicion(
                numero, 
                posicionAzul, 
                posicionRojo, 
                bgColor[3], 
                bgColor[4], 
                bgColor[5]);
            break;

        case TURNO_ROJO:
            posicionRojo = actualizarPosicion(
                numero, 
                posicionRojo,
                posicionAzul, 
                bgColor[4], 
                bgColor[3], 
                bgColor[5]);
            break;
    }
}


// Mueve y renderiza una pieza limpiando la casilla antes de moverse, calculando
// que color deberia aplicarse segun el degradado de la table o si la otra pieza
// se encontraba en la misma casilla.
// Una vez se ha movido, se renderiza la nueva casilla en base a si las dos piezas
// se encuentran en la misma casilla o no.
function actualizarPosicion(
    numero, 
    posicionPropia, 
    posicionEnemiga, 
    colorPropio, 
    colorEnemigo,
    colorCombinado
    ) {
    renderizarPieza(
        posicionPropia, 
        posicionPropia == posicionEnemiga ? 
            colorEnemigo : 
            calcularColor(posicionPropia)
    );
    posicionPropia = calcularNuevaPosicion(posicionPropia + numero);
    renderizarPieza(
        posicionPropia, 
        posicionPropia == posicionEnemiga ? 
            colorCombinado :
            colorPropio 
    );

    return posicionPropia;
}


// Renderiza una pieza segun posicion y color.
function renderizarPieza(posicion, color) {
    $(`#${posicion}`).css('background-color', `${color}`);
}


// "Arregla el numero" que ha salido en caso de que "te pases de largo".
function calcularNuevaPosicion(numero) {
    return numero > CASILLA_OBJETIVO ?
        CASILLA_OBJETIVO - (numero - CASILLA_OBJETIVO) :
        numero;
}


// Alterna el valor de la variable que almacena el turno actual.
function cambiarTurno() {
    turnoActual = turnoActual == TURNO_AZUL ? 
        TURNO_ROJO : 
        TURNO_AZUL
}


// Prepara el escenario para que visualmente se vea a quien le toca.
function prepararTurno() {
    var texto = '';
    var clase = '';

    switch (turnoActual) {
        case TURNO_AZUL:
            texto = 'Azul';
            clase = 'text-primary'; 
            break;

        case TURNO_ROJO:
            texto = 'Rojo';
            clase = 'text-danger'; 
            break;
    }

    $('#turno').text(texto);
    $('#turno')[0].className = clase; 
}


// Comprueba para cada jugador si ha llegado a la casilla objetivo
// de no ser asi, ejecuta el callback (funciones para seguir jugando).
// En caso de que la partida haya terminado, muestra el ganador.
function comprobarVictoria(callback) {
    if (posicionAzul == CASILLA_OBJETIVO) {
        mostrarVictoria("AZUL");
    }
    else if (posicionRojo == CASILLA_OBJETIVO) {
        mostrarVictoria("ROJO");
    }
    else callback();
}


// Cambia el estado de la pagina cuando un jugador gana (mensaje de victoria)
function mostrarVictoria(jugador) {
    $('#generarNumero').addClass('disabled');

    setTimeout(() => {
        $('#juego').html('');
        $('#cartelVictoria')[0].className = 'text-center p-5';
        $('#cartelVictoria').html(`
            <div class="text-center">
                <h2>El jugador 
                    <span
                        class=${turnoActual == TURNO_AZUL ? 
                            "text-primary" : 
                            "text-danger"}>
                        ${jugador}
                    </span> 
                    gana!
                </h2>
                <button 
                    id="reloadButton" 
                    class="btn btn-lg btn-primary mt-4"}>
                    Empezar nueva partida
                </button>
            </div>`
        );
        $('#reloadButton').click(() => location.reload());
    }, TIMEOUT_VALOR);
}
