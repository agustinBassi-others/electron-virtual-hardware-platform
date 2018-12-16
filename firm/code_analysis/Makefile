# La siguiente no es necesariamente requerida, se agrega para
# mostrar como funciona.

.SUFFIXES: .o .c
.c.o:
	$(CC) -c $(CFLAGS) $<


# Macros

CC = gcc
CFLAGS = -g -Wall -O2
SRC = test_vihard.c vihard.c vihard.h
OBJ = test_vihard.o vihard.o


# Reglas explicitas

all: $(OBJ)
	$(CC) $(CFLAGS) -o test_vihard $(OBJ)

clean:
	$(RM) $(OBJ) test_vihard

# Reglas implicitas

funciones.o: vihard.c vihard.h
test_vihard.o: test_vihard.c vihard.h

