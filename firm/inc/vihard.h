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
// #define BOARD_EDU_CIAA_NXP
//#define BOARD_CIAA_ZERO
//#define BOARD_ARDUINO
#define BOARD_PC

// Si no hay ninguna placa definida muestra un error de compilacion
#if !defined(BOARD_EDU_CIAA_NXP) && \
	!defined(BOARD_CIAA_ZERO) && \
	!defined(BOARD_ARDUINO) && \
	!defined(BOARD_PC)
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

#elif defined(BOARD_PC)

#include "stdio.h"

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

#elif defined(BOARD_PC)

#define VIHARD_SERIAL_PORT           0
#define VIHARD_BAUDRATE              115200
#define CLOCK_SPEED_MHZ              0

#define UART_CONFIG(baudrate)        printf("Velocidad vihard: %d", baudrate)
#define UART_READ_BYTE(byteToRead)   printf("Se leera en la direccion: %d", &byteToRead)
#define UART_WRITE_BYTE(byteToWrite) printf("Se escribe el byte: %d", (uint8_t) byteToWrite)

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
