
/*==================[inclusions]=============================================*/

#include "appPoncho_board.h"

/*==================[macros and definitions]=================================*/

#define COMMAND_INIT        '{'
#define COMMAND_END         '}'
#define COMMAND_SEPARATOR   ';'
#define LINE_END            '\0'

#define MAX_ANALOG_VALUE    1023
#define DELAY_BETWEEN_COMMANDS 50

/*==================[internal data declaration]==============================*/

static uartMap_t UartVirtual;

/*==================[internal functions declaration]=========================*/

static void myDelay (uint32_t delayMs);
static void    myUartWriteByte (uint8_t byteToWrite);
static void myUartWriteString (char * string);
static uint8_t myUartReadByte  (void);
static bool_t CheckIfValidCommand (VirtualCommand_t command, VirtualPeriphericalMap_t perMap);
static bool_t AnalogToString (int numberToConver, char * stringNumber);

/*==================[internal data definition]===============================*/

/*==================[external data definition]===============================*/

/*==================[internal functions definition]==========================*/

static bool_t AnalogToString (int numberToConver, char * stringNumber){
	bool_t error = FALSE;
	uint8_t thousands = 0;
	uint8_t hundreds = 0;
	uint8_t tens = 0;
	uint8_t units = 0;

	if (numberToConver <= MAX_ANALOG_VALUE){
		thousands = numberToConver / 1000;
		hundreds = numberToConver / 100;
		if (hundreds >= 10){
			hundreds = 0;
		}
		tens = (numberToConver - ( (thousands * 1000) + (hundreds * 100) ) ) / 10 ;
		units = (numberToConver - ((thousands * 1000) + (hundreds * 100) + (tens * 10)));

		stringNumber[0] = thousands + '0';
		stringNumber[1] = hundreds + '0';
		stringNumber[2] = tens + '0';
		stringNumber[3] = units + '0';
		stringNumber[4] ='\0';
	} else {
		error = TRUE;
	}

	return !error;
}

static void myDelay (uint32_t delayMs){
	delay(delayMs);
}

static void myUartWriteByte(uint8_t byteToWrite){
	uartWriteByte(UartVirtual, (uint8_t) byteToWrite);
}

static uint8_t myUartReadByte(){
	static uint8_t byteReaded = 0;

	uartReadByte(UartVirtual, &byteReaded);
	delay(5);

	return byteReaded;
}

static void myUartWriteString (char * string){
	uartWriteString(UartVirtual, string);
}

/**
 * Envia el comando a la APP para realizar la accion solicitada por el usuario.
 * Chequea ademas, que para la accion solicitada, el usuario haya seleccionado
 * un perihpericalMap correcto. Por ejemplo seria incorrecto ejecutar el commando
 * COMMAND_GPIO_READ sobre el periferico BT_LCD1
 * @param command el posile comando a enviar (de la estructura de este archivo).
 * @param perMap el perihperical mal sobre el que se ejecutara la accion
 * @return TRUE si el periferico es soportado por el comando, FALSE en caso contrario.
 */
static bool_t CheckIfValidCommand (VirtualCommand_t command, VirtualPeriphericalMap_t perMap){
	bool_t isValidCommand = FALSE;
	if (command == COMM_SERIAL_GPIO_READ){
		if (perMap == V_TEC1 || perMap == V_TEC2 || perMap == V_TEC3 || perMap == V_TEC4){
			isValidCommand = TRUE;
		}
		//		if (perMap == V_LEDR || perMap == V_LEDG || perMap == V_LEDB || perMap == V_LED1 || perMap == V_LED2 || perMap == V_LED3){
		if (perMap == V_LEDR || perMap == V_LEDG || perMap == V_LEDB || perMap == V_LED1 || perMap == V_LED2 || perMap == V_LED3 || perMap == V_LED4){
			isValidCommand = TRUE;
		}
	} else if	(command == COMM_SERIAL_GPIO_WRITE){
		//		if (perMap == V_LEDR || perMap == V_LEDG || perMap == V_LEDB || perMap == V_LED1 || perMap == V_LED2 || perMap == V_LED3){
		if (perMap == V_LEDR || perMap == V_LEDG || perMap == V_LEDB || perMap == V_LED1 || perMap == V_LED2 || perMap == V_LED3 || perMap == V_LED4){
			isValidCommand = TRUE;
		}
	} else if	(command == COMM_SERIAL_ADC_READ){
		//		if (perMap == V_ADC_CH1 || perMap == V_CH2 || perMap == V_CH3){
		if (perMap == V_ADC_CH1){
			isValidCommand = TRUE;
		}
	} else if	(command == COMM_SERIAL_DAC_WRITE){
		if (perMap == V_DAC_CH1){
			isValidCommand = TRUE;
		}
	} else if	(command == COMM_SERIAL_LCD_WRITE_BYTE || command == COMM_SERIAL_LCD_WRITE_STRING){
		if (perMap == V_LCD1){
			isValidCommand = TRUE;
		}
	} else if	(command == COMM_SERIAL_7SEG_WRITE){
		if (perMap == V_7SEG){
			isValidCommand = TRUE;
		}
	} else if	(command == COMM_SERIAL_MOTOR_LEFT || command == COMM_SERIAL_MOTOR_RIGHT){
		//		if (perMap == V_MOTOR1 || perMap == V_MOTOR2 || perMap == V_MOTOR3){
		//			sendCommand = TRUE;
		//		}
	}
	return isValidCommand;
}

/*==================[external functions definition]==========================*/

bool_t   vBoardConfig    (uartMap_t uartMap, uint32_t baudRate){
	UartVirtual = uartMap;
	uartConfig(UartVirtual, baudRate);
	return TRUE;
}

void     vGpioWrite      (VirtualPeriphericalMap_t virtualGpioPin, bool_t pinState){
	char stringCommand [10];

	if (CheckIfValidCommand(COMM_SERIAL_GPIO_WRITE, virtualGpioPin)){
		stringCommand[0] = COMMAND_INIT;
		stringCommand[1] = COMM_SERIAL_GPIO_WRITE;
		stringCommand[2] = COMMAND_SEPARATOR;
		stringCommand[3] = virtualGpioPin;
		stringCommand[4] = COMMAND_SEPARATOR;
		stringCommand[5] = pinState == TRUE? V_GPIO_HIGH : V_GPIO_LOW;
		stringCommand[6] = COMMAND_END;
		stringCommand[7] = '\n';
		stringCommand[8] = '\0';

		myUartWriteString(stringCommand);
	}
}

void     vDacWrite       (VirtualPeriphericalMap_t dacChannel, uint16_t dacValue){
	char stringCommand [15];
	char analogString[5];

	if (CheckIfValidCommand(COMM_SERIAL_DAC_WRITE, dacChannel)){
		if (AnalogToString(dacValue, analogString)){
			stringCommand[0] = COMMAND_INIT;
			stringCommand[1] = COMM_SERIAL_DAC_WRITE;
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

			myUartWriteString(stringCommand);
		}
	}
}

void     v7SegmentsWrite (VirtualPeriphericalMap_t display, uint8_t valueToShow){
	char stringCommand [10];

	if (CheckIfValidCommand(COMM_SERIAL_7SEG_WRITE, display)){
		stringCommand[0] = COMMAND_INIT;
		stringCommand[1] = COMM_SERIAL_7SEG_WRITE;
		stringCommand[2] = COMMAND_SEPARATOR;
		stringCommand[3] = display;
		stringCommand[4] = COMMAND_SEPARATOR;
		stringCommand[5] = valueToShow;
		stringCommand[6] = COMMAND_END;
		stringCommand[7] = '\n';
		stringCommand[8] = '\0';

		myUartWriteString(stringCommand);
	}
}

void vLcdWriteString		(VirtualPeriphericalMap_t display, LcdLine_t lcdLine, char * stringToWrite){
	uint8_t i = 0;
	uint8_t lenght = 0;
	char stringCommand [70];

	if (CheckIfValidCommand(COMM_SERIAL_LCD_WRITE_STRING, display)){

		for (lenght = 0; stringToWrite[lenght] != '\0'; lenght++);

		stringCommand[0] = COMMAND_INIT;
		stringCommand[1] = COMM_SERIAL_LCD_WRITE_STRING;
		stringCommand[2] = COMMAND_SEPARATOR;
		stringCommand[3] = display;
		stringCommand[4] = COMMAND_SEPARATOR;
		stringCommand[5] = lcdLine;
		stringCommand[6] = COMMAND_SEPARATOR;

		for (i = 0; i < lenght; i++){
			stringCommand [i + 7] = stringToWrite[i];
		}

		stringCommand[7 + lenght] = COMMAND_END;
		stringCommand[8 + lenght] = '\n';
		stringCommand[9 + lenght] = '\0';

		myUartWriteString(stringCommand);
	}
}

bool_t   vGpioRead       (VirtualPeriphericalMap_t virtualGpioPin){
	char stringCommand [10];
	bool_t pinState = TRUE;
	uint8_t dataSerial  = 0;
	uint8_t counter = 0;
	uint8_t i = 0;

	if (CheckIfValidCommand(COMM_SERIAL_GPIO_READ, virtualGpioPin)){
		stringCommand[0] = COMMAND_INIT;
		stringCommand[1] = COMM_SERIAL_GPIO_READ;
		stringCommand[2] = COMMAND_SEPARATOR;
		stringCommand[3] = virtualGpioPin;
		stringCommand[4] = COMMAND_SEPARATOR;
		stringCommand[5] = COMM_SERIAL_REQUEST;
		stringCommand[6] = COMMAND_END;
		stringCommand[7] = '\n';
		stringCommand[8] = '\0';

		myUartWriteString(stringCommand);

		// limpia el buffer
		bzero(stringCommand, 10);

		// Espera a recibir data por un tiempo determinado
		while (++counter < 1000){
			if( (dataSerial = myUartReadByte()) != 0 ){
				stringCommand[i] = dataSerial;
				if (stringCommand[i] == '}'){
					break;
				}
				i++;
			}
			delay(2);
		}

		// chequea si salio por timeout
		if (counter < 1000){
			// chequea que todos lo que haya llegado sea una respuesta correcta
			if (	stringCommand[0] == COMMAND_INIT &&
					stringCommand[1] == COMM_SERIAL_GPIO_READ &&
					stringCommand[2] == COMMAND_SEPARATOR &&
					//					stringCommand[3] == virtualGpioPin &&
					stringCommand[4] == COMMAND_SEPARATOR &&
					stringCommand[5] == COMM_SERIAL_RESPONSE &&
					stringCommand[6] == COMMAND_SEPARATOR &&
					(stringCommand[7] == V_GPIO_LOW || stringCommand[7] == V_GPIO_HIGH) ){
				pinState = stringCommand[7] - '0';
			}
		}
	}
	myDelay(DELAY_BETWEEN_COMMANDS);

	return pinState;
}


void     vGpioToggle     (VirtualPeriphericalMap_t virtualGpioPin){
	vGpioWrite(virtualGpioPin, !vGpioRead(virtualGpioPin));
}

uint16_t   vAdcRead       (VirtualPeriphericalMap_t virtualAdcPin){
	char stringCommand [15];
	static uint16_t adcValue = 0;
	uint8_t dataSerial  = 0;
	uint8_t counter = 0;
	uint8_t i = 0;

	if (CheckIfValidCommand(COMM_SERIAL_ADC_READ, virtualAdcPin)){
		stringCommand[0] = COMMAND_INIT;
		stringCommand[1] = COMM_SERIAL_ADC_READ;
		stringCommand[2] = COMMAND_SEPARATOR;
		stringCommand[3] = virtualAdcPin;
		stringCommand[4] = COMMAND_SEPARATOR;
		stringCommand[5] = COMM_SERIAL_REQUEST;
		stringCommand[6] = COMMAND_END;
		stringCommand[7] = '\n';
		stringCommand[8] = '\0';

		myUartWriteString(stringCommand);

		// limpia el buffer
		bzero(stringCommand, 15);

		// Espera a recibir data por un tiempo determinado
		while (++counter < 1000 && i < 14){
			if( (dataSerial = myUartReadByte()) != 0 ){
				stringCommand[i] = dataSerial;
				if (stringCommand[i] == '}'){
					break;
				}
				i++;
			}
			delay(2);
		}

		// chequea si salio por timeout
		if (i == 11 && counter < 1000){
			// chequea que todos lo que haya llegado sea una respuesta correcta
			if (	stringCommand[0] == COMMAND_INIT &&
					stringCommand[1] == COMM_SERIAL_ADC_READ &&
					stringCommand[2] == COMMAND_SEPARATOR &&
					stringCommand[3] == virtualAdcPin &&
					stringCommand[4] == COMMAND_SEPARATOR &&
					stringCommand[5] == COMM_SERIAL_RESPONSE &&
					stringCommand[6] == COMMAND_SEPARATOR &&
					stringCommand[11] == COMMAND_END ){
				adcValue = 0;
				// unidades de mil
				adcValue += (stringCommand[7] - '0') * 1000;
				// centenas
				adcValue += (stringCommand[8] - '0') * 100;
				// decenas
				adcValue += (stringCommand[9] - '0') * 10;
				// unidades
				adcValue += (stringCommand[10] - '0');

				if (adcValue > MAX_ANALOG_VALUE){
					adcValue = MAX_ANALOG_VALUE;
				} else if (adcValue < 0){
					adcValue = 0;
				}
			}
		}
	}
	myDelay(DELAY_BETWEEN_COMMANDS);

	return adcValue;
}




/*==================[end of file]============================================*/

//void     vLcdWriteByte   (VirtualPeriphericalMap_t display, char byteToWrite){
//	if (SendVirtualCommand(COMM_SERIAL_LCD_WRITE_BYTE, display)){
//		uartWriteByte(UartVirtual, display);
//		uartWriteByte(UartVirtual, byteToWrite);
//	}
//	delay (BETWEEN_COMMANDS_DELAY);
//}
