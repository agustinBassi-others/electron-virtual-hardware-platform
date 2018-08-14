// Library required for read files.
fs = require('fs');

// Relative path of project.
const HTML_DOCUMENTATION = __dirname + '/' + 'documentation.html';

// Read the content of file and save it in a variable.
var HtmlDocumentation = fs.readFileSync(HTML_DOCUMENTATION, 'utf8');

// Write to HTML document the content recently readed.
document.write(HtmlDocumentation);
