
/*==================[inclusions]=============================================*/

//#include "sapi.h"      // <= sAPI header
#include "appPoncho_board.h"

/*==================[macros and definitions]=================================*/

#define BETWEEN_COMMANDS_DELAY	105

/*==================[internal data declaration]==============================*/

static uartMap_t UART_BT;

/*==================[internal functions declaration]=========================*/

static bool_t SendBluetoothCommand		(BluetoothCommand_t command, BluetoothPeriphericalMap_t periphericalMap);

/*==================[internal data definition]===============================*/

/*==================[external data definition]===============================*/

/*==================[external functions definition]==========================*/

bool_t	appPonchoConfig				(BluetoothModule_t bluetoothModule, uartMap_t uartMap, uint32_t baudRate){
	// Configura la UART
	UART_BT = uartMap;
	uartConfig(uartMap, baudRate);
	//todo: devolver el estado de la conexion.
	return TRUE;
}

//bool_t	appPonchoGpioRead			(BluetoothPeriphericalMap_t bluetoothPin, bool_t * pinBluetoothState){
bool_t		appPonchoGpioRead				(BluetoothPeriphericalMap_t bluetoothPin){
//	bool_t bluetoothCommunicationSucces = FALSE;
	bool_t pinBluetoothState = FALSE;
	uint8_t dataBluetooth  = 0, counter = 0;

	if (SendBluetoothCommand(COMMAND_GPIO_READ, bluetoothPin)){
		// Envia a la APP el pin (boton android) que quiere leer.
		uartWriteByte( UART_BT, bluetoothPin );
//		while (++counter < BT_MAX_TIMES_TO_WAIT_RESPONSE && bluetoothCommunicationSucces == FALSE){
		while (++counter < BT_MAX_TIMES_TO_WAIT_RESPONSE){
			if(uartReadByte( UART_BT, &dataBluetooth)){
//				if (dataBluetooth == BT_LOW || dataBluetooth == BT_HIGH){
////					bluetoothCommunicationSucces = TRUE;
//					*pinBluetoothState = dataBluetooth;
//				}
				if (dataBluetooth == BT_LOW){
					pinBluetoothState = FALSE;
				} else if (dataBluetooth == BT_HIGH){
					pinBluetoothState = TRUE;
				}
				break;
			}
			delay(10);
		}
	}
	delay (BETWEEN_COMMANDS_DELAY);
//	return bluetoothCommunicationSucces;
	return pinBluetoothState;
}

void	appPonchoGpioWrite			(BluetoothPeriphericalMap_t bluetoothPin, bool_t pinState){

	if (!pinState){
		pinState = BT_LOW;
	} else {
		pinState = BT_HIGH;
	}
	if (SendBluetoothCommand(COMMAND_GPIO_WRITE, bluetoothPin)){
		uartWriteByte(UART_BT, bluetoothPin);
		uartWriteByte(UART_BT, pinState);
	}
	delay (BETWEEN_COMMANDS_DELAY);
}

void	appPonchoGpioToggle			(BluetoothPeriphericalMap_t bluetoothPin){
uint8_t state = BT_LOW;

//	appPonchoGpioRead(bluetoothPin, &state);
//	if (state == BT_HIGH){
//		state = BT_LOW;
//	} else{
//		state = BT_HIGH;
//	}
	appPonchoGpioWrite(bluetoothPin, !appPonchoGpioRead(bluetoothPin));
}

void	appPonchoDisplayWriteByte		(BluetoothPeriphericalMap_t display, char byteToWrite){
	if (SendBluetoothCommand(COMMAND_LCD_WRITE_BYTE, display)){
		uartWriteByte(UART_BT, display);
		uartWriteByte(UART_BT, byteToWrite);
	}
	delay (BETWEEN_COMMANDS_DELAY);
}

//todo; pensando en un protocolo quiza hace falta mandar el hardware a leer/escribir previo a mandar el mensaje
void	appPonchoDisplayWriteString		(BluetoothPeriphericalMap_t display, char * stringToWrite){
	if (SendBluetoothCommand(COMMAND_LCD_WRITE_STRING, display)){
		uartWriteByte(UART_BT, display);
		uartWriteString(UART_BT, stringToWrite);
	}
	delay (BETWEEN_COMMANDS_DELAY);
}

uint8_t		appPonchoAdcRead		(BluetoothPeriphericalMap_t adcChannel){
uint8_t adcBluetoothValue  = 0, counter = 0;
bool_t bluetoothCommunicationSucces = FALSE;

	if (SendBluetoothCommand(COMMAND_ADC_READ, adcChannel)){
		uartWriteByte( UART_BT, adcChannel );
//		while (++counter < BT_MAX_TIMES_TO_WAIT_RESPONSE && bluetoothCommunicationSucces == FALSE){
		while (++counter < BT_MAX_TIMES_TO_WAIT_RESPONSE){
			if(uartReadByte( UART_BT, &adcBluetoothValue)){
//				bluetoothCommunicationSucces = TRUE;
				break;
			}
			delay(10);
		}
	}
	delay (BETWEEN_COMMANDS_DELAY);
	return adcBluetoothValue;
}

void		appPonchoDacWrite		(BluetoothPeriphericalMap_t dacChannel, uint8_t dacValue){
	if (SendBluetoothCommand(COMMAND_DAC_WRITE, dacChannel)){
		uartWriteByte(UART_BT, dacChannel);
		uartWriteByte(UART_BT, dacValue);
	}
	delay (BETWEEN_COMMANDS_DELAY);
}

void		appPoncho7SegmentsWrite			(BluetoothPeriphericalMap_t display, uint8_t valueToShow){
	if (SendBluetoothCommand(COMMAND_7SEG_WRITE, display)){
		uartWriteByte(UART_BT, display);
		uartWriteByte(UART_BT, valueToShow);
	}
	delay (BETWEEN_COMMANDS_DELAY);
}

/*==================[internal functions definition]==========================*/

/**
 * Envia el comando a la APP para realizar la accion solicitada por el usuario.
 * Chequea ademas, que para la accion solicitada, el usuario haya seleccionado
 * un perihpericalMap correcto. Por ejemplo seria incorrecto ejecutar el commando
 * COMMAND_GPIO_READ sobre el periferico BT_LCD1
 * @param command el posile comando a enviar (de la estructura de este archivo).
 * @param perMap el perihperical mal sobre el que se ejecutara la accion
 * @return TRUE si el periferico es soportado por el comando, FALSE en caso contrario.
 */
static bool_t SendBluetoothCommand		(BluetoothCommand_t command, BluetoothPeriphericalMap_t perMap){
bool_t sendCommand = FALSE;
	if			(command == COMMAND_GPIO_READ){
		if (perMap == BT_TEC1 || perMap == BT_TEC2 || perMap == BT_TEC3 || perMap == BT_TEC4){
			sendCommand = TRUE;
		}
		if (perMap == BT_LEDR || perMap == BT_LEDG || perMap == BT_LEDB || perMap == BT_LED1 || perMap == BT_LED2 || perMap == BT_LED3){
			sendCommand = TRUE;
		}
	} else if	(command == COMMAND_GPIO_WRITE){
		if (perMap == BT_LEDR || perMap == BT_LEDG || perMap == BT_LEDB || perMap == BT_LED1 || perMap == BT_LED2 || perMap == BT_LED3){
			sendCommand = TRUE;
		}
	} else if	(command == COMMAND_ADC_READ){
		if (perMap == BT_CH1 || perMap == BT_CH2 || perMap == BT_CH3){
			sendCommand = TRUE;
		}
	} else if	(command == COMMAND_DAC_WRITE){
		if (perMap == BT_DAC1){
			sendCommand = TRUE;
		}
	} else if	(command == COMMAND_LCD_WRITE_BYTE || command == COMMAND_LCD_WRITE_STRING){
		if (perMap == BT_LCD1){
			sendCommand = TRUE;
		}
	} else if	(command == COMMAND_7SEG_WRITE){
		if (perMap == BT_7SEG){
			sendCommand = TRUE;
		}
	} else if	(command == COMMAND_MOTOR_LEFT || command == COMMAND_MOTOR_RIGHT){
		if (perMap == BT_MOTOR1 || perMap == BT_MOTOR2 || perMap == BT_MOTOR3){
			sendCommand = TRUE;
		}
	}
	if (sendCommand){
		uartWriteByte(UART_BT, command);
	}
	return sendCommand;
}

/*==================[end of file]============================================*/
