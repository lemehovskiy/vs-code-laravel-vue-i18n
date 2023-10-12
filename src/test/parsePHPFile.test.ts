import parsePHPFile from "../parsePHPFile";

var assert = require("assert");

test("Parse empty array", () => {
	assert.deepStrictEqual(
	  parsePHPFile(`<?php
	
	  return [
		 
	  ];`),
	  {}
	);
  });
  
