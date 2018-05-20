Dada la falta de perifericos en algunos cursos, en otros casos la escasez de recursos para acceder a los mismos, y los problemas que generan conectar perifericos, en estos dias estuve desarrollando la "Poncho APP".

Es una aplicacion Android que emula hardware real. Lo interesante de la APP es que es una aplicacion boba (no hay nada de logica en ella). 

El manejo del hardware emulado se hace desde el microcontrolador mediante una biblioteca de solo un archivo .c y otro .h que envia/recibe datos mediante el HC05, es decir, se pueden leer las teclas, prender leds, leer potenciometros, escribir displays lcd y 7 segmentos, dac, y voy a seguir sumando perifericos. 

Aca va unas caputas de pantalla de mi celu. Explico lo que esta haciendo
- El valor de CH1 se lee desde el uC y se manda ese valor al DAC.
- El valor del 7 segmentos es proporcional (de 0 a 9) al valor del pote CH1.
- Si se presiona 1 de las teclas, se lee desde el uC y se togglea el led asociado.
- En el LCD se muestra un contador y cuando llega a 10 se muestra un mensaje de reset



