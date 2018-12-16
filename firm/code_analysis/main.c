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

//Sonar token: 60be97f4bdb81f3e720416f1f825ad3004136590

/*==================[inclusions]=============================================*/

#include "vihard.h"

/*==================[macros and definitions]=================================*/

/*==================[internal data declaration]==============================*/

/*==================[internal functions declaration]=========================*/

static void TestVhIntegral ();

/*==================[internal data definition]===============================*/

/*==================[external data definition]===============================*/

/*==================[internal functions definition]==========================*/

static void TestVhIntegral(){
	const uint32_t timeToUpdateLcd = 35;
	const uint32_t timeToUpdate7Segs = 8;
	const uint32_t timeToToggleLed = 8;

	uint32_t counterUpdateLcd = 0;
	uint32_t counterUpdate7Segs = 0;
	uint32_t counterToggleLed = 0;

	uint8_t value7Segs = '0';

	uint16_t adcValue = 0;

	bool_t stateTec1 = TRUE;
	bool_t stateTec2 = TRUE;

	uint8_t lcdMessageIndex = 0;
	char lcdMessages[4][50] = {
			"Hola desde ViHard! Este es un mensaje multilinea",
			"Mensaje linea 1",
			"Mensaje linea 2",
			"Mensaje linea 3"
	};


	while(1){
		// Lee el ADC virtual y envia el valor al DAC virtual
//		Vh_AdcRead(VH_ADC_CH1, &adcValue);
		Vh_DacWrite(VH_DAC_CH1, adcValue);
		// Enciende VH_LED1 si VHTEC1 esta pulsada, sino lo apaga
//		Vh_GpioRead(VH_TEC1, &stateTec1);
		Vh_GpioWrite(VH_LED1, !stateTec1);
		// Enciende VH_LED2 si VHTEC2 esta pulsada, sino lo apaga
//		Vh_GpioRead(VH_TEC2, &stateTec2);
		Vh_GpioWrite(VH_LED2, !stateTec2);
		// Pasado un tiempo togglea led virtual y led fisico de la EDU CIAA
		if (++counterToggleLed >= timeToToggleLed){
			// Toggle del pin virtual VH_LED3
			Vh_GpioToggle(VH_LED4);
			counterToggleLed = 0;
		}
		// Pasado un tiempo actualiza el valor del display 7 segmentos
		if (++counterUpdate7Segs >= timeToUpdate7Segs){
			Vh_7SegmentsWrite(VH_7SEG, value7Segs);
			if (++value7Segs > '9'){
				value7Segs = '0';
			}
			counterUpdate7Segs = 0;
		}
		// Pasado un tiempo actualiza el valor del display LCD
		if (++counterUpdateLcd >= timeToUpdateLcd){
			Vh_LcdWriteString(
					VH_LCD1,
					(LcdLine_t) (lcdMessageIndex + '0'),
					lcdMessages[lcdMessageIndex]
			);
			if (++lcdMessageIndex > 3){
				lcdMessageIndex = 0;
			}
			counterUpdateLcd = 0;
		}
	}
}

/*==================[external functions definition]==========================*/

int main(void){

	Vh_BoardConfig(VIHARD_BAUDRATE);

	TestVhIntegral();

	return 0 ;
}

/*==================[end of file]============================================*/

