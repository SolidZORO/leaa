// prettier-ignore
// eslint-disable-next-line no-extend-native
Promise.prototype.finally = Promise.prototype.finally || {
  finally (fn) {
    const onFinally = cb => Promise.resolve(fn()).then(cb);

    return this.then(
      result => onFinally(() => result),
      reason => onFinally(() => Promise.reject(reason))
    );
  }
}.finally;
