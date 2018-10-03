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
#include "vihard.h"

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

	Vh_BoardConfig(VIHARD_BAUDRATE);

	while(1) {
		Test();
	}
	return 0 ;
}

/*==================[end of file]============================================*/

static void TestGpioWrite	(){
	Vh_GpioWrite(VH_LED1, TRUE);
	gpioWrite(LED1, TRUE);
	delay(500);

	Vh_GpioWrite(VH_LED2, TRUE);
	gpioWrite(LED2, TRUE);
	delay(500);

	Vh_GpioWrite(VH_LED3, TRUE);
	gpioWrite(LED3, TRUE);
	delay(500);

	Vh_GpioWrite(VH_LED1, FALSE);
	gpioWrite(LED1, FALSE);
	delay(500);

	Vh_GpioWrite(VH_LED2, FALSE);
	gpioWrite(LED2, FALSE);
	delay(500);

	Vh_GpioWrite(VH_LED3, FALSE);
	gpioWrite(LED3, FALSE);
	delay(500);
}

static void TestDac (){
	uint16_t dacValue = 0;

	for (dacValue = 0; dacValue <= 1000; dacValue += 100){
		Vh_DacWrite(VH_DAC_CH1, dacValue);
		delay(1000);
	}
}

static void Test7Segments (){
	uint8_t value = 0;

	for (value = '0'; value <= '9'; value++){
		Vh_7SegmentsWrite(VH_7SEG, value);
		delay (1000);
	}
}

static void TestDisplayWriteString	(){
	Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, "Mensaje multilinea escrito desde la CIAA");
	delay(2000);

	Vh_LcdWriteString(VH_LCD1, LCD_LINE_FIRST, "Linea 1");
	delay(2000);

	Vh_LcdWriteString(VH_LCD1, LCD_LINE_SECOND, "Linea 2");
	delay(2000);

	Vh_LcdWriteString(VH_LCD1, LCD_LINE_THIRD, "Linea 3");
	delay(2000);

}

static void TestGpioRead (){
	int8_t state;

	if (!Vh_GpioRead(VH_TEC1)){
		gpioWrite(LEDG, TRUE);
	} else {
		gpioWrite(LEDG, FALSE);
	}
	delay (50);

	if (!Vh_GpioRead(VH_TEC2)){
		gpioWrite(LED1, TRUE);
	} else {
		gpioWrite(LED1, FALSE);
	}
	delay (50);

	if (!Vh_GpioRead(VH_TEC3)){
		gpioWrite(LED2, TRUE);
	} else {
		gpioWrite(LED2, FALSE);
	}
	delay (50);

	if (!Vh_GpioRead(VH_TEC4)){
		gpioWrite(LED3, TRUE);
	} else {
		gpioWrite(LED3, FALSE);
	}
	delay (50);
}

static void TestGpioToggle (){
	while (gpioRead(TEC1)){
		Vh_GpioToggle(VH_LED1);
		delay(500);
	}

	while (gpioRead(TEC1)){
		Vh_GpioToggle(VH_LED2);
		delay(500);
	}

	while (gpioRead(TEC1)){
		Vh_GpioToggle(VH_LED3);
		delay(500);
	}

	while (gpioRead(TEC1)){
		Vh_GpioToggle(VH_LED4);
		delay(500);
	}
}

static void TestAdcRead (){
	uint16_t adcValue = 0;

	while(1){
		adcValue = Vh_AdcRead(VH_ADC_CH1);
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

static void TestIntegral1(){
	uint8_t counter7Segs = '0';
	uint32_t counterLcd = 0;
	char lcdMessages[4][50] = {
			"Hola Pablo y Eric! este es un mensaje multilinea",
			"Mensaje linea 1",
			"Mensaje linea 2",
			"Mensaje linea 3"
	};
	uint8_t lcdMessageIndex = 0;
	uint16_t adcValue = 0;
	bool_t stateTec1 = TRUE;
	bool_t stateTec2 = TRUE;
	char lcdNumber[20];

	cyclesCounterConfig(EDU_CIAA_NXP_CLOCK_SPEED);

	while(1){
		cyclesCounterReset();

		// funciona bien
		Vh_7SegmentsWrite(VH_7SEG, counter7Segs);
		// funciona bien
//		Vh_LcdWriteString(VH_LCD1, (LcdLine_t) (lcdMessageIndex + '0'), lcdMessages[lcdMessageIndex]);

		// paso a paso funciona bien, el problema es cuando esta corriendo
		adcValue = Vh_AdcRead(VH_ADC_CH1);
		// funciona bien pasa que hay que pasarle bien el valor
		Vh_DacWrite(VH_DAC_CH1, adcValue);

		stateTec1 = Vh_GpioRead(VH_TEC1);
		Vh_GpioWrite(VH_LED1, !stateTec1);

		stateTec2 = Vh_GpioRead(VH_TEC2);
		Vh_GpioWrite(VH_LED2, !stateTec2);

		Vh_GpioToggle(VH_LED4);

		stdioSprintf(lcdNumber, "%d - uS: %d", counterLcd, (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
		Vh_LcdWriteString(VH_LCD1, (LcdLine_t) (lcdMessageIndex + '0'), lcdNumber);

		if (++counter7Segs > '9'){
			counter7Segs = '0';
		}

		if (++lcdMessageIndex > 3){
			lcdMessageIndex = 0;
		}

		counterLcd++;

		gpioToggle(LED3);
	}
}

static void TestTimming(){
	char lcdText[50];

	cyclesCounterConfig(EDU_CIAA_NXP_CLOCK_SPEED);

	while(1){

		while (gpioRead(TEC1));
		delay(1000);
		cyclesCounterReset();
		Vh_7SegmentsWrite(VH_7SEG, '1');
		stdioSprintf(lcdText, "7SegsWrite: %d us", (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
		Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

		while (gpioRead(TEC1));
		delay(1000);
		cyclesCounterReset();
		Vh_AdcRead(VH_ADC_CH1);
		stdioSprintf(lcdText, "AdcRead: %d us", (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
		Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

		while (gpioRead(TEC1));
		delay(1000);
		cyclesCounterReset();
		Vh_DacWrite(VH_DAC_CH1, 145);
		stdioSprintf(lcdText, "DacWrite: %d us", (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
		Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

		while (gpioRead(TEC1));
		delay(1000);
		cyclesCounterReset();
		Vh_GpioRead(VH_TEC1);
		stdioSprintf(lcdText, "GpioRead: %d us", (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
		Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

		while (gpioRead(TEC1));
		delay(1000);
		cyclesCounterReset();
		Vh_GpioWrite(VH_LED2, 1);
		stdioSprintf(lcdText, "GpioWrite: %d us", (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
		Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

		while (gpioRead(TEC1));
		delay(1000);
		cyclesCounterReset();
		Vh_GpioToggle(VH_LED4);
		stdioSprintf(lcdText, "GpioToggle: %d us", (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
		Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

		while (gpioRead(TEC1));
		delay(1000);
		cyclesCounterReset();
		Vh_LcdWriteString(VH_LCD1, (LcdLine_t) LCD_LINE_ALL, "Hola Si, una consulta! Me queres mucho o poquito? Sofia");
		stdioSprintf(lcdText, "LcdWrite: %d us", (uint32_t)cyclesCounterToUs(cyclesCounterRead()));
		Vh_LcdWriteString(VH_LCD1, LCD_LINE_ALL, lcdText);

		gpioToggle(LED3);
	}
}


static void Test (void){
	//	TestGpioWrite();
	//	TestDac();
	//	Test7Segments();
	//	TestDisplayWriteString();
	//	TestGpioRead();
	//	TestGpioToggle();
//	TestAdcRead();
	TestIntegral1();
//	TestTimming();
//	TestDelay();
//    TestSoftDelay();
}


