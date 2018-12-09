# La siguiente no es necesariamente requerida, se agrega para
# mostrar como funciona.

.SUFFIXES: .o .c
.c.o:
	$(CC) -c $(CFLAGS) $<


# Macros

CC = gcc
CFLAGS = -g -Wall -O2
SRC = main.c vihard.c vihard.h
OBJ = main.o vihard.o


# Reglas explicitas

all: $(OBJ)
	$(CC) $(CFLAGS) -o main $(OBJ)

clean:
	$(RM) $(OBJ) main

# Reglas implicitas

funciones.o: vihard.c vihard.h
main.o: main.c vihard.h

