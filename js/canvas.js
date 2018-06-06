/**
 * Help for draw canvas | https://github.com/ne3nay/cvs
 * @author Alexandr Bochkovskiy <prizrak666@yahoo.com>
 * @version 4.0.0
 * @constructor
 */
var CvsMotor = function () {};

/**
 * Add canvas and context of canvas.
 * @param {string|object} canvas - Id of canvas element or the canvas element
 */
CvsMotor.prototype.init = function (canvas) {
    if (undefined === canvas) {
        return false;
    }

    Object.defineProperty(this, "_cvs", {
        get: function () {
            delete this._cvs;
            return this._cvs = ("string" === typeof canvas) ? document.getElementById(canvas) : canvas;
        },
        configurable: true
    });

    Object.defineProperty(this, "_ctx", {
        get: function () {
            delete this._ctx;
            return this._ctx = this._cvs.getContext('2d');
        },
        configurable: true
    });
};

/**
 * Get height of text.
 * @param {string} text
 * @param {(string|null)} [font=inherit] - CSS syntax. line-height must to be.
 * @param {number} [width]
 * @returns {(number|boolean)}
 */
CvsMotor.prototype.getTextHeight = function (text, font, width) {
    if (undefined === text) {
        return false;
    }

    var height;

    this.temp = {
        s: "",
        i: 0,
        e: document.createElement("div"),
        p: {
            font: "inherit",
            left: 0,
            position: "fixed",
            top: 0,
            visibility: "hidden"
        }
    };

    if (undefined !== font && null !== font) {
        this.temp.p.font = font;
    }

    if (undefined !== width) {
        this.temp.p.width = width + "px";
    } else {
        this.temp.p["white-space"] = "nowrap";
    }

    this.temp.e.innerHTML = text;

    this.temp.k = Object.keys(this.temp.p);
    this.temp.i = this.temp.k.length - 1;

    for (this.temp.i; 0 <= this.temp.i; this.temp.i--) {
        this.temp.s += this.temp.k[ this.temp.i ] + ":" + this.temp.p[ this.temp.k[ this.temp.i ] ] + ";";
    }

    this.temp.e.setAttribute("style", this.temp.s);

    document.body.appendChild(this.temp.e);
    height = this.temp.e.offsetHeight;
    document.body.removeChild(this.temp.e);

    delete this.temp;

    return height;
};

/**
 * Loader images.
 * @param {object} list - List of images. Key - name, value - path.
 * @param {Function} [cb] - The callback.
 * @returns {Function|boolean}
 */
CvsMotor.prototype.addImages = function (list, cb) {
    if (undefined === list) {
        return false;
    }

    if (undefined === this._img) {
        Object.defineProperty(this, '_img', {
            value: {}
        });
    }

    var i = 0;
    var o = {};
    var img = this._img;
    var n = Object.keys(list);

    this.temp = {
        e: function () {
            if (++i >= n.length) {
                n = Object.keys(o);

                i = n.length - 1;

                for (i; 0 <= i; i--) {
                    if ( 0 === o[ n[i] ].width || 0 === o[ n[i] ].height ) {
                        delete o[ n[i] ];
                    } else {
                        img[ n[i] ] = o[ n[i] ];

                        delete o[ n[i] ];
                    }
                }

                o = n = i = img = undefined;

                if (undefined !== cb) {
                    return cb();
                }
            }
        }
    };

    this.temp.i = n.length - 1;
    for (this.temp.i; 0 <= this.temp.i; this.temp.i--) {
        o[ n[this.temp.i] ] = new Image();
        o[ n[this.temp.i] ].addEventListener("error", this.temp.e);
        o[ n[this.temp.i] ].addEventListener("load", this.temp.e);
        o[ n[this.temp.i] ].crossOrigin = "Anonymous";
        o[ n[this.temp.i] ].src = list[ n[this.temp.i] ];
    }

    delete this.temp;
};

/**
 * Get saved images
 * @param {string|string[]} [names]
 * @returns {object}
 */
CvsMotor.prototype.getImages = function (names) {
    if (undefined === names) {
        return this._img;
    }

    if ( "[object Array]" === Object.prototype.toString.call(names) ) {
        var o = {};

        this.temp = {
            i: names.length - 1
        };

        for (this.temp.i; 0 <= this.temp.i; this.temp.i--) {
            o[ names[this.temp.i] ] = this._img[ names[this.temp.i] ];
        }

        delete this.temp;

        return o;
    }

    if (undefined !== names) {
        return this._img[names];
    }
};

/**
 * Global animation.
 * Run - this.run
 * Stop - this.stop = true;
 * @param {Function} cb - The callback.
 * @returns {Function|boolean}
 */
CvsMotor.prototype.animate = function (cb) {
    if (undefined === cb) {
        return false;
    }

    var _self = this;

    if (undefined === this.stop) {
        Object.defineProperty(this, "stop", {
            value: false,
            writable: true
        });
    }

    if (undefined === this.run) {
        Object.defineProperty(this, "run", {
            get: function () {
                _self.stop = false;
                _self._timer();
            }
        });
    }

    if (undefined == this._inc) {
        Object.defineProperty(this, "_inc", {
            value: 0,
            writable: true
        });
    }

    if (undefined === this._timer) {
        Object.defineProperty(this, "_timer", {
            value: function () {
                var timer = setTimeout(function tick () {
                    cb();

                    _self._inc++;

                    timer = setTimeout(tick, 16);

                    if (_self.stop) {
                        clearTimeout(timer);
                    }
                }, 16);
            },
            configurable: true
        });
    }

    this._timer();
};

/**
 * Drawing the media content
 * @param {Object} image - Element of image
 * @param {object} [options] - Props for drawing
 * @param {number|undefined} [options.left=0] - Offset on horizontal
 * @param {number|undefined} [options.top=0] - Offset on vertical
 * @param {number|undefined} [options.width=image.width] - Size
 * @param {number|undefined} [options.height==image.height] - Size
 * @param {number|undefined} [options.opacity=1] - Value
 * @param {string|undefined} [options.view=rect] - Permissible value -> circle
 * @param {string|undefined} [options.filter] - Permissible value -> negative, sepia, grayscale, threshold
 * @param {string|undefined} [options.strokeColor=#000] - hex, hsl, rgb, rgba
 * @param {number|undefined} [options.strokeWidth=1] - Size
 */
CvsMotor.prototype.imageDraw = function (image, options) {
    if (undefined === image) {
        return false;
    }

    if (undefined === options) {
        this._ctx.drawImage(image, 0, 0);

        return;
    }

    if (undefined === options.left) {
        options.left = 0;
    }

    if (undefined === options.top) {
        options.top = 0;
    }

    if (undefined === options.width) {
        options.width = image.width;
    }

    if (undefined === options.height) {
        options.height = image.height;
    }

    this.temp = {
        w: 0,
        h: 0,
        x: 0,
        y: 0
    };

    this.temp.w = options.width;
    this.temp.h = ~~ (options.width * image.height / image.width + .5);
    this.temp.x = options.left;
    this.temp.y = ~~ ( (options.height / 2 + options.top) - this.temp.h / 2 + .5 );

    if (this.temp.h < options.height) {
        this.temp.h = options.height;
        this.temp.w = ~~ (options.height * image.width / image.height + .5);
        this.temp.x = ~~ ( (options.width / 2 + options.left) - this.temp.w / 2 + .5 );
        this.temp.y = options.top;
    }

    this._ctx.save();
    this._ctx.beginPath();

    if (undefined !== options.opacity) {
        this._ctx.globalAlpha = options.opacity;
    }

    if (undefined === options.view) {
        this._ctx.rect(
            options.left, options.top,
            options.width, options.height
        );
    } else {
        switch (options.view) {
            case 'circle':
                this.temp.r = ~~ (options.width / 2 + .5);
                this.temp.circleX = options.left + this.temp.r;
                this.temp.circleY = options.top + this.temp.r;

                this._ctx.arc(
                    this.temp.circleX, this.temp.circleY,
                    this.temp.r,
                    0, Math.PI * 2,
                    false
                );
                break;

            default:
                this._ctx.rect(
                    options.left, options.top,
                    options.width, options.height
                );
        }
    }

    this._ctx.clip();
    this._ctx.drawImage(
        image,
        this.temp.x, this.temp.y,
        this.temp.w, this.temp.h
    );

    if (undefined !== options.filter) {
        if (undefined === this.temp.d) {
            this.temp.d = this._ctx.getImageData(
                options.left, options.top,
                options.width, options.height
            );
        }

        this.temp.i = 0;
        this.temp.r = 0;
        this.temp.g = 0;
        this.temp.b = 0;
        this.temp.gray = 0;
        this.temp.v = 0;

        switch (options.filter) {
            case 'negative':
                for (this.temp.i = 0; this.temp.i < this.temp.d.data.length; this.temp.i += 4) {
                    this.temp.d.data[this.temp.i] = 255 - this.temp.d.data[this.temp.i];
                    this.temp.d.data[this.temp.i + 1] = 255 - this.temp.d.data[this.temp.i + 1];
                    this.temp.d.data[this.temp.i + 2] = 255 - this.temp.d.data[this.temp.i + 2];
                }
                break;

            case 'sepia':
                for (this.temp.i = 0; this.temp.i < this.temp.d.data.length; this.temp.i += 4) {
                    this.temp.r = this.temp.d.data[this.temp.i];
                    this.temp.g = this.temp.d.data[this.temp.i + 1];
                    this.temp.b = this.temp.d.data[this.temp.i + 2];

                    this.temp.d.data[this.temp.i] =
                        (this.temp.r * 0.393) + (this.temp.g * 0.769) + (this.temp.b * 0.189);
                    this.temp.d.data[this.temp.i + 1] =
                        (this.temp.r * 0.349) + (this.temp.g * 0.686) + (this.temp.b * 0.168);
                    this.temp.d.data[this.temp.i + 2] =
                        (this.temp.r * 0.272) + (this.temp.g * 0.534) + (this.temp.b * 0.131);
                }
                break;

            case 'grayscale':
                for(this.temp.i = 0; this.temp.i < this.temp.d.data.length; this.temp.i += 4) {
                    this.temp.r = this.temp.d.data[this.temp.i];
                    this.temp.g = this.temp.d.data[this.temp.i + 1];
                    this.temp.b = this.temp.d.data[this.temp.i + 2];
                    this.temp.gray = 0.2126 * this.temp.r + 0.7152 * this.temp.g + 0.0722 * this.temp.b;

                    this.temp.d.data[this.temp.i] = this.temp.gray;
                    this.temp.d.data[this.temp.i + 1] = this.temp.gray;
                    this.temp.d.data[this.temp.i + 2] = this.temp.gray;
                }
                break;

            case 'threshold':
                for (this.temp.i = 0; this.temp.i < this.temp.d.data.length; this.temp.i += 4) {
                    this.temp.r = this.temp.d.data[this.temp.i];
                    this.temp.g = this.temp.d.data[this.temp.i + 1];
                    this.temp.b = this.temp.d.data[this.temp.i + 2];

                    // 128 -> threshold
                    this.temp.v = (0.3 * this.temp.r + 0.59 * this.temp.g + 0.11 * this.temp.b >= 128) ? 255 : 0;

                    this.temp.d.data[this.temp.i] = this.temp.v;
                    this.temp.d.data[this.temp.i + 1] = this.temp.v;
                    this.temp.d.data[this.temp.i + 2] = this.temp.v;
                }
                break;
        }

        this._ctx.putImageData(
            this.temp.d,
            options.left, options.top
        );
    }

    this._ctx.restore();

    if (undefined !== options.strokeColor) {
        if (undefined === options.strokeWidth) {
            options.strokeWidth = 1;
        }

        this._ctx.save();
        this._ctx.lineJoin = "round";
        this._ctx.lineWidth = options.strokeWidth;
        this._ctx.strokeStyle = options.strokeColor;
        this._ctx.stroke();
        this._ctx.restore();
    }

    delete this.temp;
};

/**
 * Drawing the text
 * @param {string} text
 * @param {object} [options] - Props for drawing
 * @param {string|undefined} [options.color=#000] - hex, hsl, rgb, rgba
 * @param {string|undefined} [options.font=normal 400 10px/12px sans-serif] - Full css syntax.
 * @param {string|undefined} [options.textAlign=left] - Left, center, right
 * @param {string|undefined} [options.textShadow] - Css syntax.
 * @param {number|undefined} [options.left=0] - Offset on horizontal
 * @param {number|undefined} [options.top=0] - Offset on vertical
 * @param {number|undefined} [options.width=canvas.width] - Size
 * @param {number|undefined} [options.opacity=1] - Value
 * @param {string|undefined} [options.view=fill] - Permissible value -> stroke
 * @param {number|undefined} [options.strokeWidth=1] - Size. Working if options.view == stroke
 */
CvsMotor.prototype.textDraw = function (text, options) {
    if (undefined === text) {
        return false;
    }

    this.temp = {};

    if (undefined === options) {
        options = {};
    }

    if (undefined === options.color) {
        options.color = "#000";
    }

    if (undefined === options.font) {
        options.font = "normal 400 10px/12px sans-serif";
    }

    if (undefined === options.left) {
        options.left = 0;
    }

    if (undefined === options.top) {
        options.top = 0;
    }

    if (undefined === options.width) {
        options.width = this._cvs.width;
    }

    if (undefined === options.lineHeight) {
        this.temp.lh = options.font.match(/\/[0-9]+/);

        if (null !== this.temp.lh) {
            this.temp.lh = parseInt(this.temp.lh[0].replace(/\//, ''), 10);
        } else {
            this.temp.lh = parseInt(options.font.match(/[0-9]+px/)[0], 10);
        }

        options.lineHeight = this.temp.lh;
    }

    if (undefined !== options.textShadow || undefined !== options.opacity) {
        this._ctx.save();
    }

    if (undefined !== options.opacity) {
        this._ctx.globalAlpha = options.opacity;
    }

    if (undefined !== options.textShadow) {
        this.temp.ts = options.textShadow.split(" ");

        this._ctx.shadowOffsetX = parseInt(this.temp.ts[0], 10);
        this._ctx.shadowOffsetY = parseInt(this.temp.ts[1], 10);
        this._ctx.shadowBlur = parseInt(this.temp.ts[2], 10);
        this._ctx.shadowColor = this.temp.ts[3];
    }

    this._ctx.font = options.font;
    this._ctx.textBaseline = "middle";

    this.temp = {
        i: 0,
        ii: 0,
        x: options.left,
        y: options.lineHeight / 2 + options.top
    };

    if (undefined !== options.textAlign) {
        if ("center" === options.textAlign) {
            this._ctx.textAlign = options.textAlign;

            this.temp.x = ~~ (options.width / 2 + options.left + .5);
        } else if ("right" === options.textAlign) {
            this._ctx.textAlign = options.textAlign;

            this.temp.x = options.left + options.width;
        }
    }

    if (undefined !== options.view) {
        switch (options.view) {
            case "stroke":
                if (undefined === options.strokeWidth) {
                    options.strokeWidth = 1;
                }

                this._ctx.strokeStyle = options.color;
                this._ctx.lineWidth = options.strokeWidth;

                break;

            default:
                this._ctx.fillStyle = options.color;

                break;
        }
    }

    if (options.drawLine === undefined) {
        this.temp.lines = text.split('<br>');
        this.temp.linesLength = this.temp.lines.length;
        this.temp.words = [];
        this.temp.wordsLength = [];

        this.temp.tmpText = '';
        this.temp.tmpLine = '';
        this.temp.tmpLineWidth = 0;

        options.drawLine = [];
        options.drawLineLength = 0;

        for (this.temp.i = 0; this.temp.i < this.temp.linesLength; this.temp.i++) {
            this.temp.words[this.temp.i] = this.temp.lines[this.temp.i].split(" ");
            this.temp.wordsLength[this.temp.i] = this.temp.words[this.temp.i].length;

            this.temp.tmpText = "";

            for (this.temp.ii = 0; this.temp.ii < this.temp.wordsLength[this.temp.i]; this.temp.ii++) {
                this.temp.tmpLine =
                    this.temp.tmpText + this.temp.words[this.temp.i][this.temp.ii] + " ";
                this.temp.tmpLineWidth = this._ctx.measureText(this.temp.tmpLine).width;

                if (this.temp.tmpLineWidth > options.width) {
                    this.temp.tmpText = this.temp.tmpText.replace(/\s+$/, "");

                    options.drawLine.push(this.temp.tmpText);

                    this.temp.tmpText = this.temp.words[this.temp.i][this.temp.ii] + " ";
                } else {
                    this.temp.tmpText = this.temp.tmpLine;
                }
            }

            this.temp.tmpText = this.temp.tmpText.replace(/\s+$/, "");

            options.drawLine.push(this.temp.tmpText);
        }

        options.drawLineLength = options.drawLine.length;
    }

    for (this.temp.i = 0; this.temp.i < options.drawLineLength; this.temp.i++) {
        switch (options.view) {
            case "stroke":
                this._ctx.strokeText(
                    options.drawLine[this.temp.i],
                    this.temp.x, this.temp.y
                );

                break;

            default:
                this._ctx.fillText(
                    options.drawLine[this.temp.i],
                    this.temp.x, this.temp.y
                );
        }

        this.temp.y += options.lineHeight;
    }

    if (undefined !== options.textShadow || undefined !== options.opacity) {
        this._ctx.restore();
    }

    delete this.temp;
};