/* eslint no-console: off */

const { expect } = require('chai');

const { stdout, stderr } = require('../lib/index');

describe('stdout', function () {
  it('mocks', async function () {
    stdout.start();
    console.log('foo');
    expect((await stdout.done()).toString('utf8')).to.equal('foo\n');
  });
});

describe('stderr', function () {
  it('mocks', async function () {
    stderr.start();
    console.error('foo');
    expect((await stderr.done()).toString('utf8')).to.equal('foo\n');
  });
});
