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
        cadena_ID = '';
        palabras_reservadas = ['SI', 'SINO', 'CICLO', 'INICIO', 'FUNCION', 'SALIDA'];
        simbolos_validos = [';', ':', '=', '+', '-', '*', '/', '(', ')', '{', '}', '[', ']', "'", '"', '<', '>',]
        for (i = 0; i < palabra.length; i++) {
            switch (estado) {
                case 0:
                    console.log(i + ' : ' + palabra[i] + ' E: ' + estado);
                    console.log(simbolos_validos.includes(palabra[i]));

                    if (simbolos_validos.includes(palabra[i])) {
                        if (palabra[i] == ';') { addToken('CIERRE', ';'); }
                        else if (palabra[i] == ':' && i + 1 == palabra.length) { lexemas[0].errores.push({ "error": palabra[i] }); }
                        else if (palabra[i] == ':') { estado = 2; }

                        else if (palabra[i] == '+') { estado = 4; }
                        if (palabra[i] == '+' && i + 1 == palabra.length) { addToken('SUMA', '+'); }

                        else if (palabra[i] == '-') { estado = 6; }
                        if (palabra[i] == '-' && i + 1 == palabra.length) { addToken('RESTA', '-'); }

                        else if (palabra[i] == '*') { estado = 8; }
                        if (palabra[i] == '*' && i + 1 == palabra.length) { addToken('PRODUCTO', '*'); }

                        else if (palabra[i] == '/') { estado = 10; }
                        if (palabra[i] == '/' && i + 1 == palabra.length) { addToken('DIVISION', '/'); }

                        else if (palabra[i] == '(') { addToken('PARENT_INICIO', '('); }
                        else if (palabra[i] == ')') { addToken('PARENT_CIERRE', ')'); }
                        else if (palabra[i] == '{') { addToken('LLAVE_INICIO', '{'); }
                        else if (palabra[i] == '}') { addToken('LLAVE_CIERRE', '}'); }
                        else if (palabra[i] == '[') { addToken('CORCHETE_INICIO', '['); }
                        else if (palabra[i] == ']') { addToken('CORCHETE_CIERRE', ']'); }
                        else if (palabra[i] == "'") { addToken('COMILLA_SIMPLE', "'"); }
                        else if (palabra[i] == '"') { addToken('COMILLA_DOBLE', '"'); }

                        else if (palabra[i] == '<') { estado = 20; }
                        if (palabra[i] == '<' && i + 1 == palabra.length) { addToken('OL_MENOR', '<'); }

                        else if (palabra[i] == '>') estado = 21;
                        if (palabra[i] == '>' && i + 1 == palabra.length) { addToken('OL_MAYOR', '>'); }

                        else if (palabra[i] == '=') { estado = 22; }
                        if (palabra[i] == '=' && i + 1 == palabra.length) { addToken('ASIGNACION', '='); }
                    }
                    else if (/[a-z,A-Z]/.test(palabra[i])) {
                        estado = 27; cadena_ID += palabra[i];
                        if (i + 1 == palabra.length) addToken('ID', palabra[i]);
                    }
                    else {
                        lexemas[0].errores.push({ "error": palabra[i] });
                    }


                    // if(palabra[i] !=[':',';','a-z']) lexemas[0].errores.pu sh({"error":palabra[i]});

                    // if(!(palabra[i].includes(simbolos_validos))) {lexemas[0].errores.push({'ERROR':'SIMBOLO_NO_VALIDO','SIMBOLO':palabra[i]});}
                    break;
                case 2:
                    if (palabra[i] == '=') { addToken('ASIGNACION', ':='); estado = 0; }
                    else { lexemas[0].errores.push({ "error": palabra[i - 1] }); estado = 0; i--; }
                    break
                case 4:
                    if (palabra[i] == '+') { addToken('INCREMENTO', '++'); estado = 0; }
                    else { addToken('SUMA', '+'); estado = 0; i--; }
                    break;
                case 6:
                    console.log(i + ' : ' + palabra[i] + ' E: ' + estado);
                    if (palabra[i] == '-') { addToken('DECREMENTO', '--'); estado = 0; }
                    else { addToken('RESTA', '-'); estado = 0; i--; }
                    break;
                case 8:
                    if (palabra[i] == '*') { addToken('POTENCIA', '**'); estado = 0; }
                    else { addToken('PRODUCTO', '*'); estado = 0; i--; }
                    break;
                case 10:
                    if (palabra[i] == '/') { addToken('COMENTARIO', '//'); estado = 0; }
                    else { addToken('DIVISION', '/'); estado = 0; i--; }
                    break;
                case 20:
                    if (palabra[i] == '>') { addToken('OL_DIFERENTE', '<>'); estado = 0; }
                    else if (palabra[i] == '=') { addToken('OL_MENORIGUAL', '<='); estado = 0; }
                    else { addToken('OL_MENOR', '<'); estado = 0; i--; }
                    break;
                case 21:
                    if (palabra[i] == '=') { addToken('OL_MAYORIGUAL', '>='); estado = 0; }
                    else { addToken('OL_MAYOR', '>'); estado = 0; i--; }
                    break;
                case 22:
                    if (palabra[i] == '=') { addToken('COMPARACION', '=='); estado = 0; }
                    else { addToken('ASIGNACION', '='); estado = 0; i--; }
                    break;
                case 27:
                    console.log(i + ' : ' + palabra[i] + ' E: ' + estado);
                    if (/[a-z,A-Z]/.test(palabra[i])) {
                        estado = 27; cadena_ID += palabra[i];
                        if (i + 1 == palabra.length) {
                            if (palabras_reservadas.includes(cadena_ID)) {
                                addToken('PALABRA_RESERVADA', cadena_ID);
                                cadena_ID = '';
                                estado = 0;
                            } else {
                                if (palabras_reservadas.includes(cadena_ID)) {
                                    addToken('PALABRA_RESERVADA', cadena_ID);
                                    cadena_ID = '';
                                    estado = 0;
                                } else {
                                    
                                    addToken('ID', cadena_ID);
                                    cadena_ID = '';
                                    estado = 0;
                                    i--;
                                }
                            }
                        }
                        break;
                    }
                    else if (/[0-9]/.test(palabra[i])) {
                        estado = 27; cadena_ID += palabra[i];
                        if (i + 1 == palabra.length) {
                            addToken('ID', cadena_ID);
                            cadena_ID = '';
                            estado = 0;
                        }
                        break;
                    }
                    else if (palabra[i] == '_') {
                        console.log('_____');
                        cadena_ID += palabra[i];
                        estado = 28;
                        break;
                    }
                    else {
                        console.log(cadena_ID); 
                        if (palabras_reservadas.includes(cadena_ID)) {
                            addToken('PALABRA_RESERVADA', cadena_ID);
                            cadena_ID = '';
                            estado = 0;
                            i--;
                        } else{
                            addToken('ID', cadena_ID);
                            cadena_ID = '';
                            estado = 0;
                            i--;
                        }                      
                        
                    }
                    break;
                case 28:
                    console.log('E 28');

                    if (/[a-z,A-Z]/.test(palabra[i])) {
                        estado = 27; cadena_ID += palabra[i];
                        if (i + 1 == palabra.length) {
                            addToken('ID', cadena_ID);
                            cadena_ID = '';
                            estado = 0;
                        }
                        break;
                    }
                    else if (/[0-9]/.test(palabra[i])) {
                        estado = 27; cadena_ID += palabra[i];
                        if (i + 1 == palabra.length) {
                            addToken('ID', cadena_ID);
                            cadena_ID = '';
                            estado = 0;
                        }
                        break;
                    } else {
                        addToken('ID', cadena_ID);
                        cadena_ID = '';
                        estado = 0;
                        i--;
                    }
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