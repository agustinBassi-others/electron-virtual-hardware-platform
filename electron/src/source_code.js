// Library required for read files.
fs = require('fs');

// Relative path of project.
const HTML_SOURCE_CODE = __dirname + '/' + 'source_code.html';

// Read the content of file and save it in a variable.
var HtmlSourceCode = fs.readFileSync(HTML_SOURCE_CODE, 'utf8');

// Write to HTML document the content recently readed.
document.write(HtmlSourceCode);

// Inicia la visualizacion con algun archivo
openSourceFile('event', 'virtual_hardware.h');

function openSourceFile(event, sourceFileName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("SourceContainer_Tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("SourceContainer_FilesTabsLinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(sourceFileName).style.display = "block";
    event.currentTarget.className += " active";
}

// document.getElementById("Button_SourceH").addEventListener('click', (e) => {
//     CopyToClipboard("h");
// });

// document.getElementById("Button_SourceC").addEventListener('click', (e) => {
//     CopyToClipboard("c");
// });


// function CopyToClipboard (button){
//     const {clipboard} = require('electron')
    
//     // Si se quiere copiar el .h copa al portapapeles el contenido del header
//     if (button == "h"){
//         clipboard.writeText(HEADER_CONTENT, 'selección')
//     } 
//     // Si se quiere copiar el .h copa al portapapeles el contenido del header
//     else if (button == "c"){
//         clipboard.writeText(SOURCE_CONTENT, 'selección')
//     }
// }

// const HEADER_CONTENT = `

// #ifndef _APP_PONCHO_BOARD_H_
// #define _APP_PONCHO_BOARD_H_

// /*==================[inclusions]=============================================*/

// #include "sapi.h"      // <= sAPI header

// /*==================[cplusplus]==============================================*/

// #ifdef __cplusplus
// extern "C" {
// #endif

// /*==================[macros]=================================================*/

// #define BOARD_EDU_CIAA_NXP
// #define BOARD_CIAA_ZERO
// #define BOARD_PIC_CSS
// #define BOARD_ARDUINO

// #define VIRTUAL_BAUDRATE		 115200

// /*==================[typedef]================================================*/

// /**
//  * Posibles valores que puede recibir la funcion de escribir un texto
//  * sobre el display LCD. LCD_LINE_ALL escribe un mensaje multilinea,
//  * los demas valores escriben sobre la primer, segunda o tercer linea del LCD.
//  */
// typedef enum LcdLine{
// 	LCD_LINE_ALL    = '0',//!< LCD_LINE_ALL
// 	LCD_LINE_FIRST  = '1',//!< LCD_LINE_FIRST
// 	LCD_LINE_SECOND = '2',//!< LCD_LINE_SECOND
// 	LCD_LINE_THIRD  = '3' //!< LCD_LINE_THIRD
// } LcdLine_t;

// /**
//  * Posibles llamadas a los perifericos virtuales que se pueden realizar.
//  */
// typedef enum VirtualCommand {
// 	//Comandos asociados a GPIO
// 	COMM_SERIAL_GPIO_READ       = 'a',//!< COMM_SERIAL_GPIO_READ
// 	COMM_SERIAL_GPIO_WRITE      = 'b',//!< COMM_SERIAL_GPIO_WRITE
// 	//Comandos asociados al ADC/DAC
// 	COMM_SERIAL_ADC_READ        = 'c',//!< COMM_SERIAL_ADC_READ
// 	COMM_SERIAL_DAC_WRITE       = 'd',//!< COMM_SERIAL_DAC_WRITE
// 	// Comandos asociados al display LCD
// 	COMM_SERIAL_LCD_WRITE_BYTE  = 'e',//!< COMM_SERIAL_LCD_WRITE_BYTE
// 	COMM_SERIAL_LCD_WRITE_STRING= 'f',//!< COMM_SERIAL_LCD_WRITE_STRING
// 	// Comandos asociados al display LCD
// 	COMM_SERIAL_7SEG_WRITE      = 'g',//!< COMM_SERIAL_7SEG_WRITE
// } VirtualCommand_t;

// /**
//  * Mapa de perifericos virtuales a los que se puede acceder.
//  */
// typedef enum VirtualPeriphericalMap {
// 	// Valores corespondientes a los leds
// 	V_LEDR = 'a',   //!< V_LEDR
// 	V_LEDG = 'b',   //!< V_LEDG
// 	V_LEDB = 'z',   //!< V_LEDB
// 	V_LED1 = 'c',   //!< V_LED1
// 	V_LED2 = 'd',   //!< V_LED2
// 	V_LED3 = 'e',   //!< V_LED3
// 	V_LED4 = 'f',   //!< V_LED4
// 	// Valores corespondientes a las teclas
// 	V_TEC1 = 'g',   //!< V_TEC1
// 	V_TEC2 = 'h',   //!< V_TEC2
// 	V_TEC3 = 'i',   //!< V_TEC3
// 	V_TEC4 = 'j',   //!< V_TEC4
// 	// Valores coorespondientes a los pines ADC
// 	V_ADC_CH1 = 'k',//!< V_ADC_CH1
// 	// Valores coorespondientes a los pines DAC
// 	V_DAC_CH1 = 'n',//!< V_DAC_CH1
// 	// Valores coorespondientes al periferico LCD
// 	V_LCD1 = 'o',   //!< V_LCD1
// 	// Valores coorespondientes al periferico 7 segmentos
// 	V_7SEG = 'p',   //!< V_7SEG
// } VirtualPeriphericalMap_t;

// /*==================[external data declaration]==============================*/

// /*==================[external functions declaration]=========================*/

// bool_t   vBoardConfig    (uint32_t baudRate);

// bool_t   vGpioRead       (VirtualPeriphericalMap_t bluetoothPin);
// void     vGpioWrite      (VirtualPeriphericalMap_t bluetoothPin, bool_t pinState);
// void     vGpioToggle     (VirtualPeriphericalMap_t bluetoothPin);

// void     vLcdWriteString (VirtualPeriphericalMap_t display, LcdLine_t lcdLine, char * stringToWrite);

// uint16_t vAdcRead        (VirtualPeriphericalMap_t adcChannel);
// void     vDacWrite       (VirtualPeriphericalMap_t dacChannel, uint16_t dacValue);

// void     v7SegmentsWrite (VirtualPeriphericalMap_t display, uint8_t valueToShow);

// /*==================[cplusplus]==============================================*/

// #ifdef __cplusplus
// }
// #endif

// /*==================[end of file]============================================*/
// #endif /* #ifndef _APP_PONCHO_BOARD_H_ */

// `;
// const SOURCE_CONTENT = `

// /*==================[inclusions]=============================================*/

// #include "appPoncho_board.h"

// /*==================[macros and definitions]=================================*/

// #define COMMAND_INIT             '{'
// #define COMMAND_END              '}'
// #define COMMAND_SEPARATOR        ';'

// #define MAX_ANALOG_VALUE         1023
// #define DELAY_BETWEEN_COMMANDS   30

// #define MAX_BYTES_TO_FLUSH       15

// #define V_GPIO_LOW		         '0'
// #define V_GPIO_HIGH		         '1'
// #define V_GPIO_INVALID	         -1

// /**
//  * Posibles tipos de comandos que se pueden realizar. Este enum es utilizado
//  * unicamente en los comandos de lectura de perifericos virtuales. Cuando el
//  * sistema embebido quiere leer le enviar un REQUEST y la aplicacion responde
//  * con un RESPONSE.
//  */
// typedef enum VirtualCommandType {
// 	COMM_SERIAL_REQUEST  = '0',//!< COMM_SERIAL_REQUEST
// 	COMM_SERIAL_RESPONSE = '1' //!< COMM_SERIAL_RESPONSE
// } VirtualCommandType_t;

// /*==================[internal data declaration]==============================*/

// static uartMap_t UartVirtual;

// /*==================[internal functions declaration]=========================*/

// static void    myDelayMs           (uint32_t delayMs);
// static void    myDelayUs           (uint32_t delayMs)
// static void    myUartWriteByte     (uint8_t byteToWrite);
// static void    myUartWriteString   (char * string);
// static uint8_t myUartReadByte      (void);
// static void    FlushUartBuffer     (void);
// static bool_t  CheckIfValidCommand (VirtualCommand_t command, VirtualPeriphericalMap_t perMap);
// static bool_t  AnalogToString      (uint16_t numberToConver, char * stringNumber);

// /*==================[internal data definition]===============================*/

// static uint32_t DebugTimeBetweenCommands = 7;
// static uint32_t DebugTimeBetweenReads = 10;

// /*==================[external data definition]===============================*/
// //todo reemplazar bool_t por un tipo mio
// /*==================[internal functions definition]==========================*/

// /**
//  * Convierte un numero entero analogico de 10 bits (entre 0 y 1023) en un
//  * string de 4 elementos. El numero siempre sale en formato 4 digitos.
//  *
//  * Ejemplos:
//  *
//  * valor int | valor string
//  * 9         | 0009
//  * 75        | 0075
//  * 754       | 0754
//  * 1015      | 1015
//  *
//  * @param numberToConver numero entero a convertir.
//  * @param stringNumber puntero al vector donde se almacenara el string convertido.
//  * @return 0 si no hubo error, 1 si hubo error.
//  */
// static bool_t AnalogToString (uint16_t numberToConver, char * stringNumber)
// {
// 	bool_t error = FALSE;
// 	uint8_t thousands = 0;
// 	uint8_t hundreds = 0;
// 	uint8_t tens = 0;
// 	uint8_t units = 0;

// 	if (numberToConver <= MAX_ANALOG_VALUE)
// 	{
// 		thousands = numberToConver / 1000;
// 		hundreds = numberToConver / 100;
// 		if (hundreds >= 10)
// 		{
// 			hundreds = 0;
// 		}
// 		tens = (numberToConver - ( (thousands * 1000) + (hundreds * 100) ) ) / 10 ;
// 		units = (numberToConver - ((thousands * 1000) + (hundreds * 100) + (tens * 10)));

// 		stringNumber[0] = thousands + '0';
// 		stringNumber[1] = hundreds + '0';
// 		stringNumber[2] = tens + '0';
// 		stringNumber[3] = units + '0';
// 		stringNumber[4] ='\0';
// 	}
// 	else
// 	{
// 		error = TRUE;
// 	}

// 	return !error;
// }

// /**
//  * Funcion propia para llamar al delay de la plataforma.
//  * @param delayMs
//  */
// static void myDelayMs (uint32_t delayMs)
// {
// 	delay(delayMs);
// }

// /**
//  * Funcion propia para llamar al delay de la plataforma.
//  * @param delayMs
//  */
// static void myDelayUs (uint32_t delayMs)
// {
// 	delayUs(delayMs);
// }

// /**
//  * Funcion propia para llamar a la funcion de sacar un
//  * byte por la uart seleccionada cuando se configuro al modulo.
//  * @param byteToWrite byte a escribir en el puerto serie.
//  */
// static void myUartWriteByte(uint8_t byteToWrite)
// {
// 	uartWriteByte(UartVirtual, (uint8_t) byteToWrite);
// }

// /**
//  * Funcion propia para leer un byte del puerto serie.
//  * Como en funciones anteriores, las funciones de este modulo invocan
//  * estas funciones en vez de la de una plataforma en particular. Esto
//  * se realiza de esta manera para darle independencia al codigo para que
//  * pueda ser multiplataforma.
//  * @return el byte leido por la uart.
//  */
// static uint8_t myUartReadByte(void)
// {
// 	static uint8_t byteReaded;

// 	if (!uartReadByte(UartVirtual, &byteReaded)){
// 		byteReaded = 0;
// 	}
// 	myDelayUs(DebugTimeBetweenReads);

// 	return byteReaded;
// }

// /**
//  * Escribe un string por la uart. En algunas platadormas, esta funcion
//  * es soportada de manera nativa por el framework que brinda acceso al
//  * hardware, en otras plataformas, para mandar un string por la uart es
//  * necesario llamar a la funcion de escribir un byte hasta completar
//  * todos los bytes del string.
//  * @param string puntero al string a enviar por la uart.
//  */
// static void myUartWriteString (char * string)
// {
// 	while(*string != 0)
// 	{
// 		myUartWriteByte((uint8_t) *string);
// 		string++;
// 	}
// }

// /**
//  * Limpia el buffer de recepcion de la UART.
//  * Para limpiarlo realiza MAX_BYTES_TO_FLUSH lecturas del buffer sin
//  * asignarselo a ninguna variable para comenzar a leer con el buffer limpio.
//  */
// static void FlushUartBuffer     (void){
// 	uint32_t i;
// 	uint8_t dataSerial = 0;

// 	for (i = 0; i < MAX_BYTES_TO_FLUSH; i++){
// 		dataSerial = myUartReadByte();
// 		dataSerial++;
// 	}
// }

// /**
//  * Chequea que el comando a enviar hacia la aplicacion de hardware virtual
//  * sea un comando valido. Por ejemplo, no se puede ejecutar el comando de
//  * escribrir un GPIO en el periferico LCD o no se puede realizar el comando
//  * de leer un analogico de un pin digital.
//  * Para cada comando, chequea que el periferico sea correcto.
//  * @param command comando a enviar a la aplicacion.
//  * @param perMap periferico virtual sobre el cual se ejecutara el comando.
//  * @return 1 si es una combinacion comando/periferico valida, 0 si no lo es.
//  */
// static bool_t CheckIfValidCommand (VirtualCommand_t command, VirtualPeriphericalMap_t perMap)
// {
// 	bool_t isValidCommand = FALSE;
// 	if (command == COMM_SERIAL_GPIO_READ)
// 	{
// 		if (perMap == V_TEC1 || perMap == V_TEC2 || perMap == V_TEC3 || perMap == V_TEC4)
// 		{
// 			isValidCommand = TRUE;
// 		}
// 		if (perMap == V_LEDR || perMap == V_LEDG || perMap == V_LEDB || perMap == V_LED1 || perMap == V_LED2 || perMap == V_LED3 || perMap == V_LED4)
// 		{
// 			isValidCommand = TRUE;
// 		}
// 	}
// 	else if	(command == COMM_SERIAL_GPIO_WRITE)
// 	{
// 		if (perMap == V_LEDR || perMap == V_LEDG || perMap == V_LEDB || perMap == V_LED1 || perMap == V_LED2 || perMap == V_LED3 || perMap == V_LED4)
// 		{
// 			isValidCommand = TRUE;
// 		}
// 	}
// 	else if	(command == COMM_SERIAL_ADC_READ)
// 	{
// 		if (perMap == V_ADC_CH1)
// 		{
// 			isValidCommand = TRUE;
// 		}
// 	}
// 	else if	(command == COMM_SERIAL_DAC_WRITE)
// 	{
// 		if (perMap == V_DAC_CH1)
// 		{
// 			isValidCommand = TRUE;
// 		}
// 	}
// 	else if	(command == COMM_SERIAL_LCD_WRITE_BYTE || command == COMM_SERIAL_LCD_WRITE_STRING)
// 	{
// 		if (perMap == V_LCD1)
// 		{
// 			isValidCommand = TRUE;
// 		}
// 	}
// 	else if	(command == COMM_SERIAL_7SEG_WRITE)
// 	{
// 		if (perMap == V_7SEG){
// 			isValidCommand = TRUE;
// 		}
// 	}

// 	if(isValidCommand)
// 	{
// 		myDelayMs(DebugTimeBetweenCommands);
// 	}

// 	return isValidCommand;
// }

// /*==================[external functions definition]==========================*/

// /**
//  * Configura el puerto serie por el que se va a comunicar el sistema embebido
//  * con la plataforma de hardware virtual.
//  * @param uartMap uart por la que se transmitiran los datos.
//  * @param baudRate velocidad de transmision.
//  * @return 1 siempre.
//  */
// bool_t vBoardConfig (uint32_t baudRate)
// {
// 	UartVirtual = UART_USB;
// 	uartConfig(UartVirtual, baudRate);
// 	return TRUE;
// }

// /**
//  * Escribe un estado logico en un pin virtual.
//  * @param virtualGpioPin pin virtual a escribir.
//  * @param pinState estado logico a enviar.
//  */
// void vGpioWrite (VirtualPeriphericalMap_t virtualGpioPin, bool_t pinState)
// {
// 	char stringCommand [10];

// 	if (CheckIfValidCommand(COMM_SERIAL_GPIO_WRITE, virtualGpioPin))
// 	{
// 		stringCommand[0] = COMMAND_INIT;
// 		stringCommand[1] = COMM_SERIAL_GPIO_WRITE;
// 		stringCommand[2] = COMMAND_SEPARATOR;
// 		stringCommand[3] = virtualGpioPin;
// 		stringCommand[4] = COMMAND_SEPARATOR;
// 		stringCommand[5] = pinState == TRUE? V_GPIO_HIGH : V_GPIO_LOW;
// 		stringCommand[6] = COMMAND_END;
// 		stringCommand[7] = '\n';
// 		stringCommand[8] = '\0';

// 		myUartWriteString(stringCommand);
// 	}
// }

// /**
//  * Lee el estado logico de un pin virtual.
//  * @param virtualGpioPin pin virtual a leer.
//  * @return estado logico leido.
//  */
// bool_t vGpioRead (VirtualPeriphericalMap_t virtualGpioPin)
// {
// 	char stringCommand [10];
// 	bool_t pinState = TRUE;
// 	uint8_t dataSerial  = 0;
// 	uint16_t counter = 0;
// 	uint8_t i = 0;
// 	bool_t flagCommandInit = FALSE;

// 	if (CheckIfValidCommand(COMM_SERIAL_GPIO_READ, virtualGpioPin))
// 	{
// 		stringCommand[0] = COMMAND_INIT;
// 		stringCommand[1] = COMM_SERIAL_GPIO_READ;
// 		stringCommand[2] = COMMAND_SEPARATOR;
// 		stringCommand[3] = virtualGpioPin;
// 		stringCommand[4] = COMMAND_SEPARATOR;
// 		stringCommand[5] = COMM_SERIAL_REQUEST;
// 		stringCommand[6] = COMMAND_END;
// 		stringCommand[7] = '\n';
// 		stringCommand[8] = '\0';

// 		myUartWriteString(stringCommand);

// 		// limpia el buffer
// 		bzero(stringCommand, 10);

// S		// Espera a recibir data por un tiempo determinado
// 		while (++counter < 1000 && i < 10)
// 		{
// 			if( (dataSerial = myUartReadByte()) != 0 )
// 			{
// 				if (dataSerial == COMMAND_INIT)
// 				{
// 					flagCommandInit = TRUE;
// 				}
// 				if (flagCommandInit)
// 				{
// 					stringCommand[i] = dataSerial;
// 					if (stringCommand[i] == '}')
// 					{
// 						break;
// 					}
// 					i++;
// 				}
// 			}
// 		}

// 		// chequea si salio por timeout
// 		if (counter < 1000)
// 		{
// 			// chequea que todos lo que haya llegado sea una respuesta correcta
// 			if (	stringCommand[0] == COMMAND_INIT &&
// 					stringCommand[1] == COMM_SERIAL_GPIO_READ &&
// 					stringCommand[2] == COMMAND_SEPARATOR &&
// 					stringCommand[4] == COMMAND_SEPARATOR &&
// 					stringCommand[5] == COMM_SERIAL_RESPONSE &&
// 					stringCommand[6] == COMMAND_SEPARATOR &&
// 					(stringCommand[7] == V_GPIO_LOW || stringCommand[7] == V_GPIO_HIGH) )
// 			{
// 				pinState = stringCommand[7] - '0';
// 			}
// 		}
// 	}

// 	return pinState;
// }

// /**
//  * Invierte el estado logico de un pin.
//  * Notar que para que esta accion se realice, el pin a invertir su estado
//  * debe ser un pin de salida.
//  * @param virtualGpioPin pin a invertir el estado logico.
//  */
// void vGpioToggle (VirtualPeriphericalMap_t virtualGpioPin)
// {
// 	vGpioWrite(virtualGpioPin, !vGpioRead(virtualGpioPin));
// }

// /**
//  * Realiza una lectura sobre un pin analogico.
//  * La conversion ADC tiene una resolucion de 10 bits, por lo que, sus
//  * valores estan comprendidos entre 0 y 1023.
//  * @param virtualAdcPin pin analogico virtual a leer.
//  * @return valor analogico leido.
//  */
// uint16_t vAdcRead (VirtualPeriphericalMap_t virtualAdcPin)
// {
// 	char stringCommand [15];
// 	static uint16_t adcValue = 0;
// 	uint8_t dataSerial  = 0;
// 	uint16_t counter = 0;
// 	uint8_t i = 0;
// 	bool_t flagCommandInit = FALSE;

// 	if (CheckIfValidCommand(COMM_SERIAL_ADC_READ, virtualAdcPin)){

// 		stringCommand[0] = COMMAND_INIT;
// 		stringCommand[1] = COMM_SERIAL_ADC_READ;
// 		stringCommand[2] = COMMAND_SEPARATOR;
// 		stringCommand[3] = virtualAdcPin;
// 		stringCommand[4] = COMMAND_SEPARATOR;
// 		stringCommand[5] = COMM_SERIAL_REQUEST;
// 		stringCommand[6] = COMMAND_END;
// 		stringCommand[7] = '\n';
// 		stringCommand[8] = '\0';

// 		myUartWriteString(stringCommand);

// 		// limpia el buffer
// 		bzero(stringCommand, 15);

// 		// Espera a recibir data por un tiempo determinado
// 		while (++counter < 1000 && i < 15)
// 		{
// 			if( (dataSerial = myUartReadByte()) != 0 )
// 			{
// 				if (dataSerial == COMMAND_INIT)
// 				{
// 					flagCommandInit = TRUE;
// 				}
// 				if (flagCommandInit)
// 				{
// 					stringCommand[i] = dataSerial;
// 					if (stringCommand[i] == '}')
// 					{
// 						break;
// 					}
// 					i++;
// 				}
// 			}
// 		}

// 		// chequea si salio por timeout
// 		if (i == 11 && counter < 1000)
// 		{
// 			// chequea que todos lo que haya llegado sea una respuesta correcta
// 			if (	stringCommand[0] == COMMAND_INIT &&
// 					stringCommand[1] == COMM_SERIAL_ADC_READ &&
// 					stringCommand[2] == COMMAND_SEPARATOR &&
// 					stringCommand[3] == virtualAdcPin &&
// 					stringCommand[4] == COMMAND_SEPARATOR &&
// 					stringCommand[5] == COMM_SERIAL_RESPONSE &&
// 					stringCommand[6] == COMMAND_SEPARATOR &&
// 					stringCommand[11] == COMMAND_END )
// 			{
// 				adcValue = 0;
// 				// unidades de mil
// 				adcValue += (stringCommand[7] - '0') * 1000;
// 				// centenas
// 				adcValue += (stringCommand[8] - '0') * 100;
// 				// decenas
// 				adcValue += (stringCommand[9] - '0') * 10;
// 				// unidades
// 				adcValue += (stringCommand[10] - '0');

// 				if (adcValue > MAX_ANALOG_VALUE)
// 				{
// 					adcValue = MAX_ANALOG_VALUE;
// 				}
// 				else if (adcValue < 0)
// 				{
// 					adcValue = 0;
// 				}
// 			}
// 		}
// 	}

// 	return adcValue;
// }

// /**
//  * Escribe un valor analogico sobre una salida analogica.
//  * El valor a escribir es de 10 bits, por lo que, sus
//  * valores estan comprendidos entre 0 y 1023.
//  * @param dacChannel pin analogico a escribir.
//  * @param dacValue valor de 10 bits a escribir.
//  */
// void vDacWrite (VirtualPeriphericalMap_t dacChannel, uint16_t dacValue)
// {
// 	char stringCommand [15];
// 	char analogString[5];

// 	if (CheckIfValidCommand(COMM_SERIAL_DAC_WRITE, dacChannel))
// 	{
// 		if (dacValue > MAX_ANALOG_VALUE)
// 		{
// 			dacValue = MAX_ANALOG_VALUE;
// 		}
// 		else if (dacValue < 0)
// 		{
// 			dacValue = 0;
// 		}

// 		if (AnalogToString(dacValue, analogString))
// 		{
// 			stringCommand[0] = COMMAND_INIT;
// 			stringCommand[1] = COMM_SERIAL_DAC_WRITE;
// 			stringCommand[2] = COMMAND_SEPARATOR;
// 			stringCommand[3] = dacChannel;
// 			stringCommand[4] = COMMAND_SEPARATOR;
// 			stringCommand[5] = analogString[0];
// 			stringCommand[6] = analogString[1];
// 			stringCommand[7] = analogString[2];
// 			stringCommand[8] = analogString[3];
// 			stringCommand[9] = COMMAND_END;
// 			stringCommand[10] = '\n';
// 			stringCommand[11] = '\0';

// 			myUartWriteString(stringCommand);
// 		}
// 	}
// }

// /**
//  * Escribe un caracter ASCII sobre el periferico display 7 segmentos.
//  * A diferencia de un display 7 segmentos real, este display, por el tipo
//  * de letra elegido, puede escribir cualquier caracter ASCII sobre el display
//  * a diferencia de uno tradicional que puede escribir del 0-9 y A-F.
//  * @param display periferico del display 7 segmentos.
//  * @param valueToShow caracter ASCII a mostrar sobre el display.
//  */
// void v7SegmentsWrite (VirtualPeriphericalMap_t display, uint8_t valueToShow)
// {
// 	char stringCommand [10];

// 	if (CheckIfValidCommand(COMM_SERIAL_7SEG_WRITE, display))
// 	{
// 		stringCommand[0] = COMMAND_INIT;
// 		stringCommand[1] = COMM_SERIAL_7SEG_WRITE;
// 		stringCommand[2] = COMMAND_SEPARATOR;
// 		stringCommand[3] = display;
// 		stringCommand[4] = COMMAND_SEPARATOR;
// 		stringCommand[5] = valueToShow;
// 		stringCommand[6] = COMMAND_END;
// 		stringCommand[7] = '\n';
// 		stringCommand[8] = '\0';

// 		myUartWriteString(stringCommand);
// 	}
// }

// /**
//  * Escribe un texto sobre el periferico display LCD.
//  * Como en el caso de un display LCD real, se puede seleccionar la linea
//  * sobre la cual escribir el texto.
//  * @param display periferico del display lcd sobre el cual escribir.
//  * @param lcdLine la linea sobre la cual escribir el mensaje, los posibles valores
//  * de la lineas son:
//  * --- LCD_LINE_ALL: escribe un mensaje multilinea.
//  * --- LCD_LINE_FIRST: escribe en la primer linea.
//  * --- LCD_LINE_SECOND: escribe en la segunda linea.
//  * --- LCD_LINE_THIRD: escribe en la tercer linea.
//  * @param stringToWrite cadena a escribir
//  */
// void vLcdWriteString (VirtualPeriphericalMap_t display, LcdLine_t lcdLine, char * stringToWrite)
// {
// 	uint8_t i = 0;
// 	uint8_t lenght = 0;
// 	char stringCommand [70];

// 	if (CheckIfValidCommand(COMM_SERIAL_LCD_WRITE_STRING, display))
// 	{
// 		for (lenght = 0; stringToWrite[lenght] != '\0'; lenght++);

// 		stringCommand[0] = COMMAND_INIT;
// 		stringCommand[1] = COMM_SERIAL_LCD_WRITE_STRING;
// 		stringCommand[2] = COMMAND_SEPARATOR;
// 		stringCommand[3] = display;
// 		stringCommand[4] = COMMAND_SEPARATOR;
// 		stringCommand[5] = lcdLine;
// 		stringCommand[6] = COMMAND_SEPARATOR;

// 		for (i = 0; i < lenght; i++)
// 		{
// 			stringCommand [i + 7] = stringToWrite[i];
// 		}

// 		stringCommand[7 + lenght] = COMMAND_END;
// 		stringCommand[8 + lenght] = '\n';
// 		stringCommand[9 + lenght] = '\0';

// 		myUartWriteString(stringCommand);
// 	}
// }

// /*==================[end of file]============================================*/


// `;