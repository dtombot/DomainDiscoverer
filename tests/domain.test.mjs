import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanDomain, normalizeDomain, withExtension, domainPattern } from '../src/utils/domain.mjs';

test('accepts basic names and applies .com only when absent', () => {
  assert.equal(normalizeDomain('   MyBrand  '),'mybrand.com');
  assert.equal(normalizeDomain('MyBrand.NET'),'mybrand.net');
  assert.equal(normalizeDomain('example.co.uk'),'example.co.uk');
});

test('pasted website URLs produce a domain instead of a path', () => {
  assert.equal(cleanDomain(' HTTPS://WWW.Example.COM/guide?ref=hi '),'example.com');
  assert.equal(cleanDomain('https://www.example.org/#contact'),'example.org');
});

test('extension selection is a local string update, not an API call', () => {
  assert.equal(withExtension('mybrand.com','.net'),'mybrand.net');
  assert.equal(withExtension('mybrand.co.uk','.org'),'mybrand.org');
  assert.equal(withExtension('mybrand','.app'),'mybrand.app');
  assert.equal(withExtension('', '.io'), '');
  assert.throws(() => withExtension('mybrand.com','https://bad'), /Invalid extension/);
});

test('rejects invalid domain labels before any lookup', () => {
  assert.equal(domainPattern.test(normalizeDomain('mybrand')),true);
  assert.equal(domainPattern.test('good-example.com'),true);
  assert.equal(domainPattern.test('bad space.com'),false);
  assert.equal(domainPattern.test('-bad.com'),false);
  assert.equal(domainPattern.test('bad-.com'),false);
  assert.equal(domainPattern.test('example.com:8080'),false);
  assert.equal(domainPattern.test('example'),false);
});
