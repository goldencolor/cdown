;(function() {
  var CountDown = function(options) {
    options = options || {};
    // default config
    this.defaults = {
      start: null,
      end: null,
      callback: function() {

      },
      finishText: '结束了',
      pattern: '',
      unit: this.SECOND
    };
    // override default configs
    for (var attr in options) {
      if (options.hasOwnProperty(attr)) {
        this.defaults[attr] = options[attr];
      }
    }
    // start and end time
    this.start = this.defaults.start ? this.defaults.start.getTime() : Date.now();
    this.end = this.defaults.end ? this.defaults.end.getTime() : Date.now();
  };
  CountDown.SECOND = 1000;
  CountDown.MINUTE = 60 * 1000;
  CountDown.HOUR = 60 * 60 * 1000;
  CountDown.DAY = 24 * 60 * 60 * 1000;
  CountDown.prototype = {
    Constructor: CountDown,
    count: function() {
      var duration = Math.round((this.end - this.start)/1000);
      if (duration >= 0) {
          this['second'] = duration % 60,
          this['minute'] = Math.floor(duration / 60) > 0 ? Math.floor(duration/60) % 60 : 0,
          this['hour'] = Math.floor(duration / 3600) > 0 ? Math.floor(duration/3600) % 24 : 0,
          this['day'] = Math.floor(duration / 86400) > 0 ? Math.floor(duration/86400) % 30 : 0,
          this['month'] = Math.floor(duration / 2629744) > 0 ? Math.floor(duration/2629744) % 12 : 0,
          this['year'] = Math.floor(duration / 31556926) > 0 ? Math.floor(duration/31556926) : 0;
        this.start += this.defaults.unit;
      } else {
        // 结束了
        this.hide();
        return;
      }
      var types = ['month', 'day', 'hour', 'minute', 'second'],
        self = this;
      types.forEach(function(type) {
        self[type[0].toUpperCase() + type.slice(1)] = self.leadZero(self[type]);
      });
      this.element.innerHTML = this.toString();
    },
    leadZero: function(num) {
      var str = String(num);
      return str.length < 2 ? '0'+str : str;
    },
    // 将显示模式转为字符串
    compilePattern: function(pattern) {
      var startTag = '{',
        endTag = '}',
        startLen = startTag.length,
        endLen = endTag.length,
        attrs = [];
      while(true) {
        var sIndex = pattern.indexOf(startTag),
          eIndex = pattern.indexOf(endTag, sIndex),
          begin = startLen + sIndex;
        if (begin >= startLen && eIndex > sIndex) {
          attrs.push(pattern.substring(0, sIndex));
          var attr = pattern.substring(begin, eIndex);
          if (attr in this) {
            throw new Error('pattern error.');
            return;
          }
          attrs.push({attr: attr});
          pattern = pattern.slice(eIndex + endLen);
        } else {
          attrs.push(pattern);
          break;
        }
      }
      return attrs;
    },
    // start the countdown
    show: function(element) {
      var self = this;
      typeof element == 'string' && (element = document.querySelector(element));
      if (element.nodeType != Node.ELEMENT_NODE) {
        throw new Error('param element is not an HTML Element');
        return;
      }
      this.element = element;
      var pattern = this.defaults.pattern ? this.defaults.pattern : this.element.innerHTML;
      this.patterns = this.compilePattern(pattern);

      self.count();

      this._interval = setInterval(function() {
        self.count();
      }, self.defaults.unit);
    },
    // stop the countdown
    hide: function() {
      var callback = this.defaults.callback;
      clearInterval(this._interval);
      this.element.innerHTML = this.defaults.finishText;
      callback.call(this.element);
    },
    toString: function() {
      var results = [],
        patterns = this.patterns;
      for (var i = 0, len = patterns.length; i < len; i++) {
        block = patterns[i];
        if (block.attr) {
          results.push(this[block.attr]);
        } else {
          results.push(block);
        }
      }
      return results.join('');
    }
  };
  window.CountDown = CountDown;
}());
