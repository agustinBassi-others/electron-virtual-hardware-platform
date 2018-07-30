// Library required for read files.
fs = require('fs');

// Relative path of project.
const HTML_COMPONENTS = __dirname + '/' + 'components.html';

// Read the content of file and save it in a variable.
var HtmlComponents = fs.readFileSync(HTML_COMPONENTS, 'utf8');

// Write to HTML document the content recently readed.
document.write(HtmlComponents);
