const goodreads = require('./index');

describe('getBookInfo', () => {
  test('should get information about the "Never split the difference"', async () => {
    const book = await new goodreads(process.env.GOODREADS_KEY).getBookInfo({
      title: 'Never split the difference'
    });
    expect(book.id).toEqual(26156469);
    expect(book.isbn).toEqual('0062407805');
    expect(book.publisher).toEqual('HarperBusiness');
    expect(book.publication_year).toEqual(2016);
  });
});
