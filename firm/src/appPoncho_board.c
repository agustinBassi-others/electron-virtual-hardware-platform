
/*==================[inclusions]=============================================*/

//#include "sapi.h"      // <= sAPI header
#include "appPoncho_board.h"

/*==================[macros and definitions]=================================*/

#define BETWEEN_COMMANDS_DELAY	105
#define COMMAND_INIT              "{"
#define COMMAND_END               "}"
#define COMMAND_SEPARATOR         ";"

/*==================[internal data declaration]==============================*/

static uartMap_t UartVirtual;

/*==================[internal functions declaration]=========================*/

//static bool_t SendVirtualCommand		(VirtualCommand_t command, VirtualPeriphericalMap_t periphericalMap);

static void myUartWriteByte(uint8_t byteToWrite);
static uint8_t myUartReadByte();

static bool_t IsGpio(VirtualPeriphericalMap_t periphericalMap);

/*==================[internal data definition]===============================*/

/*==================[external data definition]===============================*/

/*==================[external functions definition]==========================*/

bool_t   vBoardConfig    (uartMap_t uartMap, uint32_t baudRate){
	// Configura la UART
	UartVirtual = uartMap;
	uartConfig(UartVirtual, baudRate);
	//todo: devolver el estado de la conexion.
	return TRUE;
}

bool_t   vGpioRead       (VirtualPeriphericalMap_t bluetoothPin){
//	bool_t bluetoothCommunicationSucces = FALSE;
	bool_t pinBluetoothState = FALSE;
	uint8_t dataBluetooth  = 0, counter = 0;

	if (SendVirtualCommand(COMM_SERIAL_GPIO_READ, bluetoothPin)){
		// Envia a la APP el pin (boton android) que quiere leer.
		uartWriteByte( UartVirtual, bluetoothPin );
//		while (++counter < BT_MAX_TIMES_TO_WAIT_RESPONSE && bluetoothCommunicationSucces == FALSE){
		while (++counter < BT_MAX_TIMES_TO_WAIT_RESPONSE){
			if(uartReadByte( UartVirtual, &dataBluetooth)){
//				if (dataBluetooth == BT_LOW || dataBluetooth == BT_HIGH){
////					bluetoothCommunicationSucces = TRUE;
//					*pinBluetoothState = dataBluetooth;
//				}
				if (dataBluetooth == VIRTUAL_GPIO_LOW){
					pinBluetoothState = FALSE;
				} else if (dataBluetooth == VIRTUAL_GPIO_HIGH){
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

void     vGpioWrite      (VirtualPeriphericalMap_t virtualGpioPin, bool_t pinState){

	if (IsGpio(virtualGpioPin)){
		char stringCommand [10];

//		myUartWriteByte(COMMAND_INIT);
//		myUartWriteByte(COMM_SERIAL_GPIO_WRITE);
//		myUartWriteByte(COMMAND_SEPARATOR);
//		myUartWriteByte(virtualGpioPin);
//		myUartWriteByte(COMMAND_SEPARATOR);
//		myUartWriteByte(pinState == TRUE? VIRTUAL_GPIO_HIGH : VIRTUAL_GPIO_LOW);
//		myUartWriteByte(COMMAND_END);
//		myUartWriteByte('\n');

		stringCommand[0] = COMMAND_INIT;
		stringCommand[1] = COMM_SERIAL_GPIO_WRITE;
		stringCommand[2] = COMMAND_SEPARATOR;
		stringCommand[3] = virtualGpioPin;
		stringCommand[4] = COMMAND_SEPARATOR;
		stringCommand[5] = pinState == TRUE? VIRTUAL_GPIO_HIGH : VIRTUAL_GPIO_LOW;
		stringCommand[6] = COMMAND_END;
		stringCommand[7] = '\n';
		stringCommand[8] = '\0';

		uartWriteString(UartVirtual, stringCommand);
	}
}
//
//void     vGpioToggle     (VirtualPeriphericalMap_t bluetoothPin){
//uint8_t state = VIRTUAL_GPIO_LOW;
//
////	appPonchoGpioRead(bluetoothPin, &state);
////	if (state == BT_HIGH){
////		state = BT_LOW;
////	} else{
////		state = BT_HIGH;
////	}
//	vGpioWrite(bluetoothPin, !vGpioRead(bluetoothPin));
//}
//
//void     vLcdWriteByte   (VirtualPeriphericalMap_t display, char byteToWrite){
//	if (SendVirtualCommand(COMM_SERIAL_LCD_WRITE_BYTE, display)){
//		uartWriteByte(UartVirtual, display);
//		uartWriteByte(UartVirtual, byteToWrite);
//	}
//	delay (BETWEEN_COMMANDS_DELAY);
//}
//
////todo; pensando en un protocolo quiza hace falta mandar el hardware a leer/escribir previo a mandar el mensaje
//void     vLcdWriteString (VirtualPeriphericalMap_t display, char * stringToWrite){
//	if (SendVirtualCommand(COMM_SERIAL_LCD_WRITE_STRING, display)){
//		uartWriteByte(UartVirtual, display);
//		uartWriteString(UartVirtual, stringToWrite);
//	}
//	delay (BETWEEN_COMMANDS_DELAY);
//}
//
//uint8_t  vAdcRead        (VirtualPeriphericalMap_t adcChannel){
//uint8_t adcBluetoothValue  = 0, counter = 0;
//bool_t bluetoothCommunicationSucces = FALSE;
//
//	if (SendVirtualCommand(COMM_SERIAL_ADC_READ, adcChannel)){
//		uartWriteByte( UartVirtual, adcChannel );
////		while (++counter < BT_MAX_TIMES_TO_WAIT_RESPONSE && bluetoothCommunicationSucces == FALSE){
//		while (++counter < BT_MAX_TIMES_TO_WAIT_RESPONSE){
//			if(uartReadByte( UartVirtual, &adcBluetoothValue)){
////				bluetoothCommunicationSucces = TRUE;
//				break;
//			}
//			delay(10);
//		}
//	}
//	delay (BETWEEN_COMMANDS_DELAY);
//	return adcBluetoothValue;
//}
//
//void     vDacWrite       (VirtualPeriphericalMap_t dacChannel, uint8_t dacValue){
//	if (SendVirtualCommand(COMM_SERIAL_DAC_WRITE, dacChannel)){
//		uartWriteByte(UartVirtual, dacChannel);
//		uartWriteByte(UartVirtual, dacValue);
//	}
//	delay (BETWEEN_COMMANDS_DELAY);
//}
//
//void     v7SegmentsWrite (VirtualPeriphericalMap_t display, uint8_t valueToShow){
//	if (SendVirtualCommand(COMM_SERIAL_7SEG_WRITE, display)){
//		uartWriteByte(UartVirtual, display);
//		uartWriteByte(UartVirtual, valueToShow);
//	}
//	delay (BETWEEN_COMMANDS_DELAY);
//}

/*==================[internal functions definition]==========================*/

static void myUartWriteByte(uint8_t byteToWrite){
	uartWriteByte(UartVirtual, byteToWrite);
}

static uint8_t myUartReadByte(){
	static uint8_t byteReaded = 0;

	uartReadByte(UartVirtual, &byteReaded);

	return byteReaded;
}

static bool_t IsGpio(VirtualPeriphericalMap_t periphericalMap){
	bool_t isGpio = FALSE;
	if (
			periphericalMap == V_LEDR ||
			periphericalMap == V_LEDG ||
			periphericalMap == V_LED1 ||
			periphericalMap == V_LED2 ||
			periphericalMap == V_LED3 ||
			periphericalMap == V_LED4 ||
			periphericalMap == V_TEC1 ||
			periphericalMap == V_TEC2 ||
			periphericalMap == V_TEC3 ||
			periphericalMap == V_TEC4
			){
		isGpio = TRUE;
	}
	return isGpio;
}

/**
// * Envia el comando a la APP para realizar la accion solicitada por el usuario.
// * Chequea ademas, que para la accion solicitada, el usuario haya seleccionado
// * un perihpericalMap correcto. Por ejemplo seria incorrecto ejecutar el commando
// * COMMAND_GPIO_READ sobre el periferico BT_LCD1
// * @param command el posile comando a enviar (de la estructura de este archivo).
// * @param perMap el perihperical mal sobre el que se ejecutara la accion
// * @return TRUE si el periferico es soportado por el comando, FALSE en caso contrario.
// */
//static bool_t SendVirtualCommand		(VirtualCommand_t command, VirtualPeriphericalMap_t perMap){
//bool_t sendCommand = FALSE;
//	if			(command == COMM_SERIAL_GPIO_READ){
//		if (perMap == V_TEC1 || perMap == V_TEC2 || perMap == V_TEC3 || perMap == V_TEC4){
//			sendCommand = TRUE;
//		}
//		if (perMap == V_LEDR || perMap == V_LEDG || perMap == V_LEDB || perMap == V_LED1 || perMap == V_LED2 || perMap == V_LED3){
//			sendCommand = TRUE;
//		}
//	} else if	(command == COMM_SERIAL_GPIO_WRITE){
//		if (perMap == V_LEDR || perMap == V_LEDG || perMap == V_LEDB || perMap == V_LED1 || perMap == V_LED2 || perMap == V_LED3){
//			sendCommand = TRUE;
//		}
//	} else if	(command == COMM_SERIAL_ADC_READ){
//		if (perMap == V_ADC_CH1 || perMap == V_CH2 || perMap == V_CH3){
//			sendCommand = TRUE;
//		}
//	} else if	(command == COMM_SERIAL_DAC_WRITE){
//		if (perMap == V_DAC_CH1){
//			sendCommand = TRUE;
//		}
//	} else if	(command == COMM_SERIAL_LCD_WRITE_BYTE || command == COMM_SERIAL_LCD_WRITE_STRING){
//		if (perMap == V_LCD1){
//			sendCommand = TRUE;
//		}
//	} else if	(command == COMM_SERIAL_7SEG_WRITE){
//		if (perMap == V_7SEG){
//			sendCommand = TRUE;
//		}
//	} else if	(command == COMM_SERIAL_MOTOR_LEFT || command == COMM_SERIAL_MOTOR_RIGHT){
//		if (perMap == V_MOTOR1 || perMap == V_MOTOR2 || perMap == V_MOTOR3){
//			sendCommand = TRUE;
//		}
//	}
//	if (sendCommand){
//		uartWriteByte(UartVirtualHardPlatform, command);
//	}
//	return sendCommand;
//}

/*==================[end of file]============================================*/
