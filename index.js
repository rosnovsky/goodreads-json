module.exports = function goodreads(key) {
  this.key = key || '';

  const convert = require('./xml2js-ext');
  const fetch = require('node-fetch');
  const urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  const goodreadBaseUrl = 'https://www.goodreads.com/';

  function buildBookUrl(title, key, author) {
    if (typeof title !== 'string') {
      throw new TypeError('Goodreads JSON Book request requires title to be non-empty string.');
    }
    const authorForRequest = author ? encodeURI(author) : '';
    const titleForRequest = encodeURI(title);
    return `${goodreadBaseUrl}book/title.xml?title=${titleForRequest}&key=${key}&author=${authorForRequest}`;
  }

  function isUrlString(bookUrl) {
    return typeof bookUrl === 'string' && urlRegex.test(bookUrl);
  }

  function fetchAndConvertToJson(url) {
    return fetch(url)
      .then(res => res.text())
      .then(body => {
        const json = convert(body.toString());
        return JSON.parse(json);
      });
  }

  this.getBookInfo = function(request) {
    const isUrl = isUrlString(request);
    const isBookRequestOjbect = typeof request === 'object';
    let bookUrl;

    if (isUrl) {
      bookUrl = request;
    } else if (isBookRequestOjbect) {
      bookUrl = buildBookUrl(request.title, request.key || this.key, request.author);
    }

    if (!bookUrl) {
      throw new TypeError('Goodreads JSON Book requires a URL or book request object as an argument.');
    } else {
      return fetchAndConvertToJson(bookUrl).then(res => res.GoodreadsResponse.book);
    }
  };
};
