var fs = require('fs');

function ShowSourceFile(event, sourceFileName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("TabContent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("TabLink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(sourceFileName).style.display = "block";
    event.currentTarget.className += " active";
}


function CopyToClipboard (fileToCopyToClipboard){
    const {clipboard} = require('electron')

    console.log("El path a copiar es: " + fileToCopyToClipboard)

    let fileContent = "Not file selected"

    if (fileToCopyToClipboard == "vihard.h"){
        fileContent = String_vihard_h;
    } else if (fileToCopyToClipboard == "vihard.c"){
        fileContent = String_vihard_c;
    } else if (fileToCopyToClipboard == "vihard_examples.c"){
        fileContent = String_vihard_examples_c;
    }  

    // let fileContent = fs.readFileSync(fileToCopyToClipboard, 'utf8')
    
    // console.log("El contenido es: " + fileContent)

    clipboard.writeText(fileContent)
}

// Genera un evento programaticamente sobre un elemento del documento
function EventFire(element, eventType){
    if (element.fireEvent) {
        element.fireEvent('on' + eventType);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(eventType, true, false);
        element.dispatchEvent(evObj);
    }
}

// Realiza el evento click sobre el TabLink_1 para que desde el inicio haya un tab
// de codigo seleccionado.
EventFire(document.getElementById('TabLink_1'), 'click');

var String_vihard_h = `
/* Copyright 2018, Agustin Bassi.
 * All rights reserved.
 *
 * This file is part ViHard library, a library of virtual hardware
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

#ifndef _VIHARD_H_
#define _VIHARD_H_

// Descomentar algunas de las siguientes lineas dependiendo la placa
#define BOARD_EDU_CIAA_NXP
//#define BOARD_CIAA_ZERO
//#define BOARD_ARDUINO

// Si no hay ninguna placa definida muestra un error de compilacion
#if !defined(BOARD_EDU_CIAA_NXP) && \
	!defined(BOARD_CIAA_ZERO) && \
	!defined(BOARD_ARDUINO)
	#error "Se debe definir un BOARD al inicio del archivo virtual_hardware.h"
#endif

/*==================[inclusions]=============================================*/

#include <stdint.h>

#if defined(BOARD_EDU_CIAA_NXP)

	#include "sapi.h"

#elif defined(BOARD_CIAA_ZERO)

    // todo poner aca la llamada correcta

#elif defined(BOARD_ARDUINO)

	// todo poner aca la llamada correcta

#endif


/*==================[cplusplus]==============================================*/

#ifdef __cplusplus
extern "C" {
#endif

/*==================[macros]=================================================*/

#if defined(BOARD_EDU_CIAA_NXP)

    #define VIHARD_SERIAL_PORT           UART_USB
    #define VIHARD_BAUDRATE              115200
    #define CLOCK_SPEED_MHZ              204

    #define UART_CONFIG(baudrate)        uartConfig(VIHARD_SERIAL_PORT, baudrate)
    #define UART_READ_BYTE(byteToRead)   uartReadByte(VIHARD_SERIAL_PORT, &byteToRead)
    #define UART_WRITE_BYTE(byteToWrite) uartWriteByte(VIHARD_SERIAL_PORT, (uint8_t) byteToWrite)

#elif defined(BOARD_CIAA_ZERO)

    // todo poner aca la llamada correcta

#elif defined(BOARD_ARDUINO)

    // todo poner aca la llamada correcta

#endif



// Si los estados logicos estan definidos los elimina para asegurarse
// que el valor de true y false sean los deseados
#ifdef FALSE
   #undef FALSE
#endif

#ifdef TRUE
   #undef TRUE
#endif

#define FALSE  0
#define TRUE   (!FALSE)

/*==================[typedef]================================================*/

typedef uint8_t bool_t;

/**
 * Posibles valores que puede recibir la funcion de escribir un texto
 * sobre el display LCD. LCD_LINE_ALL escribe un mensaje multilinea,
 * los demas valores escriben sobre la primer, segunda o tercer linea del LCD.
 */
typedef enum _LcdLine{
	LCD_LINE_ALL    = '0', //!< LCD_LINE_ALL
	LCD_LINE_FIRST  = '1', //!< LCD_LINE_FIRST
	LCD_LINE_SECOND = '2', //!< LCD_LINE_SECOND
	LCD_LINE_THIRD  = '3'  //!< LCD_LINE_THIRD
} LcdLine_t;

/**
 * Mapa de perifericos virtuales a los que se puede acceder.
 */
typedef enum _ViHardPeriph {
	// Valores corespondientes a los leds
	VH_LEDR      = 'a',   //!< VH_LEDR
	VH_LEDG      = 'b',   //!< VH_LEDG
	VH_LEDB      = 'z',   //!< VH_LEDB
	VH_LED1      = 'c',   //!< VH_LED1
	VH_LED2      = 'd',   //!< VH_LED2
	VH_LED3      = 'e',   //!< VH_LED3
	VH_LED4      = 'f',   //!< VH_LED4
	// Valores corespondientes a las teclas
	VH_TEC1      = 'g',   //!< VH_TEC1
	VH_TEC2      = 'h',   //!< VH_TEC2
	VH_TEC3      = 'i',   //!< VH_TEC3
	VH_TEC4      = 'j',   //!< VH_TEC4
	// Valores coorespondientes a los pines ADC
	VH_ADC_CH1   = 'k',   //!< VH_ADC_CH1
	// Valores coorespondientes a los pines DAC
	VH_DAC_CH1   = 'n',   //!< VH_DAC_CH1
	// Valores coorespondientes al periferico LCD
	VH_LCD1      = 'o',   //!< VH_LCD1
	// Valores coorespondientes al periferico 7 segmentos
	VH_7SEG      = 'p',   //!< VH_7SEG
} ViHardPeriph_t;

/*==================[external data declaration]==============================*/

/*==================[external functions declaration]=========================*/

bool_t   Vh_BoardConfig    (uint32_t baudRate);

bool_t   Vh_GpioRead       (ViHardPeriph_t gpioPin);
void     Vh_GpioWrite      (ViHardPeriph_t gpioPin, bool_t pinState);
void     Vh_GpioToggle     (ViHardPeriph_t gpioPin);

uint16_t Vh_AdcRead        (ViHardPeriph_t adcChannel);
void     Vh_DacWrite       (ViHardPeriph_t dacChannel, uint16_t dacValue);

void     Vh_7SegmentsWrite (ViHardPeriph_t display7Segs, uint8_t asciiToShow);

void     Vh_LcdWriteString (ViHardPeriph_t displayLcd, LcdLine_t line, char * str);

/*==================[cplusplus]==============================================*/

#ifdef __cplusplus
}
#endif

/*==================[end of file]============================================*/
#endif /* #ifndef _VIHARD_H_ */

`

var String_vihard_c = `
/* Copyright 2018, Agustin Bassi.
 * All rights reserved.
 *
 * This file is part ViHard library, a library of virtual hardware
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

#include <math.h>

#include "vihard.h"

/*==================[macros and definitions]=================================*/

#define COMMAND_INIT            '{'
#define COMMAND_END             '}'
#define COMMAND_SEPARATOR       ';'

#define MAX_ANALOG_VALUE        1023

#define MS_BETWEEN_COMMANDS     7

#define VH_GPIO_LOW		        '0'
#define VH_GPIO_HIGH            '1'
#define VH_GPIO_INVALID	        -1

/**
 * Posibles tipos de comandos que se pueden realizar. Este enum es utilizado
 * unicamente en los comandos de lectura de perifericos virtuales. Cuando el
 * sistema embebido quiere leer le enviar un REQUEST y la aplicacion responde
 * con un RESPONSE.
 */
typedef enum _ViHardCommandType {
    VH_COMM_REQUEST  = '0', //!< COMM_SERIAL_REQUEST
    VH_COMM_RESPONSE = '1'  //!< COMM_SERIAL_RESPONSE
} ViHardCommandType_t;

/**
 * Posibles llamadas a los perifericos virtuales que se pueden realizar.
 */
typedef enum _ViHardCommand {
    //Comandos asociados a GPIO
    VH_GPIO_READ        = 'a',
    VH_GPIO_WRITE       = 'b',
    //Comandos asociados al ADC/DAC
    VH_ADC_READ         = 'c',
    VH_DAC_WRITE        = 'd',
    // Comandos asociados al display LCD
    VH_LCD_WRITE_BYTE   = 'e',
    VH_LCD_WRITE_STRING = 'f',
    // Comandos asociados al display LCD
    VH_7SEG_WRITE       = 'g',
} ViHardCommand_t;

/*==================[internal data declaration]==============================*/

/*==================[internal functions declaration]=========================*/

static void     UartWriteByte       (uint8_t byteToWrite);
static uint8_t  UartReadByte        (void);
static void     UartWriteString     (char * string);
static void     DelayMs             (uint32_t delayMs);
static void     DelayUs             (uint32_t delayMs);
static bool_t   CheckIfValidCommand (ViHardCommand_t comm, ViHardPeriph_t perMap);
static bool_t   AnalogValueToString (uint16_t numToConvert, char * strNumber);

/*==================[internal data definition]===============================*/

// Cuando se quieren leer datos del puerto serie se debe esperar
// un tiempo proporcional al baudrate seleccionado. Esta variable
// estatica se utiliza para este proposito.
static uint32_t UsBetweenReads = 1000000 / VIHARD_BAUDRATE;

/*==================[external data definition]===============================*/

/*==================[internal functions definition]==========================*/

/**
 * Funcion propia para llamar a la funcion de sacar un
 * byte por la uart seleccionada cuando se configuro al modulo.
 * @param byteToWrite byte a escribir en el puerto serie.
 */
static void UartWriteByte (uint8_t byteToWrite)
{
    UART_WRITE_BYTE(byteToWrite);
}

/**
 * Funcion propia para leer un byte del puerto serie.
 * Como en funciones anteriores, las funciones de este modulo invocan
 * estas funciones en vez de la de una plataforma en particular. Esto
 * se realiza de esta manera para darle independencia al codigo para que
 * pueda ser multiplataforma.
 * @return el byte leido por la uart.
 */
static uint8_t UartReadByte (void)
{
    static uint8_t byteReaded;

    if (!UART_READ_BYTE(byteReaded))
    {
        byteReaded = 0;
    }
    DelayUs(UsBetweenReads);

    return byteReaded;
}

/**
 * Escribe un string por la uart. En algunas platadormas, esta funcion
 * es soportada de manera nativa por el framework que brinda acceso al
 * hardware, en otras plataformas, para mandar un string por la uart es
 * necesario llamar a la funcion de escribir un byte hasta completar
 * todos los bytes del string.
 * @param string puntero al string a enviar por la uart.
 */
static void UartWriteString (char * string)
{
    while (*string != 0)
    {
        UartWriteByte((uint8_t) * string);
        string++;
    }
}

/**
 * Funcion propia para llamar al delay de la plataforma.
 * @param delayMs
 */
static void DelayUs (uint32_t microSecs)
{
    volatile uint64_t i;
    volatile uint64_t calculatedDelay;

    calculatedDelay = (CLOCK_SPEED_MHZ * microSecs) / 10;

    for(i = calculatedDelay; i > 0; i--);
}

/**
 * Funcion propia para llamar al delay de la plataforma.
 * @param delayMs
 */
static void DelayMs (uint32_t delayMs)
{
    DelayUs(delayMs * 1000);
}

/**
 * Convierte un numero entero analogico de 10 bits (entre 0 y 1023) en un
 * string de 4 elementos. El numero siempre sale en formato 4 digitos.
 *
 * Ejemplos:
 *
 * valor int | valor string
 * 9         | 0009
 * 75        | 0075
 * 754       | 0754
 * 1015      | 1015
 *
 * @param numberToConver numero entero a convertir.
 * @param stringNumber puntero al vector donde se
 * almacenara el string convertido.
 * @return 0 si no hubo error, 1 si hubo error.
 */
static bool_t AnalogValueToString (uint16_t numberToConvert, char * strNumber)
{
    bool_t error = FALSE;
    uint8_t thousands = 0;
    uint8_t hundreds = 0;
    uint8_t tens = 0;
    uint8_t units = 0;

    if (numberToConvert <= MAX_ANALOG_VALUE)
    {
        thousands = numberToConvert / 1000;
        hundreds = numberToConvert / 100;
        if (hundreds >= 10)
        {
            hundreds = 0;
        }
        tens = numberToConvert;
        tens -= ((thousands * 1000) + (hundreds * 100));
        tens /= 10;
        units = numberToConvert;
        units -= ((thousands * 1000) + (hundreds * 100) + (tens * 10));

        strNumber[0] = thousands + '0';
        strNumber[1] = hundreds + '0';
        strNumber[2] = tens + '0';
        strNumber[3] = units + '0';
        strNumber[4] = '\0';
    }
    else
    {
        error = TRUE;
    }
    return !error;
}

/**
 * Chequea que el comando a enviar hacia la aplicacion de hardware virtual
 * sea un comando valido. Por ejemplo, no se puede ejecutar el comando de
 * escribrir un GPIO en el periferico LCD o no se puede realizar el comando
 * de leer un analogico de un pin digital.
 * Para cada comando, chequea que el periferico sea correcto.
 * @param command comando a enviar a la aplicacion.
 * @param perMap periferico virtual sobre el cual se ejecutara el comando.
 * @return 1 si es una combinacion comando/periferico valida, 0 si no lo es.
 */
static bool_t CheckIfValidCommand (ViHardCommand_t command,
        ViHardPeriph_t perMap)
{
    bool_t isValidCommand = FALSE;
    if (command == VH_GPIO_READ)
    {
        if (perMap == VH_TEC1 || perMap == VH_TEC2 ||
            perMap == VH_TEC3 || perMap == VH_TEC4)
        {
            isValidCommand = TRUE;
        }
        if (perMap == VH_LEDR || perMap == VH_LEDG || perMap == VH_LEDB ||
            perMap == VH_LED1 || perMap == VH_LED2 || perMap == VH_LED3 ||
            perMap == VH_LED4)
        {
            isValidCommand = TRUE;
        }
    }
    else if (command == VH_GPIO_WRITE)
    {
        if (perMap == VH_LEDR || perMap == VH_LEDG || perMap == VH_LEDB ||
            perMap == VH_LED1 || perMap == VH_LED2 || perMap == VH_LED3 ||
            perMap == VH_LED4)
        {
            isValidCommand = TRUE;
        }
    }
    else if (command == VH_ADC_READ)
    {
        if (perMap == VH_ADC_CH1)
        {
            isValidCommand = TRUE;
        }
    }
    else if (command == VH_DAC_WRITE)
    {
        if (perMap == VH_DAC_CH1)
        {
            isValidCommand = TRUE;
        }
    }
    else if (command == VH_LCD_WRITE_BYTE || command == VH_LCD_WRITE_STRING)
    {
        if (perMap == VH_LCD1)
        {
            isValidCommand = TRUE;
        }
    }
    else if (command == VH_7SEG_WRITE)
    {
        if (perMap == VH_7SEG)
        {
            isValidCommand = TRUE;
        }
    }

    if (isValidCommand)
    {
        DelayMs(MS_BETWEEN_COMMANDS);
    }

    return isValidCommand;
}

/*==================[external functions definition]==========================*/

/**
 * Configura el puerto serie por el que se va a comunicar el sistema embebido
 * con la plataforma de hardware virtual.
 * Se elige que solo se reciba la velocidad de la uart y no a que uart se va
 * a conectar ya que el framework de Arduino unicamente recibe como parametro
 * la velocidad de conexion.
 * @param baudRate velocidad de transmision.
 * @return 1 siempre.
 */
bool_t Vh_BoardConfig (uint32_t baudRate)
{
    // Se calcula el tiempo entre lecturas dependiendo baudrate y se agrega 10%
    UsBetweenReads = round((1000000 / baudRate) + ((1000000 / baudRate) * 0.1));
    UART_CONFIG(baudRate);

    return TRUE;
}

/**
 * Escribe un estado logico en un pin virtual.
 * @param virtualGpioPin pin virtual a escribir.
 * @param pinState estado logico a enviar.
 */
void Vh_GpioWrite (ViHardPeriph_t gpioPin, bool_t pinState)
{
    char stringCommand[10];

    if (CheckIfValidCommand(VH_GPIO_WRITE, gpioPin))
    {
        stringCommand[0] = COMMAND_INIT;
        stringCommand[1] = VH_GPIO_WRITE;
        stringCommand[2] = COMMAND_SEPARATOR;
        stringCommand[3] = gpioPin;
        stringCommand[4] = COMMAND_SEPARATOR;
        stringCommand[5] = pinState == TRUE ? VH_GPIO_HIGH : VH_GPIO_LOW;
        stringCommand[6] = COMMAND_END;
        stringCommand[7] = '\n';
        stringCommand[8] = '\0';

        UartWriteString(stringCommand);
    }
}

/**
 * Lee el estado logico de un pin virtual.
 * @param virtualGpioPin pin virtual a leer.
 * @return estado logico leido.
 */
bool_t Vh_GpioRead (ViHardPeriph_t gpioPin)
{
    char stringCommand[10];
    bool_t pinState = TRUE;
    uint8_t dataSerial = 0;
    uint16_t counter = 0;
    uint8_t i = 0;
    bool_t flagCommandInit = FALSE;

    if (CheckIfValidCommand(VH_GPIO_READ, gpioPin))
    {
        stringCommand[0] = COMMAND_INIT;
        stringCommand[1] = VH_GPIO_READ;
        stringCommand[2] = COMMAND_SEPARATOR;
        stringCommand[3] = gpioPin;
        stringCommand[4] = COMMAND_SEPARATOR;
        stringCommand[5] = VH_COMM_REQUEST;
        stringCommand[6] = COMMAND_END;
        stringCommand[7] = '\n';
        stringCommand[8] = '\0';

        UartWriteString(stringCommand);

        // limpia el buffer
        for (i = 0; i < 10; i++)
        {
            stringCommand[i] = 0;
        }
        i = 0;

        // Espera a recibir data por un tiempo determinado
        while (++counter < 1000 && i < 10)
        {
            if ((dataSerial = UartReadByte()) != 0)
            {
                if (dataSerial == COMMAND_INIT)
                {
                    flagCommandInit = TRUE;
                }
                if (flagCommandInit)
                {
                    stringCommand[i] = dataSerial;
                    if (stringCommand[i] == '}')
                    {
                        break;
                    }
                    i++;
                }
            }
        }

        // chequea si salio por timeout
        if (counter < 1000)
        {
            // chequea que todos lo que haya llegado
            // sea una respuesta correcta
            if (stringCommand[0] == COMMAND_INIT &&
                stringCommand[1] == VH_GPIO_READ &&
                stringCommand[2] == COMMAND_SEPARATOR &&
                stringCommand[4] == COMMAND_SEPARATOR &&
                stringCommand[5] == VH_COMM_RESPONSE &&
                stringCommand[6] == COMMAND_SEPARATOR &&
               (stringCommand[7] == VH_GPIO_LOW ||
                stringCommand[7] == VH_GPIO_HIGH))
            {
                pinState = stringCommand[7] - '0';
            }
        }
    }

    return pinState;
}

/**
 * Invierte el estado logico de un pin.
 * Notar que para que esta accion se realice, el pin a invertir su estado
 * debe ser un pin de salida.
 * @param virtualGpioPin pin a invertir el estado logico.
 */
void Vh_GpioToggle (ViHardPeriph_t gpioPin)
{
    Vh_GpioWrite(gpioPin, !Vh_GpioRead(gpioPin));
}

/**
 * Realiza una lectura sobre un pin analogico.
 * La conversion ADC tiene una resolucion de 10 bits, por lo que, sus
 * valores estan comprendidos entre 0 y 1023.
 * @param virtualAdcPin pin analogico virtual a leer.
 * @return valor analogico leido.
 */
uint16_t Vh_AdcRead (ViHardPeriph_t adcChannel)
{
    char stringCommand[15];
    static uint16_t adcValue = 0;
    uint8_t dataSerial = 0;
    uint16_t counter = 0;
    uint8_t i = 0;
    bool_t flagCommandInit = FALSE;

    if (CheckIfValidCommand(VH_ADC_READ, adcChannel))
    {

        stringCommand[0] = COMMAND_INIT;
        stringCommand[1] = VH_ADC_READ;
        stringCommand[2] = COMMAND_SEPARATOR;
        stringCommand[3] = adcChannel;
        stringCommand[4] = COMMAND_SEPARATOR;
        stringCommand[5] = VH_COMM_REQUEST;
        stringCommand[6] = COMMAND_END;
        stringCommand[7] = '\n';
        stringCommand[8] = '\0';

        UartWriteString(stringCommand);

        // limpia el buffer
        for (i = 0; i < 15; i++)
        {
            stringCommand[i] = 0;
        }
        i = 0;

        // Espera a recibir data por un tiempo determinado
        while (++counter < 1000 && i < 15)
        {
            if ((dataSerial = UartReadByte()) != 0)
            {
                if (dataSerial == COMMAND_INIT)
                {
                    flagCommandInit = TRUE;
                }
                if (flagCommandInit)
                {
                    stringCommand[i] = dataSerial;
                    if (stringCommand[i] == '}')
                    {
                        break;
                    }
                    i++;
                }
            }
        }

        // chequea si salio por timeout
        if (i == 11 && counter < 1000)
        {
            // chequea que todos lo que haya llegado
            // sea una respuesta correcta
            if (stringCommand[0] == COMMAND_INIT
                    && stringCommand[1] == VH_ADC_READ&&
                    stringCommand[2] == COMMAND_SEPARATOR &&
                    stringCommand[3] == adcChannel &&
                    stringCommand[4] == COMMAND_SEPARATOR &&
                    stringCommand[5] == VH_COMM_RESPONSE &&
                    stringCommand[6] == COMMAND_SEPARATOR &&
                    stringCommand[11] == COMMAND_END)
            {
                adcValue = 0;
                // unidades de mil
                adcValue += (stringCommand[7] - '0') * 1000;
                // centenas
                adcValue += (stringCommand[8] - '0') * 100;
                // decenas
                adcValue += (stringCommand[9] - '0') * 10;
                // unidades
                adcValue += (stringCommand[10] - '0');

                if (adcValue > MAX_ANALOG_VALUE)
                {
                    adcValue = MAX_ANALOG_VALUE;
                }
                else if (adcValue < 0)
                {
                    adcValue = 0;
                }
            }
        }
    }

    return adcValue;
}

/**
 * Escribe un valor analogico sobre una salida analogica.
 * El valor a escribir es de 10 bits, por lo que, sus
 * valores estan comprendidos entre 0 y 1023.
 * @param dacChannel pin analogico a escribir.
 * @param dacValue valor de 10 bits a escribir.
 */
void Vh_DacWrite (ViHardPeriph_t dacChannel, uint16_t dacValue)
{
    char stringCommand[15];
    char analogString[5];

    if (CheckIfValidCommand(VH_DAC_WRITE, dacChannel))
    {
        if (dacValue > MAX_ANALOG_VALUE)
        {
            dacValue = MAX_ANALOG_VALUE;
        }
        else if (dacValue < 0)
        {
            dacValue = 0;
        }

        if (AnalogValueToString(dacValue, analogString))
        {
            stringCommand[0]  = COMMAND_INIT;
            stringCommand[1]  = VH_DAC_WRITE;
            stringCommand[2]  = COMMAND_SEPARATOR;
            stringCommand[3]  = dacChannel;
            stringCommand[4]  = COMMAND_SEPARATOR;
            stringCommand[5]  = analogString[0];
            stringCommand[6]  = analogString[1];
            stringCommand[7]  = analogString[2];
            stringCommand[8]  = analogString[3];
            stringCommand[9]  = COMMAND_END;
            stringCommand[10] = '\n';
            stringCommand[11] = '\0';

            UartWriteString(stringCommand);
        }
    }
}

/**
 * Escribe un caracter ASCII sobre el periferico display 7 segmentos.
 * A diferencia de un display 7 segmentos real, este display, por el tipo
 * de letra elegido, puede escribir cualquier caracter ASCII sobre el display
 * a diferencia de uno tradicional que puede escribir del 0-9 y A-F.
 * @param display periferico del display 7 segmentos.
 * @param valueToShow caracter ASCII a mostrar sobre el display.
 */
void Vh_7SegmentsWrite (ViHardPeriph_t display7Segs, uint8_t asciiToShow)
{
    char stringCommand[10];

    if (CheckIfValidCommand(VH_7SEG_WRITE, display7Segs))
    {
        stringCommand[0] = COMMAND_INIT;
        stringCommand[1] = VH_7SEG_WRITE;
        stringCommand[2] = COMMAND_SEPARATOR;
        stringCommand[3] = display7Segs;
        stringCommand[4] = COMMAND_SEPARATOR;
        stringCommand[5] = asciiToShow;
        stringCommand[6] = COMMAND_END;
        stringCommand[7] = '\n';
        stringCommand[8] = '\0';

        UartWriteString(stringCommand);
    }
}

/**
 * Escribe un texto sobre el periferico display LCD.
 * Como en el caso de un display LCD real, se puede seleccionar la linea
 * sobre la cual escribir el texto.
 * @param display periferico del display lcd sobre el cual escribir.
 * @param lcdLine la linea sobre la cual escribir el mensaje, los posibles
 * valores de la lineas son:
 * --- LCD_LINE_ALL: escribe un mensaje multilinea.
 * --- LCD_LINE_FIRST: escribe en la primer linea.
 * --- LCD_LINE_SECOND: escribe en la segunda linea.
 * --- LCD_LINE_THIRD: escribe en la tercer linea.
 * @param stringToWrite cadena a escribir
 */
void Vh_LcdWriteString (ViHardPeriph_t displayLcd, LcdLine_t line, char * str)
{
    uint8_t i = 0;
    uint8_t lenght = 0;
    char stringCommand[70];

    if (CheckIfValidCommand(VH_LCD_WRITE_STRING, displayLcd))
    {
        for (lenght = 0; str[lenght] != '\0'; lenght++);

        stringCommand[0] = COMMAND_INIT;
        stringCommand[1] = VH_LCD_WRITE_STRING;
        stringCommand[2] = COMMAND_SEPARATOR;
        stringCommand[3] = displayLcd;
        stringCommand[4] = COMMAND_SEPARATOR;
        stringCommand[5] = line;
        stringCommand[6] = COMMAND_SEPARATOR;

        for (i = 0; i < lenght; i++)
        {
            stringCommand[i + 7] = str[i];
        }

        stringCommand[7 + lenght] = COMMAND_END;
        stringCommand[8 + lenght] = '\n';
        stringCommand[9 + lenght] = '\0';

        UartWriteString(stringCommand);
    }
}

/*==================[end of file]============================================*/

`

var String_vihard_examples_c = `
/* Copyright 2018, Agustin Bassi.
 * All rights reserved.
 *
 * This file is part ViHard library, a library of virtual hardware
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

static void TestVhGpioWrite          ();
static void TestVhDac                ();
static void TestVh7Segments          ();
static void TestVhDisplayWriteString ();
static void TestVhGpioRead           ();
static void TestVhGpioToggle         ();
static void TestVhAdcRead            ();
static void TestVhIntegral           ();

// Si la version de la sAPI tiene el modulo cyclesCounter se compila el bloque
#ifdef EDU_CIAA_NXP_CLOCK_SPEED
    static void TestVhTimming        ();
#endif

/*==================[internal data definition]===============================*/

/*==================[external data definition]===============================*/

/*==================[internal functions definition]==========================*/


static void TestVhGpioWrite (){
    Vh_GpioWrite(VH_LED1, TRUE);
    gpioWrite(LED1, TRUE);
    delay(500);

    Vh_GpioWrite(VH_LED2, TRUE);
    gpioWrite(LED2, TRUE);
    delay(500);

    Vh_GpioWrite(VH_LED3, TRUE);
    gpioWrite(LED3, TRUE);
    delay(500);

    Vh_GpioWrite(VH_LED1, FALSE);
    gpioWrite(LED1, FALSE);
    delay(500);

    Vh_GpioWrite(VH_LED2, FALSE);
    gpioWrite(LED2, FALSE);
    delay(500);

    Vh_GpioWrite(VH_LED3, FALSE);
    gpioWrite(LED3, FALSE);
    delay(500);
}

static void TestVhDac (){
    uint16_t dacValue = 0;

    for (dacValue = 0; dacValue <= 1000; dacValue += 100){
        Vh_DacWrite(VH_DAC_CH1, dacValue);
        delay(1000);
    }
}

static void TestVh7Segments (){
    uint8_t value = 0;

    for (value = '0'; value <= '9'; value++){
        Vh_7SegmentsWrite(VH_7SEG, value);
        delay (1000);
    }
}

static void TestVhDisplayWriteString    (){
    Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, "Mensaje multilinea desde ViHard");
    delay(2000);

    Vh_LcdWriteString(VH_LCD1, LCD_LINE_FIRST, "Linea 1");
    delay(2000);

    Vh_LcdWriteString(VH_LCD1, LCD_LINE_SECOND, "Linea 2");
    delay(2000);

    Vh_LcdWriteString(VH_LCD1, LCD_LINE_THIRD, "Linea 3");
    delay(2000);

}

static void TestVhGpioRead (){
    if (!Vh_GpioRead(VH_TEC1)){
        gpioWrite(LEDG, TRUE);
    } else {
        gpioWrite(LEDG, FALSE);
    }
    delay (50);

    if (!Vh_GpioRead(VH_TEC2)){
        gpioWrite(LED1, TRUE);
    } else {
        gpioWrite(LED1, FALSE);
    }
    delay (50);

    if (!Vh_GpioRead(VH_TEC3)){
        gpioWrite(LED2, TRUE);
    } else {
        gpioWrite(LED2, FALSE);
    }
    delay (50);

    if (!Vh_GpioRead(VH_TEC4)){
        gpioWrite(LED3, TRUE);
    } else {
        gpioWrite(LED3, FALSE);
    }
    delay (50);
}

static void TestVhGpioToggle (){
    while (gpioRead(TEC1)){
        Vh_GpioToggle(VH_LED1);
        delay(500);
    }

    while (gpioRead(TEC1)){
        Vh_GpioToggle(VH_LED2);
        delay(500);
    }

    while (gpioRead(TEC1)){
        Vh_GpioToggle(VH_LED3);
        delay(500);
    }

    while (gpioRead(TEC1)){
        Vh_GpioToggle(VH_LED4);
        delay(500);
    }
}

static void TestVhAdcRead (){
    uint16_t adcValue = 0;

    while(1){
        adcValue = Vh_AdcRead(VH_ADC_CH1);
        if (adcValue >= 0 && adcValue <= 250){
            gpioWrite(LEDR, TRUE);
            gpioWrite(LED1, FALSE);
            gpioWrite(LED2, FALSE);
            gpioWrite(LED3, FALSE);
        } else if (adcValue > 250 && adcValue <= 500){
            gpioWrite(LEDR, TRUE);
            gpioWrite(LED1, TRUE);
            gpioWrite(LED2, FALSE);
            gpioWrite(LED3, FALSE);
        } else if (adcValue > 500 && adcValue <= 750){
            gpioWrite(LEDR, TRUE);
            gpioWrite(LED1, TRUE);
            gpioWrite(LED2, TRUE);
            gpioWrite(LED3, FALSE);
        } else if (adcValue > 750){
            gpioWrite(LEDR, TRUE);
            gpioWrite(LED1, TRUE);
            gpioWrite(LED2, TRUE);
            gpioWrite(LED3, TRUE);
        }
        delay(200);
    }
}

// Si la version de la sAPI tiene el modulo cyclesCounter se compila el bloque
#ifdef EDU_CIAA_NXP_CLOCK_SPEED
static void TestTimming(){
  char lcdText[50];

  cyclesCounterConfig(EDU_CIAA_NXP_CLOCK_SPEED);

  while(1){

      while (gpioRead(TEC1));
      delay(1000);
      cyclesCounterReset();
      Vh_7SegmentsWrite(VH_7SEG, '1');
      stdioSprintf(lcdText, "7SegsWrite: %d us",
              (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
      Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

      while (gpioRead(TEC1));
      delay(1000);
      cyclesCounterReset();
      Vh_AdcRead(VH_ADC_CH1);
      stdioSprintf(lcdText, "AdcRead: %d us",
              (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
      Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

      while (gpioRead(TEC1));
      delay(1000);
      cyclesCounterReset();
      Vh_DacWrite(VH_DAC_CH1, 145);
      stdioSprintf(lcdText, "DacWrite: %d us",
              (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
      Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

      while (gpioRead(TEC1));
      delay(1000);
      cyclesCounterReset();
      Vh_GpioRead(VH_TEC1);
      stdioSprintf(lcdText, "GpioRead: %d us",
              (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
      Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

      while (gpioRead(TEC1));
      delay(1000);
      cyclesCounterReset();
      Vh_GpioWrite(VH_LED2, 1);
      stdioSprintf(lcdText, "GpioWrite: %d us",
              (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
      Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

      while (gpioRead(TEC1));
      delay(1000);
      cyclesCounterReset();
      Vh_GpioToggle(VH_LED4);
      stdioSprintf(lcdText, "GpioToggle: %d us",
              (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
      Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

      while (gpioRead(TEC1));
      delay(1000);
      cyclesCounterReset();
      Vh_LcdWriteString(VH_LCD1, (LcdLine_t) LCD_LINE_ALL, "Hola mensaje multilinea");
      stdioSprintf(lcdText, "LcdWrite: %d us",
              (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
      Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

      gpioToggle(LED3);
  }
}
#endif

static void TestVhIntegral(){
    const uint32_t timeToUpdateLcd = 35;
    const uint32_t timeToUpdate7Segs = 8;
    const uint32_t timeToToggleLed = 8;
    uint32_t counterUpdateLcd = 0;
    uint32_t counterUpdate7Segs = 0;
    uint32_t counterToggleLed = 0;

    uint8_t value7Segs = '0';

    uint16_t adcValue = 0;

    bool_t stateTec1 = TRUE;
    bool_t stateTec2 = TRUE;

    uint8_t lcdMessageIndex = 0;
    char lcdMessages[4][50] = {
            "Hola desde ViHard! Este es un mensaje multilinea",
            "Mensaje linea 1",
            "Mensaje linea 2",
            "Mensaje linea 3"
    };


    while(1){
        // Lee el ADC virtual y envia el valor al DAC virtual
        adcValue = Vh_AdcRead(VH_ADC_CH1);
        Vh_DacWrite(VH_DAC_CH1, adcValue);
        // Enciende VH_LED1 si VHTEC1 esta pulsada, sino lo apaga
        stateTec1 = Vh_GpioRead(VH_TEC1);
        Vh_GpioWrite(VH_LED1, !stateTec1);
        // Enciende VH_LED2 si VHTEC2 esta pulsada, sino lo apaga
        stateTec2 = Vh_GpioRead(VH_TEC2);
        Vh_GpioWrite(VH_LED2, !stateTec2);
        // Pasado un tiempo togglea led virtual y led fisico de la EDU CIAA
        if (++counterToggleLed >= timeToToggleLed){
            // Toggle del pin virtual VH_LED3
            Vh_GpioToggle(VH_LED4);
            // Toggle del led fisico de la EDU CIAA
            gpioToggle(LED3);
            counterToggleLed = 0;
        }
        // Pasado un tiempo actualiza el valor del display 7 segmentos
        if (++counterUpdate7Segs >= timeToUpdate7Segs){
            Vh_7SegmentsWrite(VH_7SEG, value7Segs);
            if (++value7Segs > '9'){
                value7Segs = '0';
            }
            counterUpdate7Segs = 0;
        }
        // Pasado un tiempo actualiza el valor del display LCD
        if (++counterUpdateLcd >= timeToUpdateLcd){
            Vh_LcdWriteString(
                    VH_LCD1,
                    (LcdLine_t) (lcdMessageIndex + '0'),
                    lcdMessages[lcdMessageIndex]
            );
            if (++lcdMessageIndex > 3){
                lcdMessageIndex = 0;
            }
            counterUpdateLcd = 0;
        }
    }
}

/*==================[external functions definition]==========================*/

int main(void){

	boardConfig();

	Vh_BoardConfig(VIHARD_BAUDRATE);

	while(1) {
        //  TestGpioWrite();
        //  TestDac();
        //  Test7Segments();
        //  TestDisplayWriteString();
        //  TestGpioRead();
        //  TestGpioToggle();
        //  TestAdcRead();
	    //  TestTimming();
	        TestVhIntegral();
	}
	return 0 ;
}

/*==================[end of file]============================================*/

`