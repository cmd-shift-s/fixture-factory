module.exports = faker => {
  function bindAll(obj) {
    Object.keys(obj).forEach(function(meth) {
      if (typeof obj[meth] === 'function') {
        obj[meth] = obj[meth].bind(obj);
      }
    });
    return obj;
  }

  faker.num = bindAll(require('./number'))
}
