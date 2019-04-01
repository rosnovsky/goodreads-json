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

  function buildUserInfoUrl(userId, key) {
    return `${goodreadBaseUrl}user/show/${userId}.xml?key=${key}`;
  }

  function buildBookAllShelvesUrl(userId, key) {
    return `${goodreadBaseUrl}review/list/${userId}.xml?key=${key}&v=2`;
  }

  function buildBookShelvesUrl({ key, userId, shelf, sort, order, query, page, perPage }) {
    const baseUrl = buildBookAllShelvesUrl(userId, key);
    const extraParameters = [''];
    if (shelf) {
      extraParameters.push(`shelf=${shelf}`);
    }
    if (sort) {
      extraParameters.push(`sort=${sort}`);
    }
    if (order) {
      extraParameters.push(`order=${order}`);
    }
    if (query) {
      extraParameters.push(`search[query]=${encodeURI(query)}`);
    }
    if (page) {
      extraParameters.push(`page=${page}`);
    }
    if (perPage) {
      extraParameters.push(`per_page=${perPage}`);
    }

    const extraParametersString = extraParameters.length > 1 ? extraParameters.join('&') : '';
    return baseUrl + extraParametersString;
  }

  function isUrlString(bookUrl) {
    return typeof bookUrl === 'string' && urlRegex.test(bookUrl);
  }

  function fetchAndConvertToJson(url) {
    return fetch(url)
      .then(res => {
        switch (res.status) {
          case 200:
            return res.text();
          case 401:
            throw new Error('Invalid API key.');
          default:
            throw new Error(`HTTP Error ${res.status}: ${res.body}`);
        }
      })
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

  this.getUserInfo = function(userId, key) {
    if (typeof userId !== 'number' && typeof userId !== 'string') {
      throw new TypeError('Parameter userId should be string or number');
    }
    const userUrl = buildUserInfoUrl(userId, key || this.key);
    return fetchAndConvertToJson(userUrl).then(res => res.GoodreadsResponse.user);
  };

  this.getShelfBooks = function(request) {
    let shelfUrl;
    if (typeof request === 'string' || typeof request === 'number') {
      shelfUrl = buildBookAllShelvesUrl(request, this.key);
    } else if (typeof request === 'object') {
      request.key = request.key || this.key;
      shelfUrl = buildBookShelvesUrl(request);
    }

    if (!shelfUrl) {
      throw new TypeError('Parameter should be string or number for userId or object for extra options.');
    }

    return fetchAndConvertToJson(shelfUrl).then(res => res.GoodreadsResponse.reviews);
  };
};
