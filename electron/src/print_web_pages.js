// Library required for read files.
fs = require('fs');

// Relative path of project.
const COMPONENTS_HTML    = __dirname + '/' + 'periphericals.html';
const CONTACT_HTML       = __dirname + '/' + 'contact.html';
const DOCUMENTATION_HTML = __dirname + '/' + 'documentation.html';
const SOURCE_CODE_HTML   = __dirname + '/' + 'source_code.html';

// todo: a futuro se podran poner en un array los paths html y recorrerlos con un for

function PrintHtmlFiles () {
    // Read file and print it into html code
    let HtmlFileContent = fs.readFileSync(COMPONENTS_HTML, 'utf8');
    document.write(HtmlFileContent);

    // Read file and print it into html code
    HtmlFileContent = fs.readFileSync(SOURCE_CODE_HTML, 'utf8');
    document.write(HtmlFileContent);

    // Read file and print it into html code
    HtmlFileContent = fs.readFileSync(DOCUMENTATION_HTML, 'utf8');
    document.write(HtmlFileContent);

    // Read file and print it into html code
    HtmlFileContent = fs.readFileSync(CONTACT_HTML, 'utf8');
    document.write(HtmlFileContent);
}

PrintHtmlFiles ()


