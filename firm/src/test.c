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

/*==================[macros and definitions]=================================*/

/*==================[internal data declaration]==============================*/

//extern int MinUnit_TestsRun;

int foo = 7;
int bar = 4;

/*==================[internal functions declaration]=========================*/

/*==================[internal data definition]===============================*/

/*==================[external data definition]===============================*/

/*==================[internal functions definition]==========================*/

static char * test_foo() {
	MINUNIT_ASSERT("ERROR: foo != 7", foo == 7);
	return 0;
}

static char * test_bar() {
	MINUNIT_ASSERT("ERROR: bar != 5", bar == 5);
	return 0;
}

static char * all_tests() {
	MINUNIT_RUN_TEST(test_foo);
	MINUNIT_RUN_TEST(test_bar);
	return 0;
}

/*==================[external functions definition]==========================*/

int main(void) {

	boardConfig();

	uartConfig( UART_USB, 115200 );

	uartWriteString(UART_USB, "Init UNIT testing with minunit tool!\n\r");

	char *result = all_tests();

	if (result != 0) {
		uartWriteString(UART_USB, result);
	}
	else {
		uartWriteString(UART_USB, "\n\rALL TESTS PASSED OK!\n\r");
	}

	uartWriteString(UART_USB, "\n\rAmount of tests run: ");
	uartWriteByte(UART_USB, MinUnit_AmountTestsRun() + '0');
	uartWriteString(UART_USB, "\n\r");

	return result != 0;
}

/*==================[end of file]============================================*/

