/*jslint white: true, onevar: true, undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, browser: true, strict: true, evil: true, maxerr: 500, indent: 4 */
var WaveDrom = {
	version: "0.5.5",
	lane: {
		xs     : 20,    // tmpgraphlane0.width
		ys     : 20,    // tmpgraphlane0.height
		xg     : 120,   // tmpgraphlane0.x
		y0     : 10,    // tmpgraphlane0.y
		yo     : 35,    // tmpgraphlane1.y - y0;
		tgo    : -10,   // tmptextlane0.x - xg;
		ym     : 15,    // tmptextlane0.y - y0
		xlabel : 6,     // tmptextlabel.x - xg;
		xmax   : 1,
		hscale : 1,
		scale  : 1
	},
	canvas: {
		heigth : 85 // tmpview.height;
	},
	panela: {
		ys : 200
	},
	genBrick: function (texts, extra, times) {
		"use strict";
		var i, j, R = [];

		if (texts.length === 4) {
			for (j = 0; j < times; j += 1) {
				R.push(texts[0]);
				for (i = 0; i < extra; i += 1) {
					R.push(texts[1]);
				}
				R.push(texts[2]);
				for (i = 0; i < extra; i += 1) {
					R.push(texts[3]);
				}
			}
			return R;
		}
		if (texts.length === 1) {
			texts.push(texts[0]);
		}
		R.push(texts[0]);
		for (i = 0; i < (times * (2 * (extra + 1)) - 1); i += 1) {
			R.push(texts[1]);
		}
		return R;
	},
	genFirstWaveBrick: function (text,  extra, times) {
		"use strict";
		switch (text) {
		case 'p': return this.genBrick(['pclk', '111', 'nclk', '000'], extra, times);
		case 'n': return this.genBrick(['nclk', '000', 'pclk', '111'], extra, times);
		case 'P': return this.genBrick(['Pclk', '111', 'nclk', '000'], extra, times);
		case 'N': return this.genBrick(['Nclk', '000', 'pclk', '111'], extra, times);
		case '0': return this.genBrick(['000'], extra, times);
		case '1': return this.genBrick(['111'], extra, times);
		case '=': return this.genBrick(['vvv-2'], extra, times);
		case '2': return this.genBrick(['vvv-2'], extra, times);
		case '3': return this.genBrick(['vvv-3'], extra, times);
		case '4': return this.genBrick(['vvv-4'], extra, times);
		case '5': return this.genBrick(['vvv-5'], extra, times);
		case 'd': return this.genBrick(['ddd'], extra, times);
		case 'u': return this.genBrick(['uuu'], extra, times);
		case 'z': return this.genBrick(['zzz'], extra, times);
		default:  return this.genBrick(['xxx'], extra, times);
		}
	},
	genWaveBrick: function (text, extra, times) {
		"use strict";
		var v, H = {
			'00': ['0m0',   '000'], '01': ['0m1',   '111'], '0x': ['0mx',   'xxx'], '0d': ['0md',   'ddd'], '0u': ['0mu',   'uuu'], '0z': ['0mz',   'zzz'],     '0=': ['0mv-2',   'vvv-2'], '02': ['0mv-2',   'vvv-2'], '03': ['0mv-3',   'vvv-3'], '04': ['0mv-4',   'vvv-4'], '05': ['0mv-5',   'vvv-5'],
			'10': ['1m0',   '000'], '11': ['1m1',   '111'], '1x': ['1mx',   'xxx'], '1d': ['1md',   'ddd'], '1u': ['1mu',   'uuu'], '1z': ['1mz',   'zzz'],     '1=': ['1mv-2',   'vvv-2'], '12': ['1mv-2',   'vvv-2'], '13': ['1mv-3',   'vvv-3'], '14': ['1mv-4',   'vvv-4'], '15': ['1mv-5',   'vvv-5'],
			'x0': ['xm0',   '000'], 'x1': ['xm1',   '111'], 'xx': ['xmx',   'xxx'], 'xd': ['xmd',   'ddd'], 'xu': ['xmu',   'uuu'], 'xz': ['xmz',   'zzz'],     'x=': ['xmv-2',   'vvv-2'], 'x2': ['xmv-2',   'vvv-2'], 'x3': ['xmv-3',   'vvv-3'], 'x4': ['xmv-4',   'vvv-4'], 'x5': ['xmv-5',   'vvv-5'],
			'.0': ['xm0',   '000'], '.1': ['xm1',   '111'], '.x': ['xmx',   'xxx'], '.d': ['xmd',   'ddd'], '.u': ['xmu',   'uuu'], '.z': ['xmz',   'zzz'],     '.=': ['xmv-2',   'vvv-2'], '.2': ['xmv-2',   'vvv-2'], '.3': ['xmv-3',   'vvv-3'], '.4': ['xmv-4',   'vvv-4'], '.5': ['xmv-5',   'vvv-5'],
			'd0': ['dm0',   '000'], 'd1': ['dm1',   '111'], 'dx': ['dmx',   'xxx'], 'dd': ['dmd',   'ddd'], 'du': ['dmu',   'uuu'], 'dz': ['dmz',   'zzz'],     'd=': ['dmv-2',   'vvv-2'], 'd2': ['dmv-2',   'vvv-2'], 'd3': ['dmv-3',   'vvv-3'], 'd4': ['dmv-4',   'vvv-4'], 'd5': ['dmv-5',   'vvv-5'],
			'u0': ['um0',   '000'], 'u1': ['um1',   '111'], 'ux': ['umx',   'xxx'], 'ud': ['umd',   'ddd'], 'uu': ['umu',   'uuu'], 'uz': ['umz',   'zzz'],     'u=': ['umv-2',   'vvv-2'], 'u2': ['umv-2',   'vvv-2'], 'u3': ['umv-3',   'vvv-3'], 'u4': ['umv-4',   'vvv-4'], 'u5': ['umv-5',   'vvv-5'],
			'z0': ['zm0',   '000'], 'z1': ['zm1',   '111'], 'zx': ['zmx',   'xxx'], 'zd': ['zmd',   'ddd'], 'zu': ['zmu',   'uuu'], 'zz': ['zmz',   'zzz'],     'z=': ['zmv-2',   'vvv-2'], 'z2': ['zmv-2',   'vvv-2'], 'z3': ['zmv-3',   'vvv-3'], 'z4': ['zmv-4',   'vvv-4'], 'z5': ['zmv-5',   'vvv-5'],

			'=0': ['vm0-2', '000'], '=1': ['vm1-2', '111'], '=x': ['vmx-2', 'xxx'], '=d': ['vmd-2', 'ddd'], '=u': ['vmu-2', 'uuu'], '=z': ['vmz-2', 'zzz'],     '==': ['vmv-2-2', 'vvv-2'], '=2': ['vmv-2-2', 'vvv-2'], '=3': ['vmv-2-3', 'vvv-3'], '=4': ['vmv-2-4', 'vvv-4'], '=5': ['vmv-2-5', 'vvv-5'],
			'20': ['vm0-2', '000'], '21': ['vm1-2', '111'], '2x': ['vmx-2', 'xxx'], '2d': ['vmd-2', 'ddd'], '2u': ['vmu-2', 'uuu'], '2z': ['vmz-2', 'zzz'],     '2=': ['vmv-2-2', 'vvv-2'], '22': ['vmv-2-2', 'vvv-2'], '23': ['vmv-2-3', 'vvv-3'], '24': ['vmv-2-4', 'vvv-4'], '25': ['vmv-2-5', 'vvv-5'],
			'30': ['vm0-3', '000'], '31': ['vm1-3', '111'], '3x': ['vmx-3', 'xxx'], '3d': ['vmd-3', 'ddd'], '3u': ['vmu-3', 'uuu'], '3z': ['vmz-3', 'zzz'],     '3=': ['vmv-3-2', 'vvv-2'], '32': ['vmv-3-2', 'vvv-2'], '33': ['vmv-3-3', 'vvv-3'], '34': ['vmv-3-4', 'vvv-4'], '35': ['vmv-3-5', 'vvv-5'],
			'40': ['vm0-4', '000'], '41': ['vm1-4', '111'], '4x': ['vmx-4', 'xxx'], '4d': ['vmd-4', 'ddd'], '4u': ['vmu-4', 'uuu'], '4z': ['vmz-4', 'zzz'],     '4=': ['vmv-4-2', 'vvv-2'], '42': ['vmv-4-2', 'vvv-2'], '43': ['vmv-4-3', 'vvv-3'], '44': ['vmv-4-4', 'vvv-4'], '45': ['vmv-4-5', 'vvv-5'],
			'50': ['vm0-5', '000'], '51': ['vm1-5', '111'], '5x': ['vmx-5', 'xxx'], '5d': ['vmd-5', 'ddd'], '5u': ['vmu-5', 'uuu'], '5z': ['vmz-5', 'zzz'],     '5=': ['vmv-5-2', 'vvv-2'], '52': ['vmv-5-2', 'vvv-2'], '53': ['vmv-5-3', 'vvv-3'], '54': ['vmv-5-4', 'vvv-4'], '55': ['vmv-5-5', 'vvv-5']
		};
		for (v in H) {
			if (text === v) {
				return this.genBrick(H[v], extra, times);
			}
		}
		return this.genBrick(['xxx'], extra, times);
	},
	parseWaveLane: function (text, extra) {
		"use strict";
		var Repeats, Top, Next, Stack = [], R = [];

		Stack = text.split('');
		Next  = Stack.shift();
		if (Next === 'p' || Next === 'n') {
			return this.genFirstWaveBrick(Next, extra, Stack.length + 1);
		}

		Repeats = 1;
		while (Stack[0] === '.' || Stack[0] === '|' ) { // repeaters parser
			Stack.shift();
			Repeats += 1;
		}
		R = R.concat(this.genFirstWaveBrick(Next, extra, Repeats));

		while (Stack.length) {
			Top  = Next;
			Next = Stack.shift();
			Repeats = 1;
			while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
				Stack.shift();
				Repeats += 1;
			}
			R = R.concat(this.genWaveBrick((Top + Next), extra, Repeats));
		}
		return R;
	}
};

WaveDrom.utf8_encode = function (argString) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === "undefined") {
        return "";
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = "",
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
};

WaveDrom.base64_encode = function (data) {
/*
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
*/
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = "",
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data = this.utf8_encode(data + '');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
    case 1:
        enc = enc.slice(0, -2) + '==';
        break;
    case 2:
        enc = enc.slice(0, -1) + '=';
        break;
    }

    return enc;
};

WaveDrom.ViewSVG = function (label) {
	"use strict";
	var f, ser, str;

	f   = document.getElementById (label);
	ser = new XMLSerializer();
	str = '<?xml version="1.0" standalone="no"?>\n' +
	'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
	'<!-- Created with WaveDrom -->\n' +
	ser.serializeToString (f);
	window.open ('data:image/svg+xml;base64,' + this.base64_encode(str), '_blank');
};

WaveDrom.ViewSourceSVG = function (label) {
	"use strict";
	var f, ser, str;

	f   = document.getElementById (label);
	ser = new XMLSerializer();
	str = '<?xml version="1.0" standalone="no"?>\n' +
	'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
	'<!-- Created with WaveDrom -->\n' +
	ser.serializeToString (f);
	window.open ('view-source:data:image/svg+xml;base64,' + this.base64_encode(str), '_blank');
};

WaveDrom.parseWaveLanes = function (source) {
	"use strict";
	var x, content = [];

	if (source.signal) {
		for (x in source.signal) {
			content.push([]);
			content[content.length - 1][0] = source.signal[x].name;
			if (source.signal[x].wave) {
				content[content.length - 1][1] = this.parseWaveLane(source.signal[x].wave, this.lane.hscale-1);
			} else {
				content[content.length - 1][1] = null;
			}
			if (source.signal[x].data) {
				content[content.length - 1][2] = source.signal[x].data;
			} else {
				content[content.length - 1][2] = null;
			}
		}
	}
	return content;
};

WaveDrom.FindLaneMarkers = function (lanetext) {
	"use strict";
	var i, gcount = 0, lcount = 0, ret = [];

	for (i in lanetext) {
		if (lanetext[i] === 'vvv-2' | lanetext[i] === 'vvv-3' | lanetext[i] === 'vvv-4' | lanetext[i] === 'vvv-5') {
			lcount += 1;
		} else {
			if (lcount !== 0) {
				ret.push(gcount - ((lcount + 1) / 2));
				lcount = 0;
			}
		}
		gcount += 1;
	}
	if (lcount !== 0) {
		ret.push(gcount - ((lcount + 1) / 2));
	}
	
	return ret;
};

WaveDrom.RenderWaveLane = function (root, content, index) {
	"use strict";
	var i, j, k, g, gg, title, b, lanetext, labeltext, labels = [1], nxt_xgmax, scale,
	xmax    = 0,
	xgmax   = 0,
	svgns   = 'http://www.w3.org/2000/svg',
	xlinkns = 'http://www.w3.org/1999/xlink';

	for (j = 0; j < content.length; j += 1) {
		if (content[j][0]) {
			g    = document.createElementNS (svgns, 'g');
			g.id = "wavelane_" + j + "_" + index;
			g.setAttribute ('transform', 'translate(0,' + (this.lane.y0 + j * this.lane.yo) + ')');
			root.insertBefore (g, root.firstChild);

			lanetext = document.createTextNode (content[j][0]);
			title = document.createElementNS (svgns, "text");
			title.setAttribute ("x", this.lane.tgo);
			title.setAttribute ("y", this.lane.ym);
			title.setAttribute ("fill", "blue");
			title.setAttribute ("text-anchor", "end");
			title.appendChild (lanetext);
			g.insertBefore (title, g.firstChild);

			scale = this.lane.xs * (this.lane.hscale) * 2;
			nxt_xgmax = Math.ceil((title.getBBox().width) / scale) * scale;
			if (nxt_xgmax > xgmax) { xgmax = nxt_xgmax; }

			gg = document.createElementNS(svgns, 'g');
			gg.id = "wavelane_draw_" + j + "_" + index;
//			gg.setAttribute('transform', 'translate(' + this.lane.xg + ')');
			g.insertBefore(gg, g.firstChild);

			if (content[j][1]) {
				if (content[j][2] && content[j][2].length) {
					labels = this.FindLaneMarkers (content[j][1]);

					if (labels.length !== 0) {
						for (k in labels) {
							if (content[j][2] && content[j][2][k]) {
								labeltext = document.createTextNode (content[j][2][k]);
								title = document.createElementNS (svgns, "text");
								title.setAttribute ("x", ((labels[k] * this.lane.xs) + this.lane.xlabel));
								title.setAttribute ("y", this.lane.ym);
								title.setAttribute ("text-anchor", "middle");
								title.appendChild (labeltext);
								gg.insertBefore (title, gg.firstChild);
							}
						}
					}
				}
				for (i = 0; i < content[j][1].length; i += 1) {
					b    = document.createElementNS(svgns, "use");
					b.id = "use_" + i + "_" + j + "_" + index;
					b.setAttributeNS(xlinkns, 'xlink:href', '#' + content[j][1][i]);
					b.setAttribute('transform', 'translate(' + (i * this.lane.xs) + ')');
					gg.insertBefore(b, gg.firstChild);
				}
					if (content[j][1].length > xmax) {
					xmax = content[j][1].length;
				}
			}
		}
	}
	this.lane.xmax = xmax;
	this.lane.xg = xgmax + 20;
};

WaveDrom.RenderMarks = function (root, content, index) {
	"use strict";
	var i, g, marks, mstep, mmstep, gmark, tmark, labeltext, gy, margin,
	svgns   = 'http://www.w3.org/2000/svg';

	mstep  = 2 * (this.lane.hscale);
	mmstep = mstep * this.lane.xs;
	marks  = this.lane.xmax / mstep + 1;
	margin = 5;
	gy     = content.length * this.lane.yo + this.lane.y0 + this.lane.ys;

	g = document.createElementNS (svgns, 'g');
	g.id = "gmarks_" + index;
	root.insertBefore (g, root.firstChild);

	for (i = 0; i < marks; i += 1) {
		gmark = document.createElementNS (svgns, "path");
		gmark.id = ("gmark_" + i + "_" + index);
		gmark.setAttribute ('d', 'm ' + (i * mmstep) + ',5 0,' + (gy - 2 * margin));
		gmark.setAttribute ('style', 'stroke:#888888;stroke-width:0.5;stroke-dasharray:2, 2');
		g.insertBefore (gmark, g.firstChild);
	}
	for (i = 1; i < marks; i += 1) {
		labeltext = document.createTextNode (i);
		tmark = document.createElementNS (svgns, "text");
		tmark.setAttribute ("x", i * mmstep - mmstep / 2);
		tmark.setAttribute ("y", gy - margin);
		tmark.setAttribute ("text-anchor", "middle");
		tmark.setAttribute ("fill", "#AAAAAA");
		tmark.appendChild (labeltext);
		g.insertBefore (tmark, g.firstChild);
	}
};

WaveDrom.RenderGaps = function (root, source, index) {
	"use strict";
	var i, gg, g, b, pos, Stack = [], text,
		svgns   = 'http://www.w3.org/2000/svg',
		xlinkns = 'http://www.w3.org/1999/xlink';

	if (source.signal) {

		gg = document.createElementNS (svgns, 'g');
		gg.id = "wavegaps_" + index;
		//gg.setAttribute ('transform', 'translate(' + this.lane.xg + ')');
		root.insertBefore (gg, root.firstChild);

		for (i in source.signal) {
			g = document.createElementNS (svgns, 'g');
			g.id = "wavegap_" + i + "_" + index;
			g.setAttribute ('transform', 'translate(0,' + (this.lane.y0 + i * this.lane.yo) + ')');
			gg.insertBefore (g, gg.firstChild);

			text = source.signal[i].wave;
			if (text) {
				Stack = text.split ('');
				pos = 0;
				while (Stack.length) {
					if (Stack.shift() === '|') {
						b    = document.createElementNS (svgns, "use");
						b.id = "guse_" + pos + "_" + i + "_" + index;
						b.setAttributeNS (xlinkns, 'xlink:href', '#gap');
						b.setAttribute ('transform', 'translate(' + ((2 * pos + 1) * (this.lane.hscale) * this.lane.xs) + ')');
						g.insertBefore (b, g.firstChild);
					}
					pos += 1;
				}
			}
		}
	}
};

WaveDrom.parseConfig = function (source) {
	"use strict";
	var x, content = [];

//	this.lane.hscale = 1;
	if (source.config) {
		if (source.config.hscale) {
			this.lane.hscale = source.config.hscale;
		}
	}
};

WaveDrom.RenderWaveForm = function (index) {
	"use strict";
	var root, svgcontent, TheTextBox, content, source, width, height, uwidth, uheight;

	root          = document.getElementById("lanes_" + index);
	svgcontent    = document.getElementById("svgcontent_" + index);
	TheTextBox    = document.getElementById("InputJSON_" + index);
	if (TheTextBox.type && TheTextBox.type == 'textarea') {
		source = eval('(' + TheTextBox.value + ')');
	} else {
		source = eval('(' + TheTextBox.innerHTML + ')');
	}

	this.parseConfig (source);

	content       = this.parseWaveLanes (source);

	this.RenderGaps (root, source, index);
	this.RenderWaveLane (root, content, index);
	this.RenderMarks (root, content, index);

	width  = (this.lane.xg + (this.lane.xs * (this.lane.xmax + 1)));
	height = (content.length * this.lane.yo + this.lane.y0 + this.lane.ys);

	if (this.lane.scale === 3) {
//		uwidth  = '100%';
		uwidth  = (window.innerWidth - 15);
//		uheight = '100%';
		uheight = (window.innerHeight - (10+7+16+7+(WaveDrom.panela.ys)+7+16+7+16+7));
	} else {
		uwidth  = this.lane.scale * width;
		uheight = this.lane.scale * height;
	}
	
	svgcontent.setAttribute('viewBox', "0 0 " + width + " " + height);
	svgcontent.setAttribute('width', uwidth);
	svgcontent.setAttribute('height', uheight);

	root.setAttribute ('transform', 'translate(' + this.lane.xg + ')');
};

WaveDrom.InsertSVGTemplate = function (index, svg, parent) {
	var node0, node1;

	node1 = svg.cloneNode(true);
	node1.id = "svgcontent_" + index;
	node1.setAttribute ('height', '0');
	parent.insertBefore (node1, parent.firstChild);

	node0 = document.getElementById('lanes');
	node0.id = "lanes_" + index;
};

WaveDrom.ProcessAll = function (template) {
	"use strict";
	var xhttp, xmlDoc, temp, index, points, i, node0, node1;
	xhttp   = new XMLHttpRequest();
	xhttp.open("GET", template, false);
	xhttp.send();
	xmlDoc = xhttp.responseXML;
	temp = xmlDoc.getElementById('svg');

	// backward markup
	index = 0;
	points = document.getElementsByTagName ('SCRIPT');
	for (i = points.length-1; i > 0; i -= 1) {
		if (points.item(i).type && points.item(i).type == 'WaveDrom') {
			points.item(i).setAttribute ('id', 'InputJSON_' + index);

			node0 = document.createElement('div');
			node0.className += "WaveDrom_Display_" + index;
			points.item(i).parentNode.insertBefore (node0, points.item(i));

			this.InsertSVGTemplate (index, temp, node0);

			index += 1;
		}
	}
	// forward markup
	for (i = 0; i < index; i += 1) {
		this.RenderWaveForm (i);
	}
};

WaveDrom.resize = function () {
	"use strict";
	document.getElementById('PanelB').style.height = (window.innerHeight - (10+7+16+7+(WaveDrom.panela.ys)+7+16+7+16+7)) + 'px';
	document.getElementById('PanelA').style.height = WaveDrom.panela.ys + 'px';
};

WaveDrom.ClearWaveLane = function (index) {
	root = document.getElementById ('lanes_' + index);
	while (root.childNodes.length) {
		root.removeChild (root.childNodes[0]);
	}
};



WaveDrom.EditorRefrech = function () {
	"use strict";
	WaveDrom.ClearWaveLane (0);
	WaveDrom.resize ();
	WaveDrom.RenderWaveForm (0);
};

WaveDrom.EditorInit = function (template) {
	"use strict";
	var xhttp, xmlDoc, temp, index, points, i, node0, node1;

	this.lane.scale = 3;

	xhttp = new XMLHttpRequest();
	xhttp.open("GET", template, false);
	xhttp.send();
	xmlDoc = xhttp.responseXML;
	temp = xmlDoc.getElementById('svg');

	index = 0;
	this.InsertSVGTemplate(index, temp, document.getElementById('WaveDrom_Display_' + index));
	WaveDrom.EditorRefrech();
	window.onresize = WaveDrom.EditorRefrech;
};

WaveDrom.ExpandInputWindow = function () {
	"use strict";
	if (WaveDrom.panela.ys < (0.707 * window.innerHeight)) {
		WaveDrom.panela.ys += 50;
		WaveDrom.EditorRefrech();
	}
};

WaveDrom.CollapseInputWindow = function () {
	"use strict";
	if (WaveDrom.panela.ys > 100) {
		WaveDrom.panela.ys -= 50;
		WaveDrom.EditorRefrech();
	}
};

WaveDrom.SetHScale = function (hscale) {
	"use strict";
	WaveDrom.lane.hscale = parseFloat(hscale);
	WaveDrom.EditorRefrech();
};

WaveDrom.SetScale = function (scale) {
	"use strict";
	WaveDrom.lane.scale = parseFloat(scale);
	WaveDrom.EditorRefrech();
};
