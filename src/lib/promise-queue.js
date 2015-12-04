export class PromiseQueue {
  constructor($q) {
    this._queue = [];
    this._pause = false;

    this.$q = $q;
  }

  add(func, instant) {
    if (Array.isArray(func)) {
      this._queue = this._queue.concat(func);
    } else if(typeof func === 'function') {

      if(instant || false){
        this._queue.unshift(func);
      } else {
        this._queue.push(func);
      }
    }else{
      throw new Error('No functions provided');
    }

    if (this._pause) {
      this.start();
    }

    return this;
  }

  start() {
    this._pause = false;
    this.next();

    return this;
  }

  drain() {
    this._queue = [];

    return this;
  }

  instant(func) {
    this.add(func, true);

    return this;
  }

  remove(func) {
    for(var i = 0; i < this._queue.length; i++) {
      if(func === this._queue[i]) {
        this._queue.splice(i, 1);
      }
    }

    return this;
  }

  pause() {
    this._pause = true;

    return this;
  }

  next() {
    if(this._pause === true) return;
    if(this._queue.length === 0) {
      this.pause();
      return;
    }

    var func = this._queue.shift();
    this.promisify(func).then(() => { this.next(); })
  }

  promisify(func) {
    const deferred = this.$q.defer();

    func(() => { deferred.resolve(); });
    return deferred.promise;
  }
}
