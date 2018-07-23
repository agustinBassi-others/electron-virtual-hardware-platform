
#ifndef _APP_PONCHO_BOARD_H_
#define _APP_PONCHO_BOARD_H_

/*==================[inclusions]=============================================*/

#include "sapi.h"      // <= sAPI header

/*==================[cplusplus]==============================================*/

#ifdef __cplusplus
extern "C" {
#endif

/*==================[macros]=================================================*/

#define BOARD_EDU_CIAA_NXP
#define BOARD_CIAA_ZERO
#define BOARD_PIC_CSS
#define BOARD_ARDUINO

#define VIRTUAL_BAUDRATE		 115200

/*==================[typedef]================================================*/

/**
 * Posibles valores que puede recibir la funcion de escribir un texto
 * sobre el display LCD. LCD_LINE_ALL escribe un mensaje multilinea,
 * los demas valores escriben sobre la primer, segunda o tercer linea del LCD.
 */
typedef enum LcdLine{
	LCD_LINE_ALL    = '0',//!< LCD_LINE_ALL
	LCD_LINE_FIRST  = '1',//!< LCD_LINE_FIRST
	LCD_LINE_SECOND = '2',//!< LCD_LINE_SECOND
	LCD_LINE_THIRD  = '3' //!< LCD_LINE_THIRD
} LcdLine_t;

/**
 * Posibles llamadas a los perifericos virtuales que se pueden realizar.
 */
typedef enum VirtualCommand {
	//Comandos asociados a GPIO
	COMM_SERIAL_GPIO_READ       = 'a',//!< COMM_SERIAL_GPIO_READ
	COMM_SERIAL_GPIO_WRITE      = 'b',//!< COMM_SERIAL_GPIO_WRITE
	//Comandos asociados al ADC/DAC
	COMM_SERIAL_ADC_READ        = 'c',//!< COMM_SERIAL_ADC_READ
	COMM_SERIAL_DAC_WRITE       = 'd',//!< COMM_SERIAL_DAC_WRITE
	// Comandos asociados al display LCD
	COMM_SERIAL_LCD_WRITE_BYTE  = 'e',//!< COMM_SERIAL_LCD_WRITE_BYTE
	COMM_SERIAL_LCD_WRITE_STRING= 'f',//!< COMM_SERIAL_LCD_WRITE_STRING
	// Comandos asociados al display LCD
	COMM_SERIAL_7SEG_WRITE      = 'g',//!< COMM_SERIAL_7SEG_WRITE
} VirtualCommand_t;

/**
 * Mapa de perifericos virtuales a los que se puede acceder.
 */
typedef enum VirtualPeriphericalMap {
	// Valores corespondientes a los leds
	V_LEDR = 'a',   //!< V_LEDR
	V_LEDG = 'b',   //!< V_LEDG
	V_LEDB = 'z',   //!< V_LEDB
	V_LED1 = 'c',   //!< V_LED1
	V_LED2 = 'd',   //!< V_LED2
	V_LED3 = 'e',   //!< V_LED3
	V_LED4 = 'f',   //!< V_LED4
	// Valores corespondientes a las teclas
	V_TEC1 = 'g',   //!< V_TEC1
	V_TEC2 = 'h',   //!< V_TEC2
	V_TEC3 = 'i',   //!< V_TEC3
	V_TEC4 = 'j',   //!< V_TEC4
	// Valores coorespondientes a los pines ADC
	V_ADC_CH1 = 'k',//!< V_ADC_CH1
	// Valores coorespondientes a los pines DAC
	V_DAC_CH1 = 'n',//!< V_DAC_CH1
	// Valores coorespondientes al periferico LCD
	V_LCD1 = 'o',   //!< V_LCD1
	// Valores coorespondientes al periferico 7 segmentos
	V_7SEG = 'p',   //!< V_7SEG
} VirtualPeriphericalMap_t;

/*==================[external data declaration]==============================*/

/*==================[external functions declaration]=========================*/

bool_t   vBoardConfig    (uint32_t baudRate);

bool_t   vGpioRead       (VirtualPeriphericalMap_t bluetoothPin);
void     vGpioWrite      (VirtualPeriphericalMap_t bluetoothPin, bool_t pinState);
void     vGpioToggle     (VirtualPeriphericalMap_t bluetoothPin);

void     vLcdWriteString (VirtualPeriphericalMap_t display, LcdLine_t lcdLine, char * stringToWrite);

uint16_t vAdcRead        (VirtualPeriphericalMap_t adcChannel);
void     vDacWrite       (VirtualPeriphericalMap_t dacChannel, uint16_t dacValue);

void     v7SegmentsWrite (VirtualPeriphericalMap_t display, uint8_t valueToShow);

/*==================[cplusplus]==============================================*/

#ifdef __cplusplus
}
#endif

/*==================[end of file]============================================*/
#endif /* #ifndef _APP_PONCHO_BOARD_H_ */
