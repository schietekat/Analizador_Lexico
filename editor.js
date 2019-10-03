function checkIfValid() {
    if (myText.value == '') {
        alert('no puedes dejar vacio el campo!');
    } else {
        responses.value = '';
        palabras = myText.value.split(' ');
        console.log(palabras);
        palabras.forEach(palabra => {
            console.log('palabra ' + palabra)
            palabraOriginal = palabra;
            palabra = palabra.split('');
            validarPalabra(palabra, palabraOriginal);
        });
    }
}

function validarPalabra(palabra) {

    if (selectAutomata.value == "1") {
        lexemas = [{ "errores": [] }];
        estado = 0;
        for (i = 0; i < palabra.length; i++) {
            switch (estado) {
                case 0:
                    console.log(i)
                    if (palabra[i] == ';') addToken('CIERRE', ';');
                    if (palabra[i] == ':') estado = 2;
                    if (palabra[i] == '+') estado = 4;
                    if (palabra[i] == '+' && palabra[i + 1] != '+') addToken('ADICION', '+');
                    if (palabra[i] == '-') estado = 6;
                    if (palabra[i] == '-' && palabra[i + 1] != '-') addToken('RESTA', '-');
                    if (palabra[i] == '*') estado = 8;
                    if (palabra[i] == '*' && palabra[i + 1] != '*') addToken('PRODUCTO', '*');
                    if (palabra[i] == '/') estado = 10;
                    if (palabra[i] == '/' && palabra[i + 1] != '/') addToken('DIVISION', '/');
                    if (palabra[i] == '(') addToken('PARENT_INICIO', '(');
                    if (palabra[i] == ')') addToken('PARENT_CIERRE', ')');
                    if (palabra[i] == '{') addToken('LLAVE_INICIO', '{');
                    if (palabra[i] == '}') addToken('LLAVE_CIERRE', '}');
                    if (palabra[i] == '[') addToken('CORCHETE_INICIO', '[');
                    if (palabra[i] == ']') addToken('CORCHETE_CIERRE', ']');
                    if (palabra[i] == "'") addToken('COMILLA_SIMPLE', "'");
                    if (palabra[i] == '"') addToken('COMILLA_DOBLE', '"');
                    if (palabra[i] == '<') estado = 20;
                    if (palabra[i] == '>') estado = 21;
                    if (palabra[i] == '=') estado = 22;
                    // if(palabra[i] !=[':',';','a-z']) lexemas[0].errores.push({"error":palabra[i]});
                    break;
                case 2:
                    if (palabra[i] == '=') { addToken('ASIGNACION', ':='); estado = 0; }
                    else { estado = 0; i--; }
                    break
                case 4:
                    if (palabra[i] == '+') { addToken('INCREMENTO', '++'); estado = 0; }
                    else { estado = 0; i--; }
                    break;
                case 6:
                    if (palabra[i] == '-') { addToken('DECREMENTO', '--'); estado = 0; }
                    else { estado = 0; i--; }
                    break;
                case 8:
                    if (palabra[i] == '*') { addToken('POTENCIA', '**'); estado = 0; }
                    else { estado = 0; i--; }
                    break;
                case 10:
                    if (palabra[i] == '/') { addToken('COMENTARIO', '//'); estado = 0; }
                    else { estado = 0; i--; }
                    break;
            }
        }
    }

    if (selectAutomata.value == "1") {
        lexemas.forEach(x => {
            responses.value += JSON.stringify(x) + '\n';
        });
        console.log(lexemas);
    }

}

function addToken(TOKEN, LEXEMA) {
    lexemas.push({
        "Token": TOKEN,
        "Lexema": LEXEMA
    });
}

function clearInputs() {
    responses.value = '';
    myText.value = '';
}