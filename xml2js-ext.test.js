const xml2jsExt = require('./xml2js-ext');

describe('xml2jsExt', () => {
  test('should convert xml to json and remove _text part', () => {
    const json = xml2jsExt('<Doc>test</Doc>');
    expect(json).toEqual('{"Doc":"test"}');
  });

  test('should convert xml to json and remove _text part and convert to boolean', () => {
    const json = xml2jsExt('<Doc>true</Doc>');
    expect(json).toEqual('{"Doc":true}');
  });

  test('should convert xml to json and remove _text part and convert to number', () => {
    const json = xml2jsExt('<Doc>12345</Doc>');
    expect(json).toEqual('{"Doc":12345}');
  });

  test('should convert xml to json and remove _text part from arrays', () => {
    const json = xml2jsExt('<Doc><array>1</array><array>2</array><array>3</array></Doc>');
    expect(json).toEqual('{"Doc":{"array":[1,2,3]}}');
  });

  test('should convert xml to json and remove _text part from nested objects', () => {
    const json = xml2jsExt('<Doc><book><title>Good read</title><author>Writer</author></book></Doc>');
    expect(json).toEqual('{"Doc":{"book":{"title":"Good read","author":"Writer"}}}');
  });

  test('should convert xml to json and remove cdata element', () => {
    const json = xml2jsExt('<Doc><book><![CDATA[9780062407801]]></book></Doc>');
    expect(json).toEqual('{"Doc":{"book":"9780062407801"}}');
  });
});
