// Library required for read files.
fs = require('fs');

// Relative path of project.
const HTML_CONTACT = __dirname + '/' + 'contact.html';

// Read the content of file and save it in a variable.
var HtmlContact = fs.readFileSync(HTML_CONTACT, 'utf8');

// Write to HTML document the content recently readed.
document.write(HtmlContact);
