
/*==================[inclusions]=============================================*/

#include "appPoncho_board.h"
#include "sapi.h"     // <= sAPI header

/*==================[macros and definitions]=================================*/

/*==================[internal data declaration]==============================*/

/*==================[internal functions declaration]=========================*/

static void Test (void);

/*==================[internal data definition]===============================*/

/*==================[external data definition]===============================*/

/*==================[internal functions definition]==========================*/

/*==================[external functions definition]==========================*/

int main(void){

	boardConfig();

	vBoardConfig(UART_USB, VIRTUAL_BAUDRATE);

	while(1) {
		Test();
	}
	return 0 ;
}

/*==================[end of file]============================================*/

static void TestGpioWrite	(){
	vGpioWrite(V_LED1, TRUE);
	gpioWrite(LED1, TRUE);
	delay(500);

	vGpioWrite(V_LED2, TRUE);
	gpioWrite(LED2, TRUE);
	delay(500);

	vGpioWrite(V_LED3, TRUE);
	gpioWrite(LED3, TRUE);
	delay(500);

	vGpioWrite(V_LED1, FALSE);
	gpioWrite(LED1, FALSE);
	delay(500);

	vGpioWrite(V_LED2, FALSE);
	gpioWrite(LED2, FALSE);
	delay(500);

	vGpioWrite(V_LED3, FALSE);
	gpioWrite(LED3, FALSE);
	delay(500);
}

static void TestDac (){
	uint16_t dacValue = 0;

	for (dacValue = 0; dacValue <= 1000; dacValue += 100){
		vDacWrite(V_DAC_CH1, dacValue);
		delay(1000);
	}
}

static void Test7Segments (){
	uint8_t value = 0;

	for (value = '0'; value <= '9'; value++){
		v7SegmentsWrite(V_7SEG, value);
		delay (1000);
	}
}

static void TestDisplayWriteString	(){
	vLcdWriteString(V_LCD1, LCD_LINE_ALL, "Mensaje multilinea escrito desde la CIAA");
	delay(2000);

	vLcdWriteString(V_LCD1, LCD_LINE_FIRST, "Linea 1");
	delay(2000);

	vLcdWriteString(V_LCD1, LCD_LINE_SECOND, "Linea 2");
	delay(2000);

	vLcdWriteString(V_LCD1, LCD_LINE_THIRD, "Linea 3");
	delay(2000);

}

static void TestGpioRead (){
	int8_t state;

	if (!vGpioRead(V_TEC1)){
		gpioWrite(LEDG, TRUE);
	} else {
		gpioWrite(LEDG, FALSE);
	}
	delay (50);

	if (!vGpioRead(V_TEC2)){
		gpioWrite(LED1, TRUE);
	} else {
		gpioWrite(LED1, FALSE);
	}
	delay (50);

	if (!vGpioRead(V_TEC3)){
		gpioWrite(LED2, TRUE);
	} else {
		gpioWrite(LED2, FALSE);
	}
	delay (50);

	if (!vGpioRead(V_TEC4)){
		gpioWrite(LED3, TRUE);
	} else {
		gpioWrite(LED3, FALSE);
	}
	delay (50);
}

static void TestGpioToggle (){
	while (gpioRead(TEC1)){
		vGpioToggle(V_LED1);
		delay(500);
	}

	while (gpioRead(TEC1)){
		vGpioToggle(V_LED2);
		delay(500);
	}

	while (gpioRead(TEC1)){
		vGpioToggle(V_LED3);
		delay(500);
	}

	while (gpioRead(TEC1)){
		vGpioToggle(V_LED4);
		delay(500);
	}
}

static void TestAdcRead (){
	uint16_t adcValue = 0;

	while(1){
		adcValue = vAdcRead(V_ADC_CH1);
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

static void Test (void){
	//	TestGpioWrite();
	//	TestDac();
	//	Test7Segments();
	//	TestDisplayWriteString();
	//	TestGpioRead();
	//	TestGpioToggle();
	TestAdcRead();
}






/* todo: gran BUG de programacion. Resulta que no andaba el delay.
 * Pense que era el codigo, pero lo que paso fue que con freeRTOS en la
 * sapi lo comentamos al tick config. Esto fue porque freeRTOS necesita
 * usar el tick. Lo que pasa, es que mas alla que haya dos sapi (una baremetal
 * y la otra rtos, en un momento el codigo de freeRTOS no compilaba, entonces
 * comentamos la funcion tick config en la sapi baremetal tambien. */
/* FUNCION PRINCIPAL, PUNTO DE ENTRADA AL PROGRAMA LUEGO DE RESET. */

/**
 * El paradigma respecto a la aplicacion en C y bluetooth es que para el micro
 * sera transparente si el acceso es a hardware real o a hardware fisico, es decir
 * en la biblioteca appPoncho se incluiran funciones como si fueran hardware real
 * que ya esta configurado y disponible para usar.
 * Hay que imaginar que la app dispone de hardware real al que se accede, por lo
 * que, cuando se manda por ejemplo uartWriteString por la uart, en realidad, en la
 * aplicacion no hay ningun hardware que pueda soportar esa opcion. Si puede llegar
 * a ver un display que sea capaz de recibir texto, entonces, si se quiere manadr
 * una cadena de texto por bluetooth hacia un display de la APP se deberia mandar, por ejemplo
 *
 * 		appPonchoDisplayWrite ("Cadena de texto");
 *
 * Ya que una funcion de este tipo tiene mucho mas sentido si se esta emulando hardware real.
 * Este mismo concepto tiene el mismo efecto para todos los perifericos.
 *
 * Algunas aclaraciones y/o limitaciones;
 *
 * 	Debido que se esta emulando hardware el envio/recepcion de comandos hacia la app
 * 	sera bloqueante. Imaginar el caso de querer leer una tecla de hardware fisico.
 * 	El micro pregunta por un pin y si o si se va a devolver algo. Entonces claramente
 * 	se debe quedar bloqueado esperando que le llegue un dato, si no es como si fisicamente
 * 	hubiera perdido conexion con el hardware.
 *
 * @return
 */

//static void	TestBluetoothCommands	(void){
//	while (gpioRead(TEC2));
//	uartWriteByte(UART_232, COMMAND_GPIO_READ);
//	delay(2000);
//	gpioToggle(LEDB);
//
//	while (gpioRead(TEC2));
//	uartWriteByte(UART_232, COMMAND_GPIO_WRITE);
//	delay(2000);
//	gpioToggle(LEDB);
//
//	while (gpioRead(TEC2));
//	uartWriteByte(UART_232, COMMAND_ADC_READ);
//	delay(2000);
//	gpioToggle(LEDB);
//
//	while (gpioRead(TEC2));
//	uartWriteByte(UART_232, COMMAND_DAC_WRITE);
//	delay(2000);
//	gpioToggle(LEDB);
//
//	while (gpioRead(TEC2));
//	uartWriteByte(UART_232, COMMAND_LCD_WRITE_BYTE);
//	delay(2000);
//	gpioToggle(LEDB);
//
//	while (gpioRead(TEC2));
//	uartWriteByte(UART_232, COMMAND_LCD_WRITE_STRING);
//	delay(2000);
//	gpioToggle(LEDB);
//
//	while (gpioRead(TEC2));
//	uartWriteByte(UART_232, COMMAND_7SEG_WRITE);
//	delay(2000);
//	gpioToggle(LEDB);
//
//	while (gpioRead(TEC2));
//	uartWriteByte(UART_232, COMMAND_MOTOR_RIGHT);
//	delay(2000);
//	gpioToggle(LEDB);
//
//	while (gpioRead(TEC2));
//	uartWriteByte(UART_232, COMMAND_MOTOR_LEFT);
//	delay(2000);
//	gpioToggle(LEDB);
//
//	while (gpioRead(TEC2));
//	uartWriteByte(UART_232, 15);
//	delay(2000);
//	gpioToggle(LEDB);
//
//}
//
//

//
//static void TestGpioToggle (){
//	uint8_t state;
//
//	appPonchoGpioToggle(BT_LEDR);
//	delay (200);
//
//	appPonchoGpioToggle(BT_LEDG);
//	delay (200);
//
//	appPonchoGpioToggle(BT_LEDB);
//	delay (200);
//
//	appPonchoGpioToggle(BT_LED1);
//	delay (200);
//
//	appPonchoGpioToggle(BT_LED2);
//	delay (200);
//
//	appPonchoGpioToggle(BT_LED3);
//	delay (200);
//}
//
//static void TestGpioReadAndToggle (){
//	uint8_t state;
//
//	appPonchoGpioRead(BT_TEC1, &state);
//	if (state == BT_LOW){
//		appPonchoGpioToggle(BT_LEDB);
//	}
//	delay (200);
//
//	appPonchoGpioRead(BT_TEC2, &state);
//	if (state == BT_LOW){
//		appPonchoGpioToggle(BT_LED1);
//	}
//	delay (200);
//
//	appPonchoGpioRead(BT_TEC3, &state);
//	if (state == BT_LOW){
//		appPonchoGpioToggle(BT_LED2);
//	}
//	delay (200);
//
//	appPonchoGpioRead(BT_TEC4, &state);
//	if (state == BT_LOW){
//		appPonchoGpioToggle(BT_LED3);
//	}
//	delay (200);
//
//}
//
//static void TestDisplayWriteByte	(){
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteByte(BT_LCD1, '0');
//	gpioToggle(LEDB);
//	delay(2000);
//
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteByte(BT_LCD1, '1');
//	gpioToggle(LEDB);
//	delay(2000);
//
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteByte(BT_LCD1, '2');
//	gpioToggle(LEDB);
//	delay(2000);
//
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteByte(BT_LCD1, 'A');
//	gpioToggle(LEDB);
//	delay(2000);
//
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteByte(BT_LCD1, 'B');
//	gpioToggle(LEDB);
//	delay(2000);
//
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteByte(BT_LCD1, 'C');
//	gpioToggle(LEDB);
//	delay(2000);
//}
//
//
//static void TestDisplayWriteString	(){
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteString(BT_LCD1, "Hola App Poncho");
//	gpioToggle(LEDB);
//	delay(2000);
//
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteString(BT_LCD1, "Como estas?");
//	gpioToggle(LEDB);
//	delay(2000);
//
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteString(BT_LCD1, "Por aca programando...");
//	gpioToggle(LEDB);
//	delay(2000);
//
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteString(BT_LCD1, "Chau, nos vemos!");
//	gpioToggle(LEDB);
//	delay(2000);
//
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteByte(BT_LCD1, 'B');
//	gpioToggle(LEDB);
//	delay(2000);
//
//	while (gpioRead(TEC2));
//	appPonchoDisplayWriteByte(BT_LCD1, 'C');
//	gpioToggle(LEDB);
//	delay(2000);
//
//
//	while (gpioRead(TEC2));
//	appPonchoGpioWrite(BT_LEDG, BT_LOW);
//	gpioWrite(LEDG, FALSE);
//	delay(2000);
//
//	while (gpioRead(TEC2));
//	appPonchoGpioWrite(BT_LEDB, BT_LOW);
//	gpioWrite(LEDB, FALSE);
//	delay(2000);
//}
//
//static void Vumeter (uint8_t value){
//	gpioWrite(LEDB, FALSE);
//	gpioWrite(LED1, FALSE);
//	gpioWrite(LED2, FALSE);
//	gpioWrite(LED3, FALSE);
//	if 			(value > 200){
//		gpioWrite(LED3, TRUE);
//	} else if 	(value > 120){
//		gpioWrite(LED2, TRUE);
//	} else if 	(value > 60){
//		gpioWrite(LED1, TRUE);
//	} else if 	(value > 20){
//		gpioWrite(LEDB, TRUE);
//	}
//
////	appPonchoGpioWrite(BT_LEDB, BT_LOW);
////	appPonchoGpioWrite(BT_LED1, BT_LOW);
////	appPonchoGpioWrite(BT_LED2, BT_LOW);
////	appPonchoGpioWrite(BT_LED3, BT_LOW);
////	if 			(value > 200){
////		appPonchoGpioWrite(BT_LED3, BT_HIGH);
////	} else if 	(value > 120){
////		appPonchoGpioWrite(BT_LED2, BT_HIGH);
////	} else if 	(value > 60){
////		appPonchoGpioWrite(BT_LED1, BT_HIGH);
////	} else if 	(value > 20){
////		appPonchoGpioWrite(BT_LEDB, BT_HIGH);
////	}
//}
//



//static void TestIntegral (){
//
//	while (gpioRead(TEC2));
//	vGpioWrite(V_LEDR, TRUE);
//	gpioWrite(LEDR, TRUE);
//	delay (2000);
//
//	while (gpioRead(TEC2));
//	vGpioWrite(V_LED1, TRUE);
//	gpioWrite(LED1, TRUE);
//	delay (2000);
//
//	while (gpioRead(TEC2));
//	v7SegmentsWrite(V_7SEG, '5');
//	delay (2000);
//
//	while (gpioRead(TEC2));
//	vDacWrite(V_DAC_CH1, vAdcRead(V_ADC_CH1));
//	delay (2000);
//
//	while (gpioRead(TEC2));
//	vDacWrite(V_DAC_CH1, vAdcRead(V_ADC_CH1));
//	delay (2000);
//
//	while (gpioRead(TEC2));
//	vLcdWriteByte(V_LCD1, 'm');
//	delay (2000);
//
//	while (gpioRead(TEC2));
//	vLcdWriteString(V_LCD1, "Aqui llego Bala, bala!");
//	delay (2000);
//
//	while (gpioRead(TEC2));
//	vGpioWrite(V_LED3, !vGpioRead(V_TEC4));
//	gpioWrite(LED3, vGpioRead(V_TEC4));
//	delay (2000);
//}
//
//void TestIntegral2 (){
//	uint8_t adcValue = 0;
//	static uint8_t counter = '0';
//
//	if (!vGpioRead(V_TEC1)){
//		vGpioToggle(V_LEDB);
//		gpioToggle(LEDB);
//	}
//
//	if (!vGpioRead(V_TEC2)){
//			vGpioToggle(V_LED1);
//			gpioToggle(LED1);
//		}
//
//	if (!vGpioRead(V_TEC3)){
//			vGpioToggle(V_LED2);
//			gpioToggle(LED2);
//		}
//
//	if (!vGpioRead(V_TEC4)){
//			vGpioToggle(V_LED3);
//			gpioToggle(LED3);
//		}
//
//	adcValue = vAdcRead(V_ADC_CH1);
//	vDacWrite(V_DAC_CH1, adcValue);
//	v7SegmentsWrite(V_7SEG, ((adcValue/25) + '0') );
//
//	vLcdWriteByte(V_LCD1, counter);
//
//	if (++counter > '9'){
//		counter = '0';
//		vLcdWriteString(V_LCD1, "Se resetea el contador...");
//		delay (2000);
//	}
//	adcValue = 0;
//}

