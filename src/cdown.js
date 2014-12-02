(function(w) {
    function extend(target, source) {
        for(var p  in source) {
            target[p] = source[p];
        }
        return target;
    }
    function borrowMonth(ref, shift) {
        var p = ref.getTime();
        ref.setUTCMonth(ref.getUTCMonth() + shift);
        return Math.round((ref.getTime() - p)/ day);
    }
    function padLeft(num) {
        return num > 9 ? ''+num : '0'+num;
    }

    var second = 1000,
        minute = 60 * second,
        hour = 60 * minute,
        day = 24 * hour,
        seconds_per_minute = 60,
        minutes_per_hour = 60,
        hours_per_day = 24,
        months_per_year = 12,
        ceil = Math.ceil, floor = Math.floor;

    var Cdown = function(params) {
        this.options = {
            edate: new Date(),
            sdate: new Date(),
            pattern: '{MM}:{dd}:{hh}:{mm}:{ss}',
        };
        extend(this.options, params);
    };

    Cdown.prototype.render = function() {
        var o = this.options;

        this.set(o.sdate, o.edate);

        if (this.value <= 0) {
            o.finish && o.finish.call(o.element, o.element);
        } else {
            this.cycle();
        }
    };

    Cdown.prototype.cycle = function() {
        var self = this,
            o = self.options;

        setTimeout(function() {
            o.sdate = new Date(o.sdate.getTime() + o.unit);
            self.set(o.sdate, o.edate);

            if (self.value == 0) {
                o,finish && o.finish.call(o.element, o.element);
            } else {
                self.show(o.element);
                self.cycle();
            }
        }, o.unit);
    };

    Cdown.prototype.show = function(element) {
        var self = this,
            pattern = this.options.pattern;
        element.innerHTML = pattern.replace(/\{([M|m|s|d|h|H]+)\}/g, function(holder) {
            var key = holder.replace(/\{|\}/g, '');
            if (key in self) {
                if (typeof self[key] == 'function') {
                    return self[key]();
                } else {
                    return self[key];
                }
            }
            return '';
        });
    };

    Cdown.prototype.set = function(sd, ed) {
        this.value = ed.getTime() - sd.getTime();

        this.Y = ed.getUTCFullYear() - sd.getUTCFullYear();
        this.M = ed.getUTCMonth() - sd.getUTCMonth();
        this.d = ed.getUTCDate() - sd.getUTCDate();
        this.h = ed.getUTCHours() - sd.getUTCHours();
        this.m = ed.getUTCMinutes() - sd.getUTCMinutes();
        this.s = ed.getUTCSeconds() - sd.getUTCSeconds();

        this.refMonth = new Date(sd.getUTCFullYear(), sd.getUTCMonth(), 2);

        var t;
        if (this.s < 0) {
            t = ceil(-this.s / seconds_per_minute);
            this.m -= t;
            this.s += t * seconds_per_minute;
        } else if (this.s >= seconds_per_minute) {
            this.m += floor(this.s / seconds_per_minute);
            this.s %= seconds_per_minute;
        }
        if (this.m < 0) {
            t = ceil(-this.m / minutes_per_hour);
            this.h -= t;
            this.m += t * minutes_per_hour;
        } else if (this.m > minutes_per_hour) {
            this.h += floor(this.m / minutes_per_hour);
            this.m %= minutes_per_hour;
        }
        if (this.h < 0) {
            t = ceil(-this.h / hours_per_day);
            this.d -= t;
            this.h += t * hours_per_day;
        } else if (this.h > hours_per_day) {
            this.M += floor(this.h / hours_per_day);
            this.h %= hours_per_day;
        }


        while(this.d < 0) {
            this.M--;
            this.d += borrowMonth(this.refMonth, 1);
        }

        if (this.M < 0) {
            t = ceil(-this.M / months_per_year);
            this.Y -= t;
            this.M += t * months_per_year;
        } else if (this.M >= months_per_year) {
            this.Y += floor(this.M / months_per_year);
            this.M %= months_per_year;
        }
    };

    Cdown.prototype.MM = function() {
        return padLeft(this.M);
    };

    Cdown.prototype.dd = function() {
        return padLeft(this.d);
    };

    Cdown.prototype.hh = function() {
        return padLeft(this.h);
    };

    Cdown.prototype.mm = function() {
        return padLeft(this.m);
    };

    Cdown.prototype.ss = function() {
        return padLeft(this.s);
    };

    extend(Cdown, {
        SECOND: second,
        MINUTE: minute,
        HOUR: hour,
        DAY: day
    });

    w.Cdown = Cdown;

}(window));
