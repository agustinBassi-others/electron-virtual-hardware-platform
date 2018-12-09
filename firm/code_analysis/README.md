En este archivo se describe como realizar el analisis estatico del firmware con la herramienta SonarCloud.

----------------

REQUERIMIENTOS

- Tener una cuenta en SonarCloud (se puede acceder con la cuenta de Github)
- Crear un nuevo proyecto en SonarCloud para realizar el analisis
- Tener un archivo Makefile para compilar el proyecto
- Descargar/instalar las herramientas build-wrapper y sonar-scanner necesarias en el proceso
- Generar un Token para vincular la plataforma Sonar con el proyecto

----------------

ACLARACIONES

- Los archivos de la biblioteca vihard (vihard.h y vihard.c) son una copia de los archivos que estan en las carpetas inc y src respectivamente.
  El motivo de haberlos copiado es que para realizar el analisis estatico del codigo fuente con SonarCloud, si se hacia directamente desde el
  proyecto del ciaa firmware en el que estaban, el analisis de Sonar abarcaba todos los archivos del firmware, totalmente innecesario para este caso.

- Otra aclaracion importante es que, para poder generar un Makefile que no incluya la compilacion de otros archivos que no sean los implicados en
  este proyecto, se realizo la compilacion del proyecto para PC con gcc (arquitecturas x86-amd64). De esta forma, el binario generado no se puede
  ejecutar en un sistema embebido.

- El archivo main.c se hace un llamado a la funcion TestVhIntegral(). Esta funcion realiza un test completo
  de la plataforma vihard llamando a todas sus funciones, dentro de un programa. 

- Fueron quitadas todas las llamadas a funciones que hacian uso de la biblioteca sAPI (del proyecto CIAA) para que compile con gcc.

----------------

COMPILACION DEL PROYECTO

Para este proyecto se creo un Makefile que realiza la compilacion de los archivos main.c, vihard.h y vihard.c

Ejecutando dentro de este directorio la instruccion 'make' se compila el codigo fuente, se generan los obj y se crea un binario llamado main

Ejecutando 'make clean' se borran los archivos .o y main respectivamente

----------------

REALIZAR EL ANALISIS DEL CODIGO

Para poder visualizar el codigo fuente y analizar su calidad en SonarCloud es necesario compilar el proyecto con build-wrapper que agrega info en la compilacion.
Primero se deben exportar las variables de entorno correspondientes a los programas build-wrapper y sonar-scanner

$ export PATH=$PATH:$HOME/Programas/sonar-scanner-3.2.0.1227-linux/bin/
$ export PATH=$PATH:$HOME/Programas/build-wrapper-linux-x86

Para eso, es necesario ejecutar el siguiente comando en el directorio:

$ build-wrapper-linux-x86-64 --out-dir bw-output make clean all

Esto genera informacion adicional en la compilacion para ser analizada posteriormente.
El siguiente paso es enviar esa informacion a la nube con sonar-scanner. Este paso requiere que previamente se generen unas credenciales, y pasar algunos parametros al comando.
Afortunadamente, cuando se crea el proyecto en la web de Sonar, dentro de los pasos para llegar al analisis, se brindan oportunamente los comandos para copiar y pegar en la consola.
El comando que se ejecuto para realizar enviar los datos a la nube fue el siguiente:

$ sonar-scanner   -Dsonar.projectKey=ViHardLib_001   -Dsonar.organization=agustinbassi-github   -Dsonar.sources=.   -Dsonar.cfamily.build-wrapper-output=bw-output   -Dsonar.host.url=https://sonarcloud.io   -Dsonar.login=60be97f4bdb81f3e720416f1f825ad3004136590

Si todo salio bien, el analisis puede ser visto en la web de SonarCloud y poder tomar las precauciones necesarias.

