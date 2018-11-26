#ifndef _MIN_UNIT_H_
#define _MIN_UNIT_H_

#define MINUNIT_ASSERT(errorMessage, conditionToEvaluate) do { if (!(conditionToEvaluate)) return errorMessage; } while (0)

#define MINUNIT_RUN_TEST(functionToTest) do { char *errorMessage = functionToTest(); AmountTestsRun++; if (errorMessage) return errorMessage; } while (0)

int MinUnit_AmountTestsRun (void);

static int AmountTestsRun = 0;

int MinUnit_AmountTestsRun (void) { return AmountTestsRun; };

#endif
