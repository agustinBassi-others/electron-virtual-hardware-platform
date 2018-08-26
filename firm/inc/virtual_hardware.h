
#ifndef _VIRTUAL_HARDWARE_H_
#define _VIRTUAL_HARDWARE_H_

#define BOARD_EDU_CIAA_NXP
//#define BOARD_CIAA_ZERO
//#define BOARD_PIC_CSS
//#define BOARD_ARDUINO

//#if defined(BOARD_EDU_CIAA_NXP)
//
//#elif defined(BOARD_CIAA_ZERO)
//
//#elif defined(BOARD_PIC_CSS)
//
//#elif defined(BOARD_ARDUINO)
//
//#else
//    // La plataforma por defecto es EDU_CIAA_NXP
//	#define BOARD_EDU_CIAA_NXP
//#endif


/*==================[inclusions]=============================================*/

#include <stdint.h>

#if defined(BOARD_EDU_CIAA_NXP)
   #include "sapi.h"      // <= sAPI header
#elif defined(BOARD_CIAA_ZERO)

#elif defined(BOARD_PIC_CSS)

#elif defined(BOARD_ARDUINO)

#else
    // La plataforma por defecto es EDU_CIAA_NXP
	#define BOARD_EDU_CIAA_NXP
#endif


/*==================[cplusplus]==============================================*/

#ifdef __cplusplus
extern "C" {
#endif

/*==================[macros]=================================================*/

#define VIRTUAL_BAUDRATE   115200

/*==================[typedef]================================================*/

/**
 * Posibles valores que puede recibir la funcion de escribir un texto
 * sobre el display LCD. LCD_LINE_ALL escribe un mensaje multilinea,
 * los demas valores escriben sobre la primer, segunda o tercer linea del LCD.
 */
typedef enum LcdLine{
	LCD_LINE_ALL    = '0',//!< LCD_LINE_ALL
	LCD_LINE_FIRST  = '1',//!< LCD_LINE_FIRST
	LCD_LINE_SECOND = '2',//!< LCD_LINE_SECOND
	LCD_LINE_THIRD  = '3' //!< LCD_LINE_THIRD
} LcdLine_t;

/**
 * Mapa de perifericos virtuales a los que se puede acceder.
 */
typedef enum VirtualPeriph {
	// Valores corespondientes a los leds
	V_LEDR = 'a',   //!< V_LEDR
	V_LEDG = 'b',   //!< V_LEDG
	V_LEDB = 'z',   //!< V_LEDB
	V_LED1 = 'c',   //!< V_LED1
	V_LED2 = 'd',   //!< V_LED2
	V_LED3 = 'e',   //!< V_LED3
	V_LED4 = 'f',   //!< V_LED4
	// Valores corespondientes a las teclas
	V_TEC1 = 'g',   //!< V_TEC1
	V_TEC2 = 'h',   //!< V_TEC2
	V_TEC3 = 'i',   //!< V_TEC3
	V_TEC4 = 'j',   //!< V_TEC4
	// Valores coorespondientes a los pines ADC
	V_ADC_CH1 = 'k',//!< V_ADC_CH1
	// Valores coorespondientes a los pines DAC
	V_DAC_CH1 = 'n',//!< V_DAC_CH1
	// Valores coorespondientes al periferico LCD
	V_LCD1 = 'o',   //!< V_LCD1
	// Valores coorespondientes al periferico 7 segmentos
	V_7SEG = 'p',   //!< V_7SEG
} VirtualPeriph_t;

/*==================[external data declaration]==============================*/

/*==================[external functions declaration]=========================*/

bool_t   vBoardConfig    (uint32_t baudRate);

bool_t   vGpioRead       (VirtualPeriph_t virtualPin);
void     vGpioWrite      (VirtualPeriph_t virtualPin, bool_t pinState);
void     vGpioToggle     (VirtualPeriph_t virtualPin);

void     vLcdWriteString (VirtualPeriph_t display, LcdLine_t line, char * str);

uint16_t vAdcRead        (VirtualPeriph_t adcChannel);
void     vDacWrite       (VirtualPeriph_t dacChannel, uint16_t dacValue);

void     v7SegmentsWrite (VirtualPeriph_t display, uint8_t valueToShow);

/*==================[cplusplus]==============================================*/

#ifdef __cplusplus
}
#endif

/*==================[end of file]============================================*/
#endif /* #ifndef _VIRTUAL_HARDWARE_H_ */
