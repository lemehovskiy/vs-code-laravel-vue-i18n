import sanitizeInputText from "../sanitizeInputText";

var assert = require("assert");

test("Sanitize extra spaces", () => {
  assert.deepStrictEqual(
    sanitizeInputText(`asdf 
    asdf,
    asdf   asdf`),
    'asdf asdf, asdf asdf'
  );
});

test("Sanitize single quotes", () => {
    assert.deepStrictEqual(
      sanitizeInputText(`asdf 
      asd'f,
      asdf   asd'f`),
      'asdf asd\\\'f, asdf asd\\\'f'
    );
  });
  
