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

describe('getUserInfo', () => {
  test('should get information about the user', async () => {
    const user = await new goodreads(process.env.GOODREADS_KEY).getUserInfo(4342973);
    expect(user.id).toEqual(4342973);
    expect(user.favorite_authors.author.length).toBeGreaterThan(1);
    expect(user.reviews_count).toBeGreaterThan(1);
  });
});

describe('getShelfBooks', () => {
  test('should get information about the all books', async () => {
    const reviews = await new goodreads(process.env.GOODREADS_KEY).getShelfBooks(4342973);
    expect(reviews.review.length).toBeGreaterThan(1);
  });

  test('should get information about the books by filters', async () => {
    const reviews = await new goodreads(process.env.GOODREADS_KEY).getShelfBooks({
      userId: 4342973,
      page: 1,
      perPage: 10,
      shelf: 'read',
      sort: 'random'
    });
    expect(reviews.review.length).toBeGreaterThan(1);
  });
});
