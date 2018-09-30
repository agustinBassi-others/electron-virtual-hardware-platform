/* Copyright 2018, Agustin Bassi.
 * All rights reserved.
 *
 * This file is part sAPI library for microcontrollers.
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

/*
 * Date: 2018-09-30
 */

/*==================[inclusions]=============================================*/

#include "virtual_hardware.h"

/*==================[macros and definitions]=================================*/

#define COMMAND_INIT                '{'
#define COMMAND_END                 '}'
#define COMMAND_SEPARATOR           ';'

#define MAX_ANALOG_VALUE            1023

#define MILLISECS_BETWEEN_COMMANDS  7
#define MICROSECS_BETWEEN_READS     10

#define V_GPIO_LOW		            '0'
#define V_GPIO_HIGH		            '1'
#define V_GPIO_INVALID	            -1

/**
 * Posibles tipos de comandos que se pueden realizar. Este enum es utilizado
 * unicamente en los comandos de lectura de perifericos virtuales. Cuando el
 * sistema embebido quiere leer le enviar un REQUEST y la aplicacion responde
 * con un RESPONSE.
 */
typedef enum _VirtualCommandType {
    V_COMM_REQUEST  = '0', //!< COMM_SERIAL_REQUEST
    V_COMM_RESPONSE = '1'  //!< COMM_SERIAL_RESPONSE
} VirtualCommandType_t;

/**
 * Posibles llamadas a los perifericos virtuales que se pueden realizar.
 */
typedef enum _VirtualCommand {
    //Comandos asociados a GPIO
    V_GPIO_READ        = 'a',
    V_GPIO_WRITE       = 'b',
    //Comandos asociados al ADC/DAC
    V_ADC_READ         = 'c',
    V_DAC_WRITE        = 'd',
    // Comandos asociados al display LCD
    V_LCD_WRITE_BYTE   = 'e',
    V_LCD_WRITE_STRING = 'f',
    // Comandos asociados al display LCD
    V_7SEG_WRITE       = 'g',
} VirtCommand_t;

/*==================[internal data declaration]==============================*/

/*==================[internal functions declaration]=========================*/

// El prefijo Vhp significa Virtual Hardware Platform. Las funciones con este
// prefijo son las que llaman a diferentes funciones depende de la plataforma.
static void     VhpDelayMs          (uint32_t delayMs);
static void     VhpDelayUs          (uint32_t delayMs);
static void     VhpUartWriteByte    (uint8_t byteToWrite);
static void     VhpUartWriteString  (char * string);
static uint8_t  VhpUartReadByte     (void);
static bool_t   CheckIfValidCommand (VirtCommand_t comm, VirtPeriph_t perMap);
static bool_t   AnalogToString      (uint16_t numToConvert, char * strNumber);

/*==================[internal data definition]===============================*/

/*==================[external data definition]===============================*/

/*==================[internal functions definition]==========================*/

/**
 * Funcion propia para llamar al delay de la plataforma.
 * @param delayMs
 */
static void VhpDelayUs (uint32_t delayMs)
{
#if defined(BOARD_EDU_CIAA_NXP)
    delayUs(delayMs);
#elif defined(BOARD_CIAA_ZERO)
    // todo poner aca la llamada correcta
#elif defined(BOARD_ARDUINO)
    // todo poner aca la llamada de arduino
#endif
}

/**
 * Funcion propia para llamar al delay de la plataforma.
 * @param delayMs
 */
static void VhpDelayMs (uint32_t delayMs)
{
    VhpDelayUs(delayMs * 1000);
}

/**
 * Funcion propia para llamar a la funcion de sacar un
 * byte por la uart seleccionada cuando se configuro al modulo.
 * @param byteToWrite byte a escribir en el puerto serie.
 */
static void VhpUartWriteByte (uint8_t byteToWrite)
{
#if defined(BOARD_EDU_CIAA_NXP)
    uartWriteByte(VIRTUAL_SERIAL_PORT, (uint8_t) byteToWrite);
#elif defined(BOARD_CIAA_ZERO)
    // todo poner aca la llamada correcta
#elif defined(BOARD_ARDUINO)
    // todo poner aca la llamada correcta
#endif
}

/**
 * Funcion propia para leer un byte del puerto serie.
 * Como en funciones anteriores, las funciones de este modulo invocan
 * estas funciones en vez de la de una plataforma en particular. Esto
 * se realiza de esta manera para darle independencia al codigo para que
 * pueda ser multiplataforma.
 * @return el byte leido por la uart.
 */
static uint8_t VhpUartReadByte (void)
{
    static uint8_t byteReaded;

#if defined(BOARD_EDU_CIAA_NXP)
    if (!uartReadByte(VIRTUAL_SERIAL_PORT, &byteReaded))
    {
        byteReaded = 0;
    }
#elif defined(BOARD_CIAA_ZERO)
    // todo poner aca la llamada correcta
#elif defined(BOARD_ARDUINO)
    // todo poner aca la llamada correcta
#endif

    VhpDelayUs(MICROSECS_BETWEEN_READS);

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
static void VhpUartWriteString (char * string)
{
    while (*string != 0)
    {
        VhpUartWriteByte((uint8_t) * string);
        string++;
    }
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
static bool_t AnalogToString (uint16_t numberToConvert, char * strNumber)
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
static bool_t CheckIfValidCommand (VirtCommand_t command,
        VirtPeriph_t perMap)
{
    bool_t isValidCommand = FALSE;
    if (command == V_GPIO_READ)
    {
        if (perMap == V_TEC1 || perMap == V_TEC2 ||
            perMap == V_TEC3 || perMap == V_TEC4)
        {
            isValidCommand = TRUE;
        }
        if (perMap == V_LEDR || perMap == V_LEDG || perMap == V_LEDB ||
            perMap == V_LED1 || perMap == V_LED2 || perMap == V_LED3 ||
            perMap == V_LED4)
        {
            isValidCommand = TRUE;
        }
    }
    else if (command == V_GPIO_WRITE)
    {
        if (perMap == V_LEDR || perMap == V_LEDG || perMap == V_LEDB ||
            perMap == V_LED1 || perMap == V_LED2 || perMap == V_LED3 ||
            perMap == V_LED4)
        {
            isValidCommand = TRUE;
        }
    }
    else if (command == V_ADC_READ)
    {
        if (perMap == V_ADC_CH1)
        {
            isValidCommand = TRUE;
        }
    }
    else if (command == V_DAC_WRITE)
    {
        if (perMap == V_DAC_CH1)
        {
            isValidCommand = TRUE;
        }
    }
    else if (command == V_LCD_WRITE_BYTE || command == V_LCD_WRITE_STRING)
    {
        if (perMap == V_LCD1)
        {
            isValidCommand = TRUE;
        }
    }
    else if (command == V_7SEG_WRITE)
    {
        if (perMap == V_7SEG)
        {
            isValidCommand = TRUE;
        }
    }

    if (isValidCommand)
    {
        VhpDelayMs(MILLISECS_BETWEEN_COMMANDS);
    }

    return isValidCommand;
}

/*==================[external functions definition]==========================*/

/**
 * Configura el puerto serie por el que se va a comunicar el sistema embebido
 * con la plataforma de hardware virtual.
 * @param baudRate velocidad de transmision.
 * @return 1 siempre.
 */
bool_t vBoardConfig (uint32_t baudRate)
{
    uartConfig(VIRTUAL_SERIAL_PORT, baudRate);
    return TRUE;
}

/**
 * Escribe un estado logico en un pin virtual.
 * @param virtualGpioPin pin virtual a escribir.
 * @param pinState estado logico a enviar.
 */
void vGpioWrite (VirtPeriph_t gpioPin, bool_t pinState)
{
    char stringCommand[10];

    if (CheckIfValidCommand(V_GPIO_WRITE, gpioPin))
    {
        stringCommand[0] = COMMAND_INIT;
        stringCommand[1] = V_GPIO_WRITE;
        stringCommand[2] = COMMAND_SEPARATOR;
        stringCommand[3] = gpioPin;
        stringCommand[4] = COMMAND_SEPARATOR;
        stringCommand[5] = pinState == TRUE ? V_GPIO_HIGH : V_GPIO_LOW;
        stringCommand[6] = COMMAND_END;
        stringCommand[7] = '\n';
        stringCommand[8] = '\0';

        VhpUartWriteString(stringCommand);
    }
}

/**
 * Lee el estado logico de un pin virtual.
 * @param virtualGpioPin pin virtual a leer.
 * @return estado logico leido.
 */
bool_t vGpioRead (VirtPeriph_t gpioPin)
{
    char stringCommand[10];
    bool_t pinState = TRUE;
    uint8_t dataSerial = 0;
    uint16_t counter = 0;
    uint8_t i = 0;
    bool_t flagCommandInit = FALSE;

    if (CheckIfValidCommand(V_GPIO_READ, gpioPin))
    {
        stringCommand[0] = COMMAND_INIT;
        stringCommand[1] = V_GPIO_READ;
        stringCommand[2] = COMMAND_SEPARATOR;
        stringCommand[3] = gpioPin;
        stringCommand[4] = COMMAND_SEPARATOR;
        stringCommand[5] = V_COMM_REQUEST;
        stringCommand[6] = COMMAND_END;
        stringCommand[7] = '\n';
        stringCommand[8] = '\0';

        VhpUartWriteString(stringCommand);

        // limpia el buffer
        for (i = 0; i < 10; i++)
        {
            stringCommand[i] = 0;
        }
        i = 0;

        // Espera a recibir data por un tiempo determinado
        while (++counter < 1000 && i < 10)
        {
            if ((dataSerial = VhpUartReadByte()) != 0)
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
                stringCommand[1] == V_GPIO_READ &&
                stringCommand[2] == COMMAND_SEPARATOR &&
                stringCommand[4] == COMMAND_SEPARATOR &&
                stringCommand[5] == V_COMM_RESPONSE &&
                stringCommand[6] == COMMAND_SEPARATOR &&
               (stringCommand[7] == V_GPIO_LOW ||
                stringCommand[7] == V_GPIO_HIGH))
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
void vGpioToggle (VirtPeriph_t gpioPin)
{
    vGpioWrite(gpioPin, !vGpioRead(gpioPin));
}

/**
 * Realiza una lectura sobre un pin analogico.
 * La conversion ADC tiene una resolucion de 10 bits, por lo que, sus
 * valores estan comprendidos entre 0 y 1023.
 * @param virtualAdcPin pin analogico virtual a leer.
 * @return valor analogico leido.
 */
uint16_t vAdcRead (VirtPeriph_t adcChannel)
{
    char stringCommand[15];
    static uint16_t adcValue = 0;
    uint8_t dataSerial = 0;
    uint16_t counter = 0;
    uint8_t i = 0;
    bool_t flagCommandInit = FALSE;

    if (CheckIfValidCommand(V_ADC_READ, adcChannel))
    {

        stringCommand[0] = COMMAND_INIT;
        stringCommand[1] = V_ADC_READ;
        stringCommand[2] = COMMAND_SEPARATOR;
        stringCommand[3] = adcChannel;
        stringCommand[4] = COMMAND_SEPARATOR;
        stringCommand[5] = V_COMM_REQUEST;
        stringCommand[6] = COMMAND_END;
        stringCommand[7] = '\n';
        stringCommand[8] = '\0';

        VhpUartWriteString(stringCommand);

        // limpia el buffer
        for (i = 0; i < 15; i++)
        {
            stringCommand[i] = 0;
        }
        i = 0;

        // Espera a recibir data por un tiempo determinado
        while (++counter < 1000 && i < 15)
        {
            if ((dataSerial = VhpUartReadByte()) != 0)
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
                    && stringCommand[1] == V_ADC_READ&&
                    stringCommand[2] == COMMAND_SEPARATOR &&
                    stringCommand[3] == adcChannel &&
                    stringCommand[4] == COMMAND_SEPARATOR &&
                    stringCommand[5] == V_COMM_RESPONSE &&
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
void vDacWrite (VirtPeriph_t dacChannel, uint16_t dacValue)
{
    char stringCommand[15];
    char analogString[5];

    if (CheckIfValidCommand(V_DAC_WRITE, dacChannel))
    {
        if (dacValue > MAX_ANALOG_VALUE)
        {
            dacValue = MAX_ANALOG_VALUE;
        }
        else if (dacValue < 0)
        {
            dacValue = 0;
        }

        if (AnalogToString(dacValue, analogString))
        {
            stringCommand[0] = COMMAND_INIT;
            stringCommand[1] = V_DAC_WRITE;
            stringCommand[2] = COMMAND_SEPARATOR;
            stringCommand[3] = dacChannel;
            stringCommand[4] = COMMAND_SEPARATOR;
            stringCommand[5] = analogString[0];
            stringCommand[6] = analogString[1];
            stringCommand[7] = analogString[2];
            stringCommand[8] = analogString[3];
            stringCommand[9] = COMMAND_END;
            stringCommand[10] = '\n';
            stringCommand[11] = '\0';

            VhpUartWriteString(stringCommand);
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
void v7SegmentsWrite (VirtPeriph_t display7Segs, uint8_t asciiToShow)
{
    char stringCommand[10];

    if (CheckIfValidCommand(V_7SEG_WRITE, display7Segs))
    {
        stringCommand[0] = COMMAND_INIT;
        stringCommand[1] = V_7SEG_WRITE;
        stringCommand[2] = COMMAND_SEPARATOR;
        stringCommand[3] = display7Segs;
        stringCommand[4] = COMMAND_SEPARATOR;
        stringCommand[5] = asciiToShow;
        stringCommand[6] = COMMAND_END;
        stringCommand[7] = '\n';
        stringCommand[8] = '\0';

        VhpUartWriteString(stringCommand);
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
void vLcdWriteString (VirtPeriph_t displayLcd, LcdLine_t line, char * str)
{
    uint8_t i = 0;
    uint8_t lenght = 0;
    char stringCommand[70];

    if (CheckIfValidCommand(V_LCD_WRITE_STRING, displayLcd))
    {
        for (lenght = 0; str[lenght] != '\0'; lenght++);

        stringCommand[0] = COMMAND_INIT;
        stringCommand[1] = V_LCD_WRITE_STRING;
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

        VhpUartWriteString(stringCommand);
    }
}

/*==================[end of file]============================================*/
