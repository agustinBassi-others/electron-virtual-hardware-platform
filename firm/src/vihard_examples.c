/* Copyright 2018, Agustin Bassi.
 * All rights reserved.
 *
 * This file is part of ViHard library, a library of virtual hardware
 * for Embedded Systems.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 */

/* Date: 2018-10-02 */

/*==================[inclusions]=============================================*/

#include "sapi.h"
#include "vihard.h"

/*==================[macros and definitions]=================================*/

/*==================[internal data declaration]==============================*/

/*==================[internal functions declaration]=========================*/

// Ejemplos con GPIOs virtuales
static void RunExample_VhGpioWrite      ();
static void RunExample_VhGpioRead       ();
static void RunExample_VhGpioToggle     ();
// Ejemplos con entradas y salidas analogicas virtuales
static void RunExample_VhAdcRead        ();
static void RunExample_VhDacWrite       ();
// Ejemplo de escritura del display 7 segmentos virtual
static void RunExample_Vh7SegmentsWrite ();
// Ejemplo de escritura del display LCD virtual
static void RunExample_VhLcdWriteString ();

/*==================[internal data definition]===============================*/

/*==================[external data definition]===============================*/

/*==================[internal functions definition]==========================*/

/**
 * Enciende o apaga los LEDs virtuales de manera secuencial.
 */
static void RunExample_VhGpioWrite (){
static uint8_t index = 0;

    if (++index >= 8){
        index = 0;
    }

    if (index == 0){
        Vh_GpioWrite(VH_LED1, TRUE);
    } else if (index == 1){
        Vh_GpioWrite(VH_LED2, TRUE);
    } else if (index == 2){
        Vh_GpioWrite(VH_LED3, TRUE);
    } else if (index == 3){
        Vh_GpioWrite(VH_LED4, TRUE);
    } else if (index == 4){
        Vh_GpioWrite(VH_LED1, FALSE);
    } else if (index == 5){
        Vh_GpioWrite(VH_LED2, FALSE);
    } else if (index == 6){
        Vh_GpioWrite(VH_LED3, FALSE);
    } else if (index == 7){
        Vh_GpioWrite(VH_LED4, FALSE);
    } else {
        index = 0;
    }

    delay(200);

}

/**
 * Enciende los LEDs VH_LED1, VH_LED2 o VH_LED3 si se
 * presiona VH_TEC1, VH_TEC2 o VH_TEC3.
 */
static void RunExample_VhGpioRead (){

    if (!Vh_GpioRead(VH_TEC1)){
        Vh_GpioWrite(VH_LED1, TRUE);
    } else {
        Vh_GpioWrite(VH_LED1, FALSE);
    }
    if (!Vh_GpioRead(VH_TEC2)){
        Vh_GpioWrite(VH_LED2, TRUE);
    } else {
        Vh_GpioWrite(VH_LED2, FALSE);
    }
    if (!Vh_GpioRead(VH_TEC3)){
        Vh_GpioWrite(VH_LED3, TRUE);
    } else {
        Vh_GpioWrite(VH_LED3, FALSE);
    }

}

/**
 * Toggle (intercambia) el valor de los 4 LEDs virtuales.
 */
static void RunExample_VhGpioToggle (){
    Vh_GpioToggle(VH_LED1);
    Vh_GpioToggle(VH_LED2);
    Vh_GpioToggle(VH_LED3);
    Vh_GpioToggle(VH_LED4);
    delay(500);
}

/**
 * Enciende o apaga los LEDs virtuales de manera proporcional
 * al valor leido en el potenciometro VH_ADC_CH1.
 */
static void RunExample_VhAdcRead (){
    uint16_t adcValue = Vh_AdcRead(VH_ADC_CH1);

    if (adcValue == 0){
        Vh_GpioWrite(VH_LED1, FALSE);
        Vh_GpioWrite(VH_LED2, FALSE);
        Vh_GpioWrite(VH_LED3, FALSE);
        Vh_GpioWrite(VH_LED4, FALSE);
    } else if (adcValue >= 0 && adcValue <= 250){
        Vh_GpioWrite(VH_LED1, TRUE);
        Vh_GpioWrite(VH_LED2, FALSE);
        Vh_GpioWrite(VH_LED3, FALSE);
        Vh_GpioWrite(VH_LED4, FALSE);
    } else if (adcValue > 250 && adcValue <= 500){
        Vh_GpioWrite(VH_LED1, TRUE);
        Vh_GpioWrite(VH_LED2, TRUE);
        Vh_GpioWrite(VH_LED3, FALSE);
        Vh_GpioWrite(VH_LED4, FALSE);
    } else if (adcValue > 500 && adcValue <= 750){
        Vh_GpioWrite(VH_LED1, TRUE);
        Vh_GpioWrite(VH_LED2, TRUE);
        Vh_GpioWrite(VH_LED3, TRUE);
        Vh_GpioWrite(VH_LED4, FALSE);
    } else if (adcValue > 750){
        Vh_GpioWrite(VH_LED1, TRUE);
        Vh_GpioWrite(VH_LED2, TRUE);
        Vh_GpioWrite(VH_LED3, TRUE);
        Vh_GpioWrite(VH_LED4, TRUE);
    }

}

/**
 * Escribe valores de 0 a 1000 en el VH_DAC_CH1
 * incrementando de a 100.
 */
static void RunExample_VhDacWrite (){
    static uint16_t dacValue = 0;

    dacValue += 100;
    if (dacValue > 1000){
        dacValue = 0;
    }

    Vh_DacWrite(VH_DAC_CH1, dacValue);

    delay(200);
}

/**
 * Muestra los numeros del 0 al 9 en el display 7 segmentos.
 */
static void RunExample_Vh7SegmentsWrite (){
    static uint8_t value = '0';

    if (++value > '9'){
        value = '0';
    }

    Vh_7SegmentsWrite(VH_7SEG, value);

    delay (500);
}

/**
 * Muestra en el display LCD distintos mensajes.
 */
static void RunExample_VhLcdWriteString    (){
    static LcdLine_t lcdLine = LCD_LINE_THIRD;

    if (++lcdLine > LCD_LINE_THIRD){
        lcdLine = LCD_LINE_ALL;
    }

    if (lcdLine == LCD_LINE_ALL){
        Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, "Mensaje multilinea desde ViHard");
    } else if (lcdLine == LCD_LINE_FIRST){
        Vh_LcdWriteString(VH_LCD1, LCD_LINE_FIRST, "Linea 1");
    } else if (lcdLine == LCD_LINE_SECOND){
        Vh_LcdWriteString(VH_LCD1, LCD_LINE_SECOND, "Linea 2");
    } else if (lcdLine == LCD_LINE_THIRD){
        Vh_LcdWriteString(VH_LCD1, LCD_LINE_THIRD, "Linea 3");
    }

    delay(1000);
}

/*==================[external functions definition]==========================*/

int main(void){
// Variable para determinar que ejemplo se debe correr
static uint8_t exampleIndex = 0;
// Arreglo para escribir en el display LCD el ejemplo que se esta ejecutando
char messageExampleRunning [7][55] = {
        "Se esta ejecutando el ejemplo GpioWrite()",
        "Se esta ejecutando el ejemplo GpioRead()",
        "Se esta ejecutando el ejemplo GpioToggle()",
        "Se esta ejecutando el ejemplo AdcRead()",
        "Se esta ejecutando el ejemplo DacWrite()",
        "Se esta ejecutando el ejemplo 7SegsWrite()",
        "Se esta ejecutando el ejemplo LcdWriteString()",
};

    // Configura la placa EDU-CIAA-NXP
    boardConfig();

    // Configura la biblioteca ViHard
    Vh_BoardConfig(VIHARD_BAUDRATE);

    // Muestra un mensaje de bienvenida y espera 5 segundos
    Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, "Bienvenido a la plataforma ViHard!");
    delay(5000);

    // Muestra que ejemplo se esta ejecutando
    Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, messageExampleRunning[exampleIndex]);

    while(1) {

        // Presionando VH_TEC4 en el programa ViHard se van cambiando los ejemplos
        if (!Vh_GpioRead(VH_TEC4)){

            // Incrementa el indice de los ejemplos y si llega al maximo lo resetea
            if (++exampleIndex == 7){
                exampleIndex = 0;
            }

            // Muestra en el LCD el ejemplo que se esta ejecutando
            Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, messageExampleRunning[exampleIndex]);
            delay(2000);
        }

        // Dependiendo del valor del indice se ejecutan los diferentes ejemplos
        if (exampleIndex == 0){
            RunExample_VhGpioWrite();
        } else if (exampleIndex == 1){
            RunExample_VhGpioRead();
        } else if (exampleIndex == 2){
            RunExample_VhGpioToggle();
        } else if (exampleIndex == 3){
            RunExample_VhAdcRead();
        } else if (exampleIndex == 4){
            RunExample_VhDacWrite();
        } else if (exampleIndex == 5){
            RunExample_Vh7SegmentsWrite();
        } else if (exampleIndex == 6){
            RunExample_VhLcdWriteString();
        } else {
            // Si el valor del ejemplo es desconocido lo pone en 0
            exampleIndex = 0;
        }

    }
    return 0 ;
}

/*==================[end of file]============================================*/

