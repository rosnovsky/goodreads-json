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
});
