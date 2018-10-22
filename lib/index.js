const { promisify } = require('util');

const concat = require('concat-stream');

const immediatePromise = promisify(setImmediate);

class MockStd {
  constructor (which) {
    if (which !== 'stdout' && which !== 'stderr') {
      throw new Error('can only mock stdout or stderr');
    }
    this._which = which;
  }

  start () {
    if (this._current) {
      return;
    }
    this._save = process[this._which].write;
    this._current = concat((data) => {
      this._data = data;
      process[this._which].write = this._save;
      this._save = this._current = null;
    });
    process[this._which].write = this._current.write.bind(this._current);
  }

  async done () {
    if (!this._current) {
      return this._data;
    }
    this._current.end();
    await immediatePromise();
    return this._data;
  }
}

module.exports.stdout = new MockStd('stdout');
module.exports.stderr = new MockStd('stderr');
