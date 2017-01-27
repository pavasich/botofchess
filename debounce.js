function debounce(fn, delay) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const bounced = function() {
      timeout = null;
      fn.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(bounced, delay);
  };
};

module.exports = debounce;
