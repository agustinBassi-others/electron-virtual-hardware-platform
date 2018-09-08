
InitApplication ()

/**
 * Chequea el tamaño de la pantalla y en funcion del tamaño ajusta el zoom.
 * Esta funcion es llamada desde Logic_InitializaApp()
 * Debido a que los componentes de la APP tienen un tamaño fijo, en vez de 
 * estar ajustando escalas de componentes, lo que se hace es darle mas o 
 * menos zoom dependiendo del tamaño de la ventana. De esta manera siempre 
 * se mantiene constante la relacion de aspecto.
 */
function View_AdjustAppZoom() {

  /////////////////////////////////////////
  // DEBUG PARA AJUSTAR ZOOM CON EL ADC
  //
  // let zoomFactor = Adc1Value / 1024;
  // if (zoomFactor < 0.5) {
  //   zoomFactor = 1.0 - (0.5 - zoomFactor);
  // } else {
  //   zoomFactor = 1.0 + (zoomFactor - 0.5);
  // }
  // LcdText = "ADC: " + Adc1Value + " - Scl: " + zoomFactor;
  // View_SetZoomFactor(zoomFactor);
  //
  /////////////////////////////////////////

  // Tamanos de resoluciones indexadas
  const AVIABLE_RESOLUTIONS = 7;
  // Posible desvio de tamanos de resoluciones
  const RESOLUTION_BIAS = 0.05;
  // Resoluciones indexadas
  const absoluteResolutions = [
    573340,  //(1024 x 600)  - 60 (barra inicio) 
    724992,  //(1024 x 768)  - 60 (barra inicio)
    884800,  //(1280 x 720)  - 60 (barra inicio)
    967128,  //(1366 x 768)  - 60 (barra inicio)
    1344000, //(1600 x 900)  - 60 (barra inicio)
    1958400, //(1920 x 1080) - 60 (barra inicio)
    3532800  //(2560 x 1440) - 60 (barra inicio)
  ];
  // Factores de zoom indexados dependiendo la resolucion de pantalla
  const absoluteZooms = [
    0.77,
    0.80,
    0.93,
    1.01,
    1.2,
    1.43,
    1.8
  ];

  // Obtiene el tamano de la pantalla, su producto y la
  // posible desviacion de los tamanos indexados
  // const screen = require('electron').screen;
  // const display = screen.getPrimaryDisplay();
  // var dimensions = display.size;
  // let width = dimensions.width;
  // let height = dimensions.height;
  const electron = require('electron')
  const remote = electron.remote;
  let height = remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds().height;
  let width = remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds().width;
  let resolutionProduct = width * height;
  let sizeBias = resolutionProduct * RESOLUTION_BIAS;

  // En funcion del tamano de la pantalla calcula el posible zoom
  for (i = 0; i < AVIABLE_RESOLUTIONS; i++){
    // Si el tamano de pantalla encaja con los indexados +- una desviacion
    if (resolutionProduct > (absoluteResolutions[i] - sizeBias) && resolutionProduct < (absoluteResolutions[i] + sizeBias)){
      // Ajusta el zoom al tamano de pantalla apropiado
      const { webFrame } = require('electron');
      webFrame.setZoomFactor(absoluteZooms[i]);
      break;
    }
  }

  // Muestra por consola la informacion procesada
  console.log("View_AdjustAppZoom" + "Resolution: " + width + " x " + height);
  console.log("View_AdjustAppZoom" + "Resolution product: " + resolutionProduct + ", posible bias: " + sizeBias);
  console.log("View_AdjustAppZoom" + "Zoom calculated " + absoluteZooms[i]);
  
}

function ManageHtmlToShow(htmlToShow) {

  if (htmlToShow == "Periphericals") {

    document.getElementById("InnetHtmlContainer_Components").style.display = 'block';
    document.getElementById("InnetHtmlContainer_Source").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Documentation").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Contact").style.display = 'none';

  } else if (htmlToShow == "Source") {

    document.getElementById("InnetHtmlContainer_Components").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Source").style.display = 'block';
    document.getElementById("InnetHtmlContainer_Documentation").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Contact").style.display = 'none';

  } else if (htmlToShow == "Documentation") {

    document.getElementById("InnetHtmlContainer_Components").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Source").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Documentation").style.display = 'block';
    document.getElementById("InnetHtmlContainer_Contact").style.display = 'none';

  } else if (htmlToShow == "Contact") {

    document.getElementById("InnetHtmlContainer_Components").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Source").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Documentation").style.display = 'none';
    document.getElementById("InnetHtmlContainer_Contact").style.display = 'block';


  } else {
    console.log("Invalid htmlToShow")
  }

}

function InitApplication () {
  View_AdjustAppZoom();

  document.getElementById("LinkHome").addEventListener('click', (e) => {
    ManageHtmlToShow("Periphericals");
  });

  document.getElementById("LinkSource").addEventListener('click', (e) => {
    ManageHtmlToShow("Source");
  });

  document.getElementById("LinkManual").addEventListener('click', (e) => {
    ManageHtmlToShow("Documentation");
  });

  document.getElementById("LinkContact").addEventListener('click', (e) => {
    ManageHtmlToShow("Contact");
  });

  ManageHtmlToShow("Periphericals")
}

/*==================[internal function declaration]==========================*/
