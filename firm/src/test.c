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

/*==================[inclusions]=============================================*/

#include "sapi.h"
#include "minuinit.h"
#include "vihard.h"

/*==================[macros and definitions]=================================*/

#define PRINT_SEPARATOR() uartWriteString(UART_USB, "\n\n\r-----------------\n\n\r")
#define PRINT_NEWLINES()   uartWriteString(UART_USB, "\n\n\r")

/*==================[internal data declaration]==============================*/

/*==================[internal functions declaration]=========================*/

/*==================[internal data definition]===============================*/

/*==================[external data definition]===============================*/

/*==================[internal functions definition]==========================*/

static void ShowTestsResume (){
	PRINT_SEPARATOR();
	uartWriteString(UART_USB, "Amount of tests run: ");
	uartWriteByte(UART_USB, MinUnit_AmountTestsRun() + '0');
	PRINT_SEPARATOR();
}

static void ShowAllTestsPassedMessage (){
	PRINT_SEPARATOR();
	uartWriteString(UART_USB, "Congratulations!!!All tests executed passed OK.");
}

/**
 * Esta funcion de test le envia a la plataforma ViHard comandos con perifericos
 * invalidos, para chequear que la funcion devuelva error si son invalidos.
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * Test_InvalidPeriphericals (){
	ViHardError_t error;
	bool_t pinState = 0;
	uint16_t adcValue = 0;

	PRINT_SEPARATOR();

	uartWriteString(UART_USB, "Executing test function: Test_InvalidPeriphericals ()");

	PRINT_NEWLINES();
	error = Vh_GpioWrite(VH_DAC_CH1, FALSE);
	MINUNIT_ASSERT(
			"Vh_GpioWrite(VH_DAC_CH1, FALSE);"
			"\n\r\t Expected: VH_EXEC_ERROR"
			"\n\r\t Received: VH_EXEC_OK",
			error == VH_EXEC_ERROR
	);
	uartWriteString(UART_USB, "Vh_GpioWrite - TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_GpioRead(VH_LCD1, &pinState);
	MINUNIT_ASSERT(
			"Vh_GpioRead(VH_LCD1, 0);"
			"\n\r\t Expected: VH_EXEC_ERROR"
			"\n\r\t Received: VH_EXEC_OK",
			error == VH_EXEC_ERROR
	);
	uartWriteString(UART_USB, "Vh_GpioRead - TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_GpioToggle(VH_ADC_CH1);
	MINUNIT_ASSERT(
			"Vh_GpioToggle(VH_ADC_CH1);"
			"\n\r\t Expected: VH_EXEC_ERROR"
			"\n\r\t Received: VH_EXEC_OK",
			error == VH_EXEC_ERROR
	);
	uartWriteString(UART_USB, "Vh_GpioToggle - TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_AdcRead(VH_TEC1, &adcValue);
	MINUNIT_ASSERT(
			"Vh_AdcRead(VH_TEC1, 0);"
			"\n\r\t Expected: VH_EXEC_ERROR"
			"\n\r\t Received: VH_EXEC_OK",
			error == VH_EXEC_ERROR
	);
	uartWriteString(UART_USB, "Vh_AdcRead - TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_DacWrite(VH_LED2, 400);
	MINUNIT_ASSERT(
			"Vh_DacWrite(VH_LED2, 400);"
			"\n\r\t Expected: VH_EXEC_ERROR"
			"\n\r\t Received: VH_EXEC_OK",
			error == VH_EXEC_ERROR
	);
	uartWriteString(UART_USB, "Vh_DacWrite - TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_7SegmentsWrite(VH_TEC4, '+');
	MINUNIT_ASSERT(
			"Vh_7SegmentsWrite(VH_TEC4, '+');"
			"\n\r\t Expected: VH_EXEC_ERROR"
			"\n\r\t Received: VH_EXEC_OK",
			error == VH_EXEC_ERROR
	);
	uartWriteString(UART_USB, "Vh_7SegmentsWrite - TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_LcdWriteString(VH_DAC_CH1, LCD_LINE_FIRST, "");
	MINUNIT_ASSERT(
			"Vh_LcdWriteString(VH_DAC_CH1, LCD_LINE_FIRST, \"\");"
			"\n\r\t Expected: VH_EXEC_ERROR"
			"\n\r\t Received: VH_EXEC_OK",
			error == VH_EXEC_ERROR
	);
	uartWriteString(UART_USB, "Vh_LcdWriteString - TEST PASSED OK!");

	return 0;
}

/**
 * Esta funcion de test le envia a la plataforma ViHard comandos con perifericos
 * validos, para chequear que la funcion devuelva ok si ejecuta correctamente los comandos.
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * Test_ValidPeriphericals (){
	ViHardError_t error;
	bool_t pinState = 0;
	uint16_t adcValue = 0;

	PRINT_SEPARATOR();

	uartWriteString(UART_USB, "Executing test function: Test_ValidPeriphericals ()");

	PRINT_NEWLINES();
	error = Vh_GpioWrite(VH_LED1, FALSE);
	MINUNIT_ASSERT(
			"Vh_GpioWrite(VH_LED1, FALSE);"
			"\n\r\t Expected: VH_EXEC_OK"
			"\n\r\t Received: VH_EXEC_ERROR",
			error == VH_EXEC_OK
	);
	uartWriteString(UART_USB, "Vh_GpioWrite - TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_GpioRead(VH_TEC1, &pinState);
	MINUNIT_ASSERT(
			"Vh_GpioRead(VH_TEC1, &pinState);"
			"\n\r\t Expected: VH_EXEC_OK"
			"\n\r\t Received: VH_EXEC_ERROR",
			error == VH_EXEC_OK
	);
	uartWriteString(UART_USB, "Vh_GpioRead- TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_GpioToggle(VH_LED3);
	MINUNIT_ASSERT(
			"Vh_GpioToggle(VH_LED3);"
			"\n\r\t Expected: VH_EXEC_OK"
			"\n\r\t Received: VH_EXEC_ERROR",
			error == VH_EXEC_OK
	);
	uartWriteString(UART_USB, "Vh_GpioToggle - TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_AdcRead(VH_ADC_CH1, &adcValue);
	MINUNIT_ASSERT(
			"Vh_AdcRead(VH_ADC_CH1, 0);"
			"\n\r\t Expected: VH_EXEC_OK"
			"\n\r\t Received: VH_EXEC_ERROR",
			error == VH_EXEC_OK
	);
	uartWriteString(UART_USB, "Vh_AdcRead - TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_DacWrite(VH_DAC_CH1, 400);
	MINUNIT_ASSERT(
			"Vh_DacWrite(VH_DAC_CH1, 400);"
			"\n\r\t Expected: VH_EXEC_OK"
			"\n\r\t Received: VH_EXEC_ERROR",
			error == VH_EXEC_OK
	);
	uartWriteString(UART_USB, "Vh_DacWrite - TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_7SegmentsWrite(VH_7SEG, '+');
	MINUNIT_ASSERT(
			"Vh_7SegmentsWrite(VH_7SEG, '+');"
			"\n\r\t Expected: VH_EXEC_OK"
			"\n\r\t Received: VH_EXEC_ERROR",
			error == VH_EXEC_OK
	);
	uartWriteString(UART_USB, "Vh_7SegmentsWrite - TEST PASSED OK!");

	PRINT_NEWLINES();
	error = Vh_LcdWriteString(VH_LCD1, LCD_LINE_FIRST, "");
	MINUNIT_ASSERT(
			"Vh_LcdWriteString(VH_LCD1, LCD_LINE_FIRST, \"\");"
			"\n\r\t Expected: VH_EXEC_OK"
			"\n\r\t Received: VH_EXEC_ERROR",
			error == VH_EXEC_OK
	);
	uartWriteString(UART_USB, "Vh_LcdWriteString - TEST PASSED OK!");

	return 0;
}

/**
 * Esta funcion de test le envia a la plataforma ViHard el comando DacWrite con
 * el valor del DAC superior al maximo permitido (1023). Si la funcion realiza el
 * trabajo correctamente, por mas que el valor supere 1023, esta deberia limitarlo
 * a este valor maximo.
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * Test_DacWriteMaxValue (){
	ViHardError_t error;
	bool_t pinState = 0;
	uint16_t adcValue = 0;

	PRINT_SEPARATOR();

	uartWriteString(UART_USB, "Executing test function: Test_DacWriteMaxValue ()\n\r");
	uartWriteString(UART_USB, "To test this function do this:\n\r");
	uartWriteString(UART_USB, "\t1. Open serial terminal at 115200 baudios\n\r");
	uartWriteString(UART_USB, "\t2. Execute function DacWrite(2500);\n\r");

	uartWriteString(UART_USB, "DacWrite - Limit max value - TEST PASSED OK!");

	return 0;
}

//static char * Test_DacWriteMaxValue (){
//	ViHardError_t error;
//	bool_t pinState = 0;
//	uint16_t adcValue = 0;
//
//	PRINT_SEPARATOR();
//
//	uartWriteString(UART_USB, "Executing test function: Test_DacWriteMaxValue ()");
//
//	uartWriteString(UART_USB, "DacWrite - Limit max value - TEST PASSED OK!");
//
//	return 0;
//}



static char * ExecuteAllTests() {

	MINUNIT_RUN_TEST(Test_InvalidPeriphericals);
	MINUNIT_RUN_TEST(Test_ValidPeriphericals);

	return 0;
}


/*==================[external functions definition]==========================*/

int main(void) {

	boardConfig();

	Vh_BoardConfig(VIHARD_BAUDRATE);

	uartWriteString(UART_USB, "\n\rViHard Unit Testing\n\r");

	char * testsResult = ExecuteAllTests();

	if (testsResult != 0) {
		uartWriteString(UART_USB, testsResult);
	}
	else {
		ShowAllTestsPassedMessage();
	}

	ShowTestsResume ();

	return 0;
}

/*==================[end of file]============================================*/




