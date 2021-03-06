const goodreads = require('./index');
const nock = require('nock');

const server = 'https://www.goodreads.com';

describe('getBookInfo', () => {
  test('should throw error if parameter is not string or object', () => {
    expect(() => {
      new goodreads().getBookInfo(5);
    }).toThrow(TypeError);
  });

  test('should throw error if parameter is not valid url string', () => {
    expect(() => {
      new goodreads().getBookInfo('not valid url');
    }).toThrow(TypeError);
  });

  test('should throw error if parameter is object but does not have title', () => {
    expect(() => {
      new goodreads().getBookInfo({ author: 'Shakespeare' });
    }).toThrow(TypeError);
  });

  test('should return result if parameter is valid url', async () => {
    const url = '/book/title.xml?author=author&key=SOMEKEY&title=title';
    const bookUrl = server + url;
    const nockBook = 'nock book';

    nock(server)
      .get(url)
      .reply(200, `<GoodreadsResponse><book>${nockBook}</book></GoodreadsResponse>`);

    const book = await new goodreads().getBookInfo(bookUrl);
    expect(book).toEqual(nockBook);
  });

  test('should return result if parameter is valid object with key', async () => {
    const url = '/book/title.xml?title=title&key=SOMEKEY&author=author';
    const nockBook = 'nock book';

    nock(server)
      .get(url)
      .reply(200, `<GoodreadsResponse><book>${nockBook}</book></GoodreadsResponse>`);

    const book = await new goodreads().getBookInfo({
      author: 'author',
      title: 'title',
      key: 'SOMEKEY'
    });
    expect(book).toEqual(nockBook);
  });

  test('should return result if parameter is valid object and key passed in constructor', async () => {
    const url = '/book/title.xml?title=title&key=SOMEKEY&author=author';
    const nockBook = 'nock book';

    nock(server)
      .get(url)
      .reply(200, `<GoodreadsResponse><book>${nockBook}</book></GoodreadsResponse>`);

    const book = await new goodreads('SOMEKEY').getBookInfo({
      author: 'author',
      title: 'title'
    });
    expect(book).toEqual(nockBook);
  });

  test('should throw Error if http request returned 401 error', async () => {
    const url = '/book/title.xml?title=title&key=SOMEKEY&author=author';
    const nockBook = 'nock book';

    nock(server)
      .get(url)
      .reply(401, 'Unauthorized');

    expect.assertions(1);
    try {
      await new goodreads('SOMEKEY').getBookInfo({
        author: 'author',
        title: 'title'
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test('should throw Error if http request returned 500 error', async () => {
    const url = '/book/title.xml?title=title&key=SOMEKEY&author=author';
    const nockBook = 'nock book';

    nock(server)
      .get(url)
      .reply(500, 'Internal server error');

    expect.assertions(1);
    try {
      await new goodreads('SOMEKEY').getBookInfo({
        author: 'author',
        title: 'title'
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});

describe('getUserInfo', () => {
  test('should throw error if parameter userId is undefined', () => {
    expect(() => {
      new goodreads().getUserInfo();
    }).toThrow(TypeError);
  });

  test('should throw error if parameter userId is not string or nubmer', () => {
    expect(() => {
      new goodreads().getUserInfo(true);
    }).toThrow(TypeError);
  });

  test('should return result if parameter is valid userId', async () => {
    const url = '/user/show/42.xml?key=SOMEKEY';
    const nockUser = 'nock user';

    nock(server)
      .get(url)
      .reply(200, `<GoodreadsResponse><user>${nockUser}</user></GoodreadsResponse>`);

    const book = await new goodreads().getUserInfo(42, 'SOMEKEY');
    expect(book).toEqual(nockUser);
  });

  test('should return result if parameter is valid userId and get key from constructor', async () => {
    const url = '/user/show/42.xml?key=SOMEKEY';
    const nockUser = 'nock user';

    nock(server)
      .get(url)
      .reply(200, `<GoodreadsResponse><user>${nockUser}</user></GoodreadsResponse>`);

    const book = await new goodreads('SOMEKEY').getUserInfo(42);
    expect(book).toEqual(nockUser);
  });
});

describe('getShelfBooks', () => {
  test('should throw error if parameters are undefined', () => {
    expect(() => {
      new goodreads().getShelfBooks();
    }).toThrow(TypeError);
  });

  test('should throw error if parameter userId is not string or nubmer', () => {
    expect(() => {
      new goodreads().getShelfBooks(true);
    }).toThrow(TypeError);
  });

  test('should return result if parameter is valid userId', async () => {
    const url = '/review/list/42.xml?key=SOMEKEY&v=2';
    const nockReviews = 'nock reviews';

    nock(server)
      .get(url)
      .reply(200, `<GoodreadsResponse><reviews>${nockReviews}</reviews></GoodreadsResponse>`);

    const book = await new goodreads('SOMEKEY').getShelfBooks(42);
    expect(book).toEqual(nockReviews);
  });

  test('should return result if parameter is object with userId', async () => {
    const url = '/review/list/42.xml?key=SOMEKEY&v=2';
    const nockReviews = 'nock reviews';

    nock(server)
      .get(url)
      .reply(200, `<GoodreadsResponse><reviews>${nockReviews}</reviews></GoodreadsResponse>`);

    const book = await new goodreads('SOMEKEY').getShelfBooks({ userId: 42 });
    expect(book).toEqual(nockReviews);
  });

  test('should return result if parameter is valid userId and get key from constructor', async () => {
    const url = '/review/list/42.xml?key=SOMEKEY&v=2';
    const nockReviews = 'nock reviews';

    nock(server)
      .get(url)
      .reply(200, `<GoodreadsResponse><reviews>${nockReviews}</reviews></GoodreadsResponse>`);

    const book = await new goodreads('SOMEKEY').getShelfBooks(42);
    expect(book).toEqual(nockReviews);
  });

  test('should return result and apply extra options', async () => {
    const url =
      '/review/list/42.xml?key=SOMEKEY&v=2&shelf=read&sort=random&order=a&search[query]=split%20the&page=1&per_page=10';
    const nockReviews = 'nock reviews';

    nock(server)
      .get(url)
      .reply(200, `<GoodreadsResponse><reviews>${nockReviews}</reviews></GoodreadsResponse>`);

    const book = await new goodreads('SOMEKEY').getShelfBooks({
      userId: 42,
      shelf: 'read',
      sort: 'random',
      order: 'a',
      query: 'split the',
      page: 1,
      perPage: 10
    });
    expect(book).toEqual(nockReviews);
  });
});

nock.cleanAll();
