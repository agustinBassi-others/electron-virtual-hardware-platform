# La siguiente no es necesariamente requerida, se agrega para
# mostrar como funciona.

.SUFFIXES: .o .c
.c.o:
	$(CC) -c $(CFLAGS) $<


# Macros

CC = gcc
CFLAGS = -g -Wall -O2 -DBOARD_PC
SRC = sonar_test.c vihard.c vihard.h
OBJ = sonar_test.o vihard.o


# Reglas explicitas

all: $(OBJ)
	$(CC) $(CFLAGS) -o sonar_test $(OBJ)

clean:
	$(RM) $(OBJ) sonar_test

# Reglas implicitas

funciones.o: vihard.c vihard.h
sonar_test.o: sonar_test.c vihard.h

