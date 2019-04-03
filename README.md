# Goodreads JSON API

## Overview

If you're using Goodreads API, with this package you could use it in JSON. This package accepts a URL to a book (with author's name and book's title) and returns `book` object.

## Installation

```bash
yarn add goodreads-json
yarn install
```

## Usage

Basically, after you've installed the package, you could just import it in your project like this:

```javascript
const goodreads = require('goodreads-json');
```

Now, you can just say things like `const book = goodreads('https://books.url')` and have your `book` object available with all its data.

## Next steps

This package is obviously very limited now. Here's the plan:

- Make all Goodreads APIs available through the package (not only looking up a book via a URL)
- Significantly improve error handling and error messages
- Introduce `options` so that if you're looking for book cover and year published, you'd could just say something like `goodreads(BOOK_ANSI, {title, year})` and have back an object that would look like this:

```json
{
  "ansi": 123456,
  "cover": "https://cover.url",
  "year": 2015
}
```
