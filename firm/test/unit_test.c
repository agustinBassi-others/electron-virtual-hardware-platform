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

#define PRINT_SEPARATOR() uartWriteString(UART_USB, "\n\n\r----------------------------------------------\n\n\r")
#define PRINT_NEWLINES()  uartWriteString(UART_USB, "\n\r")

/*==================[internal data declaration]==============================*/

/*==================[internal functions declaration]=========================*/

// Tests unitarios
static char * T1_CommandsEndWithNull          ();
static char * T2_SendInvalidPeriphericals     ();
static char * T3_SendValidPeriphericals       ();
static char * T4_LedsOffAtInit                ();
static char * T5_DacSetZeroAtInit             ();
static char * T6_LcdBlankAtInit               ();
static char * T7_7SegsValueAtInit             ();
static char * T8_AdcValueUpperThanMax         ();
static char * T9_DacValueUpperThanMax         ();
static char * T10_DacValueLowerThanMin        ();
static char * T11_LcdWriteLineTruncation      ();
static char * T12_LcdWriteMultilineTruncation ();
// Funcion para ejecutar los tests
static char * ExecuteAllTests                 ();

/*==================[internal data definition]===============================*/

/*==================[external data definition]===============================*/

/*==================[internal functions definition]==========================*/

static char * T1_CommandsEndWithNull (){
    PRINT_SEPARATOR();
    uartWriteString(UART_USB, "Running test: T1_CommandsEndWithNull()\n\r");
    uartWriteString(UART_USB, "This test checks if all commands sended end with NULL.\n\r");
    uartWriteString(UART_USB, "\n\r- T1_CommandsEndWithNull() -> OK");
    return 0;
}

/**
 * Esta funcion de test le envia a la plataforma ViHard comandos con perifericos
 * invalidos, para chequear que la funcion devuelva error si son invalidos.
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * T2_SendInvalidPeriphericals (){
    ViHardError_t error;
    bool_t pinState = 0;
    uint16_t adcValue = 0;

    PRINT_SEPARATOR();

    uartWriteString(UART_USB, "Executing test function: T2_SendInvalidPeriphericals ()");

    PRINT_NEWLINES();
    error = Vh_GpioWrite(VH_DAC_CH1, FALSE);
    MINUNIT_ASSERT(
            "- Vh_GpioWrite(VH_DAC_CH1, FALSE);"
            "\n\r\t Expected: VH_EXEC_ERROR"
            "\n\r\t Received: VH_EXEC_OK",
            error == VH_EXEC_ERROR
    );
    uartWriteString(UART_USB, "- Vh_GpioWrite -> OK");

    PRINT_NEWLINES();
    error = Vh_GpioRead(VH_LCD1, &pinState);
    MINUNIT_ASSERT(
            "- Vh_GpioRead(VH_LCD1, 0);"
            "\n\r\t Expected: VH_EXEC_ERROR"
            "\n\r\t Received: VH_EXEC_OK",
            error == VH_EXEC_ERROR
    );
    uartWriteString(UART_USB, "- Vh_GpioRead -> OK");

    PRINT_NEWLINES();
    error = Vh_GpioToggle(VH_ADC_CH1);
    MINUNIT_ASSERT(
            "- Vh_GpioToggle(VH_ADC_CH1);"
            "\n\r\t Expected: VH_EXEC_ERROR"
            "\n\r\t Received: VH_EXEC_OK",
            error == VH_EXEC_ERROR
    );
    uartWriteString(UART_USB, "- Vh_GpioToggle -> OK");

    PRINT_NEWLINES();
    error = Vh_AdcRead(VH_TEC1, &adcValue);
    MINUNIT_ASSERT(
            "- Vh_AdcRead(VH_TEC1, 0);"
            "\n\r\t Expected: VH_EXEC_ERROR"
            "\n\r\t Received: VH_EXEC_OK",
            error == VH_EXEC_ERROR
    );
    uartWriteString(UART_USB, "- Vh_AdcRead -> OK");

    PRINT_NEWLINES();
    error = Vh_DacWrite(VH_LED2, 400);
    MINUNIT_ASSERT(
            "- Vh_DacWrite(VH_LED2, 400);"
            "\n\r\t Expected: VH_EXEC_ERROR"
            "\n\r\t Received: VH_EXEC_OK",
            error == VH_EXEC_ERROR
    );
    uartWriteString(UART_USB, "- Vh_DacWrite -> OK");

    PRINT_NEWLINES();
    error = Vh_7SegmentsWrite(VH_TEC4, '+');
    MINUNIT_ASSERT(
            "- Vh_7SegmentsWrite(VH_TEC4, '+');"
            "\n\r\t Expected: VH_EXEC_ERROR"
            "\n\r\t Received: VH_EXEC_OK",
            error == VH_EXEC_ERROR
    );
    uartWriteString(UART_USB, "- Vh_7SegmentsWrite -> OK");

    PRINT_NEWLINES();
    error = Vh_LcdWriteString(VH_DAC_CH1, LCD_LINE_FIRST, "");
    MINUNIT_ASSERT(
            "- Vh_LcdWriteString(VH_DAC_CH1, LCD_LINE_FIRST, \"\");"
            "\n\r\t Expected: VH_EXEC_ERROR"
            "\n\r\t Received: VH_EXEC_OK",
            error == VH_EXEC_ERROR
    );
    uartWriteString(UART_USB, "- Vh_LcdWriteString -> OK");

	return 0;
}

/**
 * Esta funcion de test le envia a la plataforma ViHard comandos con perifericos
 * invalidos, para chequear que la funcion devuelva error si son invalidos.
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * T3_SendValidPeriphericals (){
    ViHardError_t error;
    bool_t pinState = 0;
    uint16_t adcValue = 0;

    PRINT_SEPARATOR();

    uartWriteString(UART_USB, "Executing test function: T3_SendValidPeriphericals ()");

    PRINT_NEWLINES();
    error = Vh_GpioWrite(VH_LED1, FALSE);
    MINUNIT_ASSERT(
            "\r- Vh_GpioWrite(VH_LED1, FALSE);"
            "\n\r\t Expected: VH_EXEC_OK"
            "\n\r\t Received: VH_EXEC_ERROR",
            error == VH_EXEC_OK
    );
    uartWriteString(UART_USB, "\r- Vh_GpioWrite -> OK");

    PRINT_NEWLINES();
    error = Vh_GpioRead(VH_TEC1, &pinState);
    MINUNIT_ASSERT(
            "\r- Vh_GpioRead(VH_TEC1, &pinState);"
            "\n\r\t Expected: VH_EXEC_OK"
            "\n\r\t Received: VH_EXEC_ERROR",
            error == VH_EXEC_OK
    );
    uartWriteString(UART_USB, "\r- Vh_GpioRead-> OK");

    PRINT_NEWLINES();
    error = Vh_GpioToggle(VH_LED3);
    MINUNIT_ASSERT(
            "\r- Vh_GpioToggle(VH_LED3);"
            "\n\r\t Expected: VH_EXEC_OK"
            "\n\r\t Received: VH_EXEC_ERROR",
            error == VH_EXEC_OK
    );
    uartWriteString(UART_USB, "\r- Vh_GpioToggle -> OK");

    PRINT_NEWLINES();
    error = Vh_AdcRead(VH_ADC_CH1, &adcValue);
    MINUNIT_ASSERT(
            "\r- Vh_AdcRead(VH_ADC_CH1, 0);"
            "\n\r\t Expected: VH_EXEC_OK"
            "\n\r\t Received: VH_EXEC_ERROR",
            error == VH_EXEC_OK
    );
    uartWriteString(UART_USB, "\r- Vh_AdcRead -> OK");

    PRINT_NEWLINES();
    error = Vh_DacWrite(VH_DAC_CH1, 400);
    MINUNIT_ASSERT(
            "\r- Vh_DacWrite(VH_DAC_CH1, 400);"
            "\n\r\t Expected: VH_EXEC_OK"
            "\n\r\t Received: VH_EXEC_ERROR",
            error == VH_EXEC_OK
    );
    uartWriteString(UART_USB, "\r- Vh_DacWrite -> OK");

    PRINT_NEWLINES();
    error = Vh_7SegmentsWrite(VH_7SEG, '+');
    MINUNIT_ASSERT(
            "\r- Vh_7SegmentsWrite(VH_7SEG, '+');"
            "\n\r\t Expected: VH_EXEC_OK"
            "\n\r\t Received: VH_EXEC_ERROR",
            error == VH_EXEC_OK
    );
    uartWriteString(UART_USB, "\r- Vh_7SegmentsWrite -> OK");

    PRINT_NEWLINES();
    error = Vh_LcdWriteString(VH_LCD1, LCD_LINE_FIRST, "");
    MINUNIT_ASSERT(
            "\r- Vh_LcdWriteString(VH_LCD1, LCD_LINE_FIRST, \"\");"
            "\n\r\t Expected: VH_EXEC_OK"
            "\n\r\t Received: VH_EXEC_ERROR",
            error == VH_EXEC_OK
    );
    uartWriteString(UART_USB, "\r- Vh_LcdWriteString -> OK");

    return 0;
}

/**
 * Esta funcion chequea que todos los leds virtuales se apaguen
 * al iniciar la biblioteca
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * T4_LedsOffAtInit (){
    uint8_t byteRead = 0;

	PRINT_SEPARATOR();
	uartWriteString(UART_USB, "Running test: T4_LedsOffAtInit()\n\r");
	uartWriteString(UART_USB, "In this test Vh_BoardInit() function is executed.\n\r");
	uartWriteString(UART_USB, "Between others commands, you should see the next secuence sended in serial console:\n\n\r");
	uartWriteString(UART_USB, "{b;c;0}\n");
	uartWriteString(UART_USB, "{b;d;0}\n");
	uartWriteString(UART_USB, "{b;e;0}\n");
	uartWriteString(UART_USB, "{b;f;0}\n\n\r");
	uartWriteString(UART_USB, "If the commands are OK, type '0' in serial console, else type '1'.\n\n\r");

	delay(10);

	Vh_BoardConfig(VIHARD_BAUDRATE);

	while (uartReadByte(UART_USB, &byteRead) == 0);

	MINUNIT_ASSERT(
            "\r- T4_LedsOffAtInit()"
	        "\n\r\t Expected: '0'"
            "\n\r\t Received: '1'",
            byteRead == '0'
    );

	uartWriteString(UART_USB, "\n\r- T4_LedsOffAtInit -> OK");
	return 0;
}

/**
 * Esta funcion chequea que el DAC virtual se ponga en 0
 * al iniciar la biblioteca
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * T5_DacSetZeroAtInit (){
    uint8_t byteRead = 0;

    PRINT_SEPARATOR();
    uartWriteString(UART_USB, "Running test: T5_DacSetZeroAtInit()\n\r");
    uartWriteString(UART_USB, "In this test Vh_BoardInit() function is executed.\n\r");
    uartWriteString(UART_USB, "Between others commands, you should see the next value sended in serial console:\n\n\r");
    uartWriteString(UART_USB, "{d;n;0000}\n\n\r");
    uartWriteString(UART_USB, "If you see the command, type '0' in serial console, else type '1'.\n\n\r");

    delay(10);

    Vh_BoardConfig(VIHARD_BAUDRATE);

    while (uartReadByte(UART_USB, &byteRead) == 0);

    MINUNIT_ASSERT(
            "\r- T5_DacSetZeroAtInit()"
            "\n\r\t Expected: '0'"
            "\n\r\t Received: '1'",
            byteRead == '0'
    );

    uartWriteString(UART_USB, "\n\r- T5_DacSetZeroAtInit -> OK");
    return 0;
}

/**
 * Esta funcion chequea que el se borre cualquier texto del display LCD
 * al iniciar la biblioteca
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * T6_LcdBlankAtInit (){
    uint8_t byteRead = 0;

    PRINT_SEPARATOR();
    uartWriteString(UART_USB, "Running test: T6_LcdBlankAtInit()\n\r");
    uartWriteString(UART_USB, "In this test Vh_BoardInit() function is executed.\n\r");
    uartWriteString(UART_USB, "Between others commands, you should see the next value sended in serial console:\n\n\r");
    uartWriteString(UART_USB, "{f;o;0; }\n\n\r");
    uartWriteString(UART_USB, "If you see the command, type '0' in serial console, else type '1'.\n\n\r");

    delay(10);

    Vh_BoardConfig(VIHARD_BAUDRATE);

    while (uartReadByte(UART_USB, &byteRead) == 0);

    MINUNIT_ASSERT(
            "\r- T6_LcdBlankAtInit()"
            "\n\r\t Expected: '0'"
            "\n\r\t Received: '1'",
            byteRead == '0'
    );

    uartWriteString(UART_USB, "\n\r- T6_LcdBlankAtInit -> OK");
    return 0;
}

/**
 * Esta funcion chequea que el DAC virtual se ponga en 0
 * al iniciar la biblioteca
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * T7_7SegsValueAtInit (){
    uint8_t byteRead = 0;

    PRINT_SEPARATOR();
    uartWriteString(UART_USB, "Running test: T7_7SegsValueAtInit()\n\r");
    uartWriteString(UART_USB, "In this test Vh_BoardInit() function is executed.\n\r");
    uartWriteString(UART_USB, "Between others commands, you should see the next value sended in serial console:\n\n\r");
    uartWriteString(UART_USB, "{g;p;-}\n\n\r");
    uartWriteString(UART_USB, "If you see the command, type '0' in serial console, else type '1'.\n\n\r");

    delay(10);

    Vh_BoardConfig(VIHARD_BAUDRATE);

    while (uartReadByte(UART_USB, &byteRead) == 0);

    MINUNIT_ASSERT(
            "\r- T7_7SegsValueAtInit()"
            "\n\r\t Expected: '0'"
            "\n\r\t Received: '1'",
            byteRead == '0'
    );

    uartWriteString(UART_USB, "\n\r- T7_7SegsValueAtInit -> OK");
    return 0;
}

/**
 * Esta funcion chequea que el se limite el valor recibido de la funcion
 * de leer el ADC virtual a un valor maximo de 1023
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * T8_AdcValueUpperThanMax (){

    uint16_t adcValue = 5000;

    PRINT_SEPARATOR();
    uartWriteString(UART_USB, "Running test: T8_AdcValueUpperThanMax()\n\r");
    uartWriteString(UART_USB, "In this test Vh_AdcRead() function is executed.\n\r");
    uartWriteString(UART_USB, "Copy and paste this command in serial console quickly:\n\n\r");
    uartWriteString(UART_USB, "{c;k;1;5000}\n\n\r");

    delay(5000);

    Vh_AdcRead(VH_ADC_CH1, &adcValue);

    MINUNIT_ASSERT(
            "\r- T8_AdcValueUpperThanMax()"
            "\n\r\t Expected: 1023"
            "\n\r\t Received: > 1023",
            adcValue <= 1023
    );

    uartWriteString(UART_USB, "\n\r- T8_AdcValueUpperThanMax() -> OK");

	return 0;
}

/**
 * Esta funcion chequea que el se limite el valor enviado
 * DAC al virtual a un valor maximo de 1023
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * T9_DacValueUpperThanMax (){

    uint8_t byteRead = 0;

    PRINT_SEPARATOR();
    uartWriteString(UART_USB, "Running test: T9_DacValueUpperThanMax()\n\r");
    uartWriteString(UART_USB, "In this test Vh_DacWrite() function is executed with DAC value upper than max.\n\r");
    uartWriteString(UART_USB, "You should see the next value sended in serial console:\n\n\r");
    uartWriteString(UART_USB, "{d;n;1023}\n\n\r");
    uartWriteString(UART_USB, "If you see the command, type '0' in serial console, else type '1'.\n\n\r");

    delay(10);

    Vh_DacWrite(VH_DAC_CH1, 2500);

    while (uartReadByte(UART_USB, &byteRead) == 0);

    MINUNIT_ASSERT(
            "\r- T9_DacValueUpperThanMax()"
            "\n\r\t Expected: '0'"
            "\n\r\t Received: '1'",
            byteRead == '0'
    );

    uartWriteString(UART_USB, "\n\n\r- T9_DacValueUpperThanMax() -> OK");
    return 0;
}

/**
 * Esta funcion chequea que el se limite el valor enviado
 * DAC al virtual a un valor minimo de 0
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * T10_DacValueLowerThanMin (){
    uint8_t byteRead = 0;

    PRINT_SEPARATOR();
    uartWriteString(UART_USB, "Running test: T10_DacValueLowerThanMin()\n\r");
    uartWriteString(UART_USB, "In this test Vh_DacWrite() function is executed with DAC value lower than min.\n\r");
    uartWriteString(UART_USB, "You should see the next value sended in serial console:\n\n\r");
    uartWriteString(UART_USB, "{d;n;0000}\n\n\r");
    uartWriteString(UART_USB, "If you see the command, type '0' in serial console, else type '1'.\n\n\r");

    delay(10);

    Vh_DacWrite(VH_DAC_CH1, -100);

    while (uartReadByte(UART_USB, &byteRead) == 0);

    MINUNIT_ASSERT(
            "\r- T10_DacValueLowerThanMin()"
            "\n\r\t Expected: '0'"
            "\n\r\t Received: '1'",
            byteRead == '0'
    );

    uartWriteString(UART_USB, "\n\n\r- T10_DacValueLowerThanMin() -> OK");
    return 0;
}

/**
 * Esta funcion chequea que se limite la longitud maxima de un mensaje
 * simple linea del LCD virtual a 18 bytes
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * T11_LcdWriteLineTruncation (){

    uint8_t byteRead = 0;

    PRINT_SEPARATOR();
    uartWriteString(UART_USB, "Running test: T11_LcdWriteLineTruncation()\n\r");
    uartWriteString(UART_USB, "In this test Vh_LcdWriteString() function is executed with line lenght upper than max.\n\r");
    uartWriteString(UART_USB, "You should see the next value sended in serial console:\n\n\r");
    uartWriteString(UART_USB, "{f;o;1;This is a line tru}\n\n\r");
    uartWriteString(UART_USB, "If you see the command, type '0' in serial console, else type '1'.\n\n\r");

    delay(10);

    Vh_LcdWriteString(VH_LCD1, LCD_LINE_FIRST, "This is a line truncated by ViHard module");

    while (uartReadByte(UART_USB, &byteRead) == 0);

    MINUNIT_ASSERT(
            "\r- T11_LcdWriteLineTruncation()"
            "\n\r\t Expected: '0'"
            "\n\r\t Received: '1'",
            byteRead == '0'
    );

    uartWriteString(UART_USB, "\n\n\r- T11_LcdWriteLineTruncation() -> OK");
    return 0;
}

/**
 * Esta funcion chequea que se limite la longitud maxima de un mensaje
 * multi linea del LCD virtual a 53 bytes
 * @return el mensaje de error si el test falla, 0 si no falla el test.
 */
static char * T12_LcdWriteMultilineTruncation (){
    uint8_t byteRead = 0;

    PRINT_SEPARATOR();
    uartWriteString(UART_USB, "Running test: T12_LcdWriteMultilineTruncation()\n\r");
    uartWriteString(UART_USB, "In this test Vh_LcdWriteString() function is executed with multiline lenght upper than max.\n\r");
    uartWriteString(UART_USB, "You should see the next value sended in serial console:\n\n\r");
    uartWriteString(UART_USB, "{f;o;0;This is a line truncated by ViHard module. If you see}\n\n\r");
    uartWriteString(UART_USB, "If you see the command, type '0' in serial console, else type '1'.\n\n\r");

    delay(10);

    Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, "This is a line truncated by ViHard module. If you see complete message it's wrong");

    while (uartReadByte(UART_USB, &byteRead) == 0);

    MINUNIT_ASSERT(
            "\r- T12_LcdWriteMultilineTruncation()"
            "\n\r\t Expected: '0'"
            "\n\r\t Received: '1'",
            byteRead == '0'
    );

    uartWriteString(UART_USB, "\n\n\r- T12_LcdWriteMultilineTruncation() -> OK");
    return 0;
}

/**
 * Funcion para ejecutar todos los tests unitarios
 * @return el mensaje de error del test que fallo, 0 si no fallo ninguno.
 */
static char * ExecuteAllTests() {
	MINUNIT_RUN_TEST(T1_CommandsEndWithNull);
	MINUNIT_RUN_TEST(T2_SendInvalidPeriphericals);
	MINUNIT_RUN_TEST(T3_SendValidPeriphericals);
	MINUNIT_RUN_TEST(T4_LedsOffAtInit);
	MINUNIT_RUN_TEST(T5_DacSetZeroAtInit);
	MINUNIT_RUN_TEST(T6_LcdBlankAtInit);
	MINUNIT_RUN_TEST(T7_7SegsValueAtInit);
	MINUNIT_RUN_TEST(T8_AdcValueUpperThanMax);
	MINUNIT_RUN_TEST(T9_DacValueUpperThanMax);
	MINUNIT_RUN_TEST(T10_DacValueLowerThanMin);
	MINUNIT_RUN_TEST(T11_LcdWriteLineTruncation);
	MINUNIT_RUN_TEST(T12_LcdWriteMultilineTruncation);
	return 0;
}

/*==================[external functions definition]==========================*/

int main(void) {
    // Configura la placa EDU-CIAA-NXP
	boardConfig();

	// Configura la biblioteca ViHard
	Vh_BoardConfig(VIHARD_BAUDRATE);

	// Muestra un mensaje de bienvenida
	uartWriteString(UART_USB, "\n\rViHard Unit Testing\n\r");

	// La ejecucion de los tests retorna un resultado
	char * testsResult = ExecuteAllTests();

	// Si el resultado de los test es distinto de cero muestra el mensaje de error
	if (testsResult != 0) {
		uartWriteString(UART_USB, testsResult);
	}
	// Si el test retorno 0, es decir OK, muestra que todos los tests pasaron bien
	else {
	    PRINT_SEPARATOR();
        uartWriteString(UART_USB, "All tests executed passed OK.");
	}

	// Muestra la cantidad de tests ejecutados
    PRINT_SEPARATOR();
    uartWriteString(UART_USB, "Amount of tests run: ");
    uartWriteByte(UART_USB, MinUnit_GetAmountOfTestsRun()/10 + '0');
    uartWriteByte(UART_USB, ( MinUnit_GetAmountOfTestsRun() - ((MinUnit_GetAmountOfTestsRun()/10) * 10) ) + '0');

    PRINT_SEPARATOR();

	return 0;
}

/*==================[end of file]============================================*/




