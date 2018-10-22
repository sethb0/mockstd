const concat = require('concat-stream');
const stripAnsi = require('strip-ansi');

class MockStd {
  constructor (which) {
    if (which !== 'stdout' && which !== 'stderr') {
      throw new Error('can only mock stdout or stderr');
    }
    this._which = which;
    this.stripColor = true;
  }

  start () {
    if (this._current) {
      return;
    }
    this._save = process[this._which];
    process[this._which] = this._current = concat((data) => {
      this._data = data;
      process[this._which] = this._save;
      this._save = this._current = null;
    });
  }

  stop () {
    if (!this._current) {
      return;
    }
    this._current.end();
  }

  get output () {
    const str = this._data.toString('utf8');
    return this.stripColor ? stripAnsi(str) : str;
  }

  get outputBuffer () {
    return Buffer.from(this._data);
  }
}

module.exports.stdout = new MockStd('stdout');
module.exports.stderr = new MockStd('stderr');
