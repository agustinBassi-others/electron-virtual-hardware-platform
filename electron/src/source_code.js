var fs = require('fs');

function ShowSourceFile(event, sourceFileName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("TabContent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("TabLink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(sourceFileName).style.display = "block";
    event.currentTarget.className += " active";
}


function CopyToClipboard (fileToCopyToClipboard){
    const {clipboard} = require('electron')

    console.log("El path a copiar es: " + fileToCopyToClipboard)

    let fileContent = fs.readFileSync(fileToCopyToClipboard, 'utf8')
    
    console.log("El contenido es: " + fileContent)

    clipboard.writeText(fileContent)

    // clipboard.writeText(fileContent, 'selección')

    
    // // Si se quiere copiar el .h copa al portapapeles el contenido del header
    // if (button == "h"){
    //     clipboard.writeText(HEADER_CONTENT, 'selección')
    // } 
    // // Si se quiere copiar el .h copa al portapapeles el contenido del header
    // else if (button == "c"){
    //     clipboard.writeText(SOURCE_CONTENT, 'selección')
    // }
}

