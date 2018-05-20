
#ifndef _APP_PONCHO_BOARD_H_
#define _APP_PONCHO_BOARD_H_

/*==================[inclusions]=============================================*/

#include "sapi.h"      // <= sAPI header

/*==================[cplusplus]==============================================*/

#ifdef __cplusplus
extern "C" {
#endif

/*==================[macros]=================================================*/

#define BAUD_RATE_BLUETOOTH		9600

/** Estados logicos de las teclas y leds de la APP. */
#define BT_LOW					104//'l'
#define BT_HIGH					108//'h'

/** Tiempo maximo de espera por una respuesta. */
#define BT_MAX_TIMES_TO_WAIT_RESPONSE		30

/*==================[typedef]================================================*/

typedef enum BluetoothCommand {
	//Comandos asociados a GPIO
	COMMAND_GPIO_READ 		= 103,//'g',
	COMMAND_GPIO_WRITE 		= 115,//'s',

	//Comandos asociados al ADC/DAC
	COMMAND_ADC_READ		= 114,//'r',
	COMMAND_DAC_WRITE		= 100,//'d',

	// Comandos asociados al display LCD
	COMMAND_LCD_WRITE_BYTE 	= 109,//'m',
	COMMAND_LCD_WRITE_STRING= 99,//'c',

	// Comandos asociados al display LCD
	COMMAND_7SEG_WRITE 		= 55,//'7',

	// Comandos asociados al display LCD
	COMMAND_MOTOR_RIGHT		= 43,//'+',
	COMMAND_MOTOR_LEFT 		= 45,//'-',
} BluetoothCommand_t;

typedef enum BluetoothModule {
	BT_MODULE_HC05,
	BT_MODULE_HC06
} BluetoothModule_t;

typedef enum BluetoothPeriphericalMap {

	// Valores corespondientes a las teclas bluetooth
	BT_LEDR = 113,//'q',
	BT_LEDG = 119,//'w',
	BT_LEDB = 101,//'e',
	BT_LED1 = 114,//'r',
	BT_LED2 = 116,//'t',
	BT_LED3 = 121,//'y',

	// Valores corespondientes a las teclas bluetooth
	BT_TEC1 = 97,//'1',
	BT_TEC2 = 115,//'2',
	BT_TEC3 = 100,//'3',
	BT_TEC4 = 102,//'4',

	// Valores coorespondientes a los pines ADC
	BT_CH1 = 122,//'z',
	BT_CH2 = 120,//'x',
	BT_CH3 = 99,//'y',

	// Valores coorespondientes a los pines DAC
	BT_DAC1 = 117,//'v',

	// Valores coorespondientes al periferico LCD
	BT_LCD1 = 111,//'o',

	// Valores coorespondientes al periferico 7 segmentos
	BT_7SEG = 70,//'p',

	// Valores coorespondientes a los motores
	BT_MOTOR1 = 106,//'v',
	BT_MOTOR2 = 107,//'k',
	BT_MOTOR3 = 108,//'l',

} BluetoothPeriphericalMap_t;

/*==================[external data declaration]==============================*/

/*==================[external functions declaration]=========================*/

bool_t		appPonchoConfig					(BluetoothModule_t bluetoothModule, uartMap_t uartMap, uint32_t baudRate);

//bool_t		appPonchoGpioRead				(BluetoothPeriphericalMap_t bluetoothPin, bool_t * pinState);
bool_t		appPonchoGpioRead				(BluetoothPeriphericalMap_t bluetoothPin);
void		appPonchoGpioWrite				(BluetoothPeriphericalMap_t bluetoothPin, bool_t pinState);
void		appPonchoGpioToggle				(BluetoothPeriphericalMap_t bluetoothPin);

void		appPonchoDisplayWriteByte		(BluetoothPeriphericalMap_t display, char byteToWrite);
void		appPonchoDisplayWriteString		(BluetoothPeriphericalMap_t display, char * stringToWrite);

uint8_t		appPonchoAdcRead				(BluetoothPeriphericalMap_t adcChannel);
void		appPonchoDacWrite				(BluetoothPeriphericalMap_t dacChannel, uint8_t dacValue);

void		appPoncho7SegmentsWrite			(BluetoothPeriphericalMap_t display, uint8_t valueToShow);

/*==================[cplusplus]==============================================*/

#ifdef __cplusplus
}
#endif

/*==================[end of file]============================================*/
#endif /* #ifndef _APP_PONCHO_BOARD_H_ */
