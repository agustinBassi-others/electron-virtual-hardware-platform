
#ifndef _APP_PONCHO_BOARD_H_
#define _APP_PONCHO_BOARD_H_

/*==================[inclusions]=============================================*/

#include "sapi.h"      // <= sAPI header

/*==================[cplusplus]==============================================*/

#ifdef __cplusplus
extern "C" {
#endif

/*==================[macros]=================================================*/

#define VIRTUAL_BAUDRATE		115200

/** Estados logicos de las teclas y leds de la APP. */
#define VIRTUAL_GPIO_LOW		'0'
#define VIRTUAL_GPIO_HIGH		'1'
#define VIRTUAL_GPIO_INVALID	-1

//#define LCD_MULTI_LINE           '0'
//#define LCD_FIRST_LINE           '1'
//#define LCD_SECOND_LINE          '2'
//#define LCD_THIRD_LINE           '3'
#define LCD_MULTI_LINE_LENGHT    55
#define LCD_LINE_LENGHT          18

/** Tiempo maximo de espera por una respuesta. */
#define MS_TO_WAIT_RESPONSE		30

/*==================[typedef]================================================*/

typedef enum LcdLine{
	LCD_LINE_ALL    = '0',
	LCD_LINE_FIRST  = '1',
	LCD_LINE_SECOND = '2',
	LCD_LINE_THIRD  = '3'
} LcdLine_t;

typedef enum VirtualCommand {
	//Comandos asociados a GPIO
	COMM_SERIAL_GPIO_READ 		= 'a',
	COMM_SERIAL_GPIO_WRITE 		= 'b',

	//Comandos asociados al ADC/DAC
	COMM_SERIAL_ADC_READ		= 'c',
	COMM_SERIAL_DAC_WRITE		= 'd',

	// Comandos asociados al display LCD
	COMM_SERIAL_LCD_WRITE_BYTE 	= 'e',
	COMM_SERIAL_LCD_WRITE_STRING= 'f',

	// Comandos asociados al display LCD
	COMM_SERIAL_7SEG_WRITE 		= 'g',

	// Comandos asociados al display LCD
	COMM_SERIAL_MOTOR_RIGHT		= 'h',
	COMM_SERIAL_MOTOR_LEFT 		= 'i',
} VirtualCommand_t;

typedef enum VirtualCommandType {
	COMM_SERIAL_REQUEST = '0',
	COMM_SERIAL_RESPONSE = '1'
} VirtualCommandType_t;

typedef enum VirtualPeriphericalMap {

	// Valores corespondientes a las teclas bluetooth
	V_LEDR = 'a',
	V_LEDG = 'b',
	V_LED1 = 'c',
	V_LED2 = 'd',
	V_LED3 = 'e',
	V_LED4 = 'f',

	// Valores corespondientes a las teclas bluetooth
	V_TEC1 = 'g',
	V_TEC2 = 'h',
	V_TEC3 = 'i',
	V_TEC4 = 'j',

	// Valores coorespondientes a los pines ADC
	V_ADC_CH1 = 'k',

	// Valores coorespondientes a los pines DAC
	V_DAC_CH1 = 'n',

	// Valores coorespondientes al periferico LCD
	V_LCD1 = 'o',

	// Valores coorespondientes al periferico 7 segmentos
	V_7SEG = 'p',

} VirtualPeriphericalMap_t;

/*==================[external data declaration]==============================*/

/*==================[external functions declaration]=========================*/

bool_t		vBoardConfig    (uartMap_t uartMap, uint32_t baudRate);

bool_t		vGpioRead				(VirtualPeriphericalMap_t bluetoothPin);
void		vGpioWrite				(VirtualPeriphericalMap_t bluetoothPin, bool_t pinState);
void		vGpioToggle				(VirtualPeriphericalMap_t bluetoothPin);

void		vLcdWriteByte		(VirtualPeriphericalMap_t display, LcdLine_t lcdLine, char byteToWrite);
void		vLcdWriteString		(VirtualPeriphericalMap_t display, LcdLine_t lcdLine, char * stringToWrite);

uint8_t		vAdcRead				(VirtualPeriphericalMap_t adcChannel);
void		vDacWrite        (VirtualPeriphericalMap_t dacChannel, uint16_t dacValue);

void		v7SegmentsWrite  (VirtualPeriphericalMap_t display, uint8_t valueToShow);

/*==================[cplusplus]==============================================*/

#ifdef __cplusplus
}
#endif

/*==================[end of file]============================================*/
#endif /* #ifndef _APP_PONCHO_BOARD_H_ */
