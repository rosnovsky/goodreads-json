const convert = require('xml-js');
const fetch = require('node-fetch');

async function goodreadsBookJSON(bookUrl) {
  const regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

  if (typeof bookUrl !== 'string' || !regex.test(bookUrl)) {
    throw new TypeError('Goodreads JSON Book requires a URL as an argument!');
  } else {
    const bookData = await fetch(bookUrl)
      .then(res => res.text())
      .then(body => {
        const json = convert.xml2json(body.toString(), {
          compact: true
        });
        const book = JSON.parse(json);
        return book.GoodreadsResponse.book;
      })
      .then(result => {
        return result;
      })
      .catch(error => {
        throw new Error(error);
      });
    return bookData;
  }
}
