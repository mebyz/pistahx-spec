(function (console) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
};
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
};
var List = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
};
var Main = function() { };
Main.__name__ = ["Main"];
Main.getType = function(expr) {
	var type = expr.type;
	switch(type) {
	case "string":
		return "String";
	case "integer":
		return "Int";
	default:
		return "String";
	}
};
Main.main = function() {
	if((function($this) {
		var $r;
		var this1 = process.env;
		$r = Object.prototype.hasOwnProperty.call(this1,"input");
		return $r;
	}(this)) && (function($this) {
		var $r;
		var this2 = process.env;
		$r = Object.prototype.hasOwnProperty.call(this2,"output");
		return $r;
	}(this))) {
		var specPath;
		var this3 = process.env;
		specPath = this3.input;
		var outPath;
		var this4 = process.env;
		outPath = this4.output;
		var yaml1 = js_node_Fs.readFileSync(specPath,"utf8");
		var nativeObject = yaml_Yaml.parse(yaml1,yaml_Parser.options().useObjects());
		var defs = nativeObject.definitions;
		var defsx = Reflect.fields(defs);
		var res = [];
		Lambda.map(defsx,function(def) {
			console.log(def);
			res.push(" typedef " + def + " = ");
			var content = Reflect.field(defs,def);
			if(Object.prototype.hasOwnProperty.call(content,"properties")) {
				if(Object.prototype.hasOwnProperty.call(content.properties,"result")) res.push("Array<" + Std.string(Reflect.field(content.properties.result.items,"$ref").replace("#/definitions/","")) + ">;"); else {
					res.push("{");
					var props = Reflect.fields(content.properties);
					var keys = [];
					Lambda.map(props,function(prop) {
						var propx = Reflect.field(content.properties,prop);
						var type = Main.getType(propx);
						keys.push("" + prop + " : " + type);
					});
					res.push(keys.toString());
					res.push("}; ");
				}
			} else {
				var type1 = Main.getType(content);
				res.push("" + type1 + ";");
			}
		});
		console.log(res.join(""));
		js_node_Fs.writeFile(outPath,new js_node_buffer_Buffer(res.join("")),function(err) {
			console.log("" + outPath + " file saved!");
		});
	} else console.log("missing one or more parameters ( usage : input=[yaml_filename] output=[haxe_filename] ./run.sh ) ");
};
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.rpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = s + c;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var ValueType = { __ename__ : true, __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js_Boot.getClass(o);
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js_Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	__class__: haxe_IMap
};
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = ["haxe","_Int64","___Int64"];
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Utf8 = function(size) {
	this.__b = "";
};
haxe_Utf8.__name__ = ["haxe","Utf8"];
haxe_Utf8.charCodeAt = function(s,index) {
	return HxOverrides.cca(s,index);
};
haxe_Utf8.prototype = {
	__class__: haxe_Utf8
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = ["haxe","ds","IntMap"];
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = ["haxe","io","Bytes"];
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(new ArrayBuffer(length));
};
haxe_io_Bytes.prototype = {
	__class__: haxe_io_Bytes
};
var haxe_io_Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var haxe_io_FPHelper = function() { };
haxe_io_FPHelper.__name__ = ["haxe","io","FPHelper"];
haxe_io_FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = ["js","Boot"];
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return (Function("return typeof " + name + " != \"undefined\" ? " + name + " : null"))();
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
js_html_compat_ArrayBuffer.__name__ = ["js","html","compat","ArrayBuffer"];
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
};
js_html_compat_DataView.__name__ = ["js","html","compat","DataView"];
js_html_compat_DataView.prototype = {
	getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
var js_html_compat_Uint8Array = function() { };
js_html_compat_Uint8Array.__name__ = ["js","html","compat","Uint8Array"];
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
var js_node_Fs = require("fs");
var js_node_buffer_Buffer = require("buffer").Buffer;
var yaml_ParserOptions = function(schema) {
	if(schema == null) this.schema = new yaml_schema_DefaultSchema(); else this.schema = schema;
	this.strict = false;
	this.resolve = true;
	this.validation = true;
	this.maps = true;
};
yaml_ParserOptions.__name__ = ["yaml","ParserOptions"];
yaml_ParserOptions.prototype = {
	useMaps: function() {
		this.maps = true;
		return this;
	}
	,useObjects: function() {
		this.maps = false;
		return this;
	}
	,setSchema: function(schema) {
		this.schema = schema;
		return this;
	}
	,strictMode: function(value) {
		if(value == null) value = true;
		this.strict = value;
		return this;
	}
	,validate: function(value) {
		if(value == null) value = true;
		this.validation = value;
		return this;
	}
	,__class__: yaml_ParserOptions
};
var yaml_Parser = function() {
};
yaml_Parser.__name__ = ["yaml","Parser"];
yaml_Parser.options = function() {
	return new yaml_ParserOptions();
};
yaml_Parser.createUtf8Char = function(hex) {
	var utf8 = new haxe_Utf8(1);
	utf8.__b += String.fromCharCode(hex);
	return utf8.__b;
};
yaml_Parser.prototype = {
	safeParseAll: function(input,output,options) {
		options.schema = new yaml_schema_SafeSchema();
		this.parseAll(input,output,options);
	}
	,safeParse: function(input,options) {
		options.schema = new yaml_schema_SafeSchema();
		return this.parse(input,options);
	}
	,parse: function(input,options) {
		var result = null;
		var received = false;
		var responder = function(data) {
			if(!received) {
				result = data;
				received = true;
			} else throw new js__$Boot_HaxeError(new yaml_YamlException("expected a single document in the stream, but found more",null,{ fileName : "Parser.hx", lineNumber : 155, className : "yaml.Parser", methodName : "parse"}));
		};
		this.parseAll(input,responder,options);
		return result;
	}
	,parseAll: function(input,output,options) {
		var _g = this;
		this.input = input;
		this.output = output;
		this.schema = options.schema;
		this.resolve = options.resolve;
		this.validate = options.validation;
		this.strict = options.strict;
		this.usingMaps = options.maps;
		this.directiveHandlers = new haxe_ds_StringMap();
		this.implicitTypes = this.schema.compiledImplicit;
		this.typeMap = this.schema.compiledTypeMap;
		this.length = this.input.length;
		this.position = 0;
		this.line = 0;
		this.lineStart = 0;
		this.lineIndent = 0;
		this.character = HxOverrides.cca(this.input,this.position);
		this.directiveHandlers.set("YAML",function(name,args) {
			if(null != _g.version) _g.throwError("duplication of %YAML directive",{ fileName : "Parser.hx", lineNumber : 199, className : "yaml.Parser", methodName : "parseAll"});
			if(1 != args.length) _g.throwError("YAML directive accepts exactly one argument",{ fileName : "Parser.hx", lineNumber : 202, className : "yaml.Parser", methodName : "parseAll"});
			var regex = new EReg("^([0-9]+)\\.([0-9]+)$","u");
			if(!regex.match(args[0])) _g.throwError("ill-formed argument of the YAML directive",{ fileName : "Parser.hx", lineNumber : 207, className : "yaml.Parser", methodName : "parseAll"});
			var major = yaml_util_Ints.parseInt(regex.matched(1),10);
			var minor = yaml_util_Ints.parseInt(regex.matched(2),10);
			if(1 != major) _g.throwError("unacceptable YAML version of the document",{ fileName : "Parser.hx", lineNumber : 213, className : "yaml.Parser", methodName : "parseAll"});
			_g.version = args[0];
			_g.checkLineBreaks = minor < 2;
			if(1 != minor && 2 != minor) _g.throwWarning("unsupported YAML version of the document",{ fileName : "Parser.hx", lineNumber : 219, className : "yaml.Parser", methodName : "parseAll"});
		});
		this.directiveHandlers.set("TAG",function(name1,args1) {
			var handle;
			var prefix;
			if(2 != args1.length) _g.throwError("TAG directive accepts exactly two arguments",{ fileName : "Parser.hx", lineNumber : 233, className : "yaml.Parser", methodName : "parseAll"});
			handle = args1[0];
			prefix = args1[1];
			if(!yaml_Parser.PATTERN_TAG_HANDLE.match(handle)) _g.throwError("ill-formed tag handle (first argument) of the TAG directive",{ fileName : "Parser.hx", lineNumber : 239, className : "yaml.Parser", methodName : "parseAll"});
			if(_g.tagMap.exists(handle)) _g.throwError("there is a previously declared suffix for \"" + handle + "\" tag handle",{ fileName : "Parser.hx", lineNumber : 242, className : "yaml.Parser", methodName : "parseAll"});
			if(!yaml_Parser.PATTERN_TAG_URI.match(prefix)) _g.throwError("ill-formed tag prefix (second argument) of the TAG directive",{ fileName : "Parser.hx", lineNumber : 245, className : "yaml.Parser", methodName : "parseAll"});
			_g.tagMap.set(handle,prefix);
		});
		if(this.validate && yaml_Parser.PATTERN_NON_PRINTABLE.match(this.input)) this.throwError("the stream contains non-printable characters",{ fileName : "Parser.hx", lineNumber : 252, className : "yaml.Parser", methodName : "parseAll"});
		while(32 == this.character) {
			this.lineIndent += 1;
			this.character = haxe_Utf8.charCodeAt(input,++this.position);
		}
		while(this.position < this.length) this.readDocument();
	}
	,generateError: function(message,info) {
		return new yaml_YamlException(message,info,{ fileName : "Parser.hx", lineNumber : 269, className : "yaml.Parser", methodName : "generateError"});
	}
	,throwError: function(message,info) {
		throw new js__$Boot_HaxeError(this.generateError(message,info));
	}
	,throwWarning: function(message,info) {
		var error = this.generateError(message,info);
		if(this.strict) throw new js__$Boot_HaxeError(error); else console.log("Warning : " + error.toString());
	}
	,captureSegment: function(start,end,checkJson) {
		var _result;
		if(start < end) {
			_result = yaml_util_Utf8.substring(this.input,start,end);
			if(checkJson && this.validate) {
				var _g1 = 0;
				var _g = _result.length;
				while(_g1 < _g) {
					var pos = _g1++;
					var $char = HxOverrides.cca(_result,pos);
					if(!(9 == $char || 32 <= $char && $char <= 1114111)) this.throwError("expected valid JSON character",{ fileName : "Parser.hx", lineNumber : 302, className : "yaml.Parser", methodName : "captureSegment"});
				}
			}
			this.result += _result;
		}
	}
	,mergeObjectMappings: function(destination,source) {
		if(Type["typeof"](source) != ValueType.TObject) this.throwError("cannot merge mappings; the provided source object is unacceptable",{ fileName : "Parser.hx", lineNumber : 314, className : "yaml.Parser", methodName : "mergeObjectMappings"});
		var _g = 0;
		var _g1 = Reflect.fields(source);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			if(!Object.prototype.hasOwnProperty.call(destination,key)) Reflect.setField(destination,key,Reflect.field(source,key));
		}
	}
	,mergeMappings: function(destination,source) {
		if(!js_Boot.__instanceof(source,yaml_util_TObjectMap)) this.throwError("cannot merge mappings; the provided source object is unacceptable",{ fileName : "Parser.hx", lineNumber : 326, className : "yaml.Parser", methodName : "mergeMappings"});
		var $it0 = source.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			if(!destination.exists(key)) destination.set(key,source.get(key));
		}
	}
	,storeObjectMappingPair: function(_result,keyTag,keyNode,valueNode) {
		if(null == _result) _result = { };
		if("tag:yaml.org,2002:merge" == keyTag) {
			if((valueNode instanceof Array) && valueNode.__enum__ == null) {
				var list = valueNode;
				var _g = 0;
				while(_g < list.length) {
					var member = list[_g];
					++_g;
					this.mergeObjectMappings(_result,member);
				}
			} else this.mergeObjectMappings(_result,valueNode);
		} else _result[Std.string(keyNode)] = valueNode;
		return _result;
	}
	,storeMappingPair: function(_result,keyTag,keyNode,valueNode) {
		if(null == _result) _result = new yaml_util_TObjectMap();
		if("tag:yaml.org,2002:merge" == keyTag) {
			if((valueNode instanceof Array) && valueNode.__enum__ == null) {
				var list = valueNode;
				var _g = 0;
				while(_g < list.length) {
					var member = list[_g];
					++_g;
					this.mergeMappings(_result,member);
				}
			} else this.mergeMappings(_result,valueNode);
		} else _result.set(keyNode,valueNode);
		return _result;
	}
	,readLineBreak: function() {
		if(10 == this.character) this.position += 1; else if(13 == this.character) {
			if(10 == HxOverrides.cca(this.input,this.position + 1)) this.position += 2; else this.position += 1;
		} else this.throwError("a line break is expected",{ fileName : "Parser.hx", lineNumber : 406, className : "yaml.Parser", methodName : "readLineBreak"});
		this.line += 1;
		this.lineStart = this.position;
		if(this.position < this.length) this.character = HxOverrides.cca(this.input,this.position); else this.character = null;
	}
	,skipSeparationSpace: function(allowComments,checkIndent) {
		var lineBreaks = 0;
		while(this.position < this.length) {
			while(32 == this.character || 9 == this.character) this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			if(allowComments && 35 == this.character) do this.character = haxe_Utf8.charCodeAt(this.input,++this.position); while(this.position < this.length && 10 != this.character && 13 != this.character);
			if(10 == this.character || 13 == this.character) {
				this.readLineBreak();
				lineBreaks += 1;
				this.lineIndent = 0;
				while(32 == this.character) {
					this.lineIndent += 1;
					this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
				}
				if(this.lineIndent < checkIndent) this.throwWarning("deficient indentation",{ fileName : "Parser.hx", lineNumber : 449, className : "yaml.Parser", methodName : "skipSeparationSpace"});
			} else break;
		}
		return lineBreaks;
	}
	,testDocumentSeparator: function() {
		if(this.position == this.lineStart && (45 == this.character || 46 == this.character) && HxOverrides.cca(this.input,this.position + 1) == this.character && HxOverrides.cca(this.input,this.position + 2) == this.character) {
			var pos = this.position + 3;
			var $char = HxOverrides.cca(this.input,pos);
			if(pos >= this.length || 32 == $char || 9 == $char || 10 == $char || 13 == $char) return true;
		}
		return false;
	}
	,writeFoldedLines: function(count) {
		if(1 == count) this.result += " "; else if(count > 1) this.result += yaml_util_Strings.repeat("\n",count - 1);
	}
	,readPlainScalar: function(nodeIndent,withinFlowCollection) {
		var preceding;
		var following;
		var captureStart;
		var captureEnd;
		var hasPendingContent;
		var _line = 0;
		var _kind = this.kind;
		var _result = this.result;
		if(32 == this.character || 9 == this.character || 10 == this.character || 13 == this.character || 44 == this.character || 91 == this.character || 93 == this.character || 123 == this.character || 125 == this.character || 35 == this.character || 38 == this.character || 42 == this.character || 33 == this.character || 124 == this.character || 62 == this.character || 39 == this.character || 34 == this.character || 37 == this.character || 64 == this.character || 96 == this.character) return false;
		if(63 == this.character || 45 == this.character) {
			following = HxOverrides.cca(this.input,this.position + 1);
			if(32 == following || 9 == following || 10 == following || 13 == following || withinFlowCollection && (44 == following || 91 == following || 93 == following || 123 == following || 125 == following)) return false;
		}
		this.kind = "string";
		this.result = "";
		captureStart = captureEnd = this.position;
		hasPendingContent = false;
		while(this.position < this.length) {
			if(58 == this.character) {
				following = HxOverrides.cca(this.input,this.position + 1);
				if(32 == following || 9 == following || 10 == following || 13 == following || withinFlowCollection && (44 == following || 91 == following || 93 == following || 123 == following || 125 == following)) break;
			} else if(35 == this.character) {
				preceding = HxOverrides.cca(this.input,this.position - 1);
				if(32 == preceding || 9 == preceding || 10 == preceding || 13 == preceding) break;
			} else if(this.position == this.lineStart && this.testDocumentSeparator() || withinFlowCollection && (44 == this.character || 91 == this.character || 93 == this.character || 123 == this.character || 125 == this.character)) break; else if(10 == this.character || 13 == this.character) {
				_line = this.line;
				var _lineStart = this.lineStart;
				var _lineIndent = this.lineIndent;
				this.skipSeparationSpace(false,-1);
				if(this.lineIndent >= nodeIndent) {
					hasPendingContent = true;
					continue;
				} else {
					this.position = captureEnd;
					this.line = _line;
					this.lineStart = _lineStart;
					this.lineIndent = _lineIndent;
					this.character = HxOverrides.cca(this.input,this.position);
					break;
				}
			}
			if(hasPendingContent) {
				this.captureSegment(captureStart,captureEnd,false);
				this.writeFoldedLines(this.line - _line);
				captureStart = captureEnd = this.position;
				hasPendingContent = false;
			}
			if(32 != this.character && 9 != this.character) captureEnd = this.position + 1;
			if(++this.position >= this.length) break;
			this.character = HxOverrides.cca(this.input,this.position);
		}
		this.captureSegment(captureStart,captureEnd,false);
		if(this.result != null) return true; else {
			this.kind = _kind;
			this.result = _result;
			return false;
		}
	}
	,readSingleQuotedScalar: function(nodeIndent) {
		var captureStart;
		var captureEnd;
		if(39 != this.character) return false;
		this.kind = "string";
		this.result = "";
		this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
		captureStart = captureEnd = this.position;
		while(this.position < this.length) if(39 == this.character) {
			this.captureSegment(captureStart,this.position,true);
			this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			if(39 == this.character) {
				captureStart = captureEnd = this.position;
				this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			} else return true;
		} else if(10 == this.character || 13 == this.character) {
			this.captureSegment(captureStart,captureEnd,true);
			this.writeFoldedLines(this.skipSeparationSpace(false,nodeIndent));
			captureStart = captureEnd = this.position;
			this.character = HxOverrides.cca(this.input,this.position);
		} else if(this.position == this.lineStart && this.testDocumentSeparator()) this.throwError("unexpected end of the document within a single quoted scalar",{ fileName : "Parser.hx", lineNumber : 708, className : "yaml.Parser", methodName : "readSingleQuotedScalar"}); else {
			this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			captureEnd = this.position;
		}
		this.throwError("unexpected end of the stream within a single quoted scalar",{ fileName : "Parser.hx", lineNumber : 717, className : "yaml.Parser", methodName : "readSingleQuotedScalar"});
		return false;
	}
	,readDoubleQuotedScalar: function(nodeIndent) {
		var captureStart;
		var captureEnd;
		if(34 != this.character) return false;
		this.kind = "string";
		this.result = "";
		this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
		captureStart = captureEnd = this.position;
		while(this.position < this.length) if(34 == this.character) {
			this.captureSegment(captureStart,this.position,true);
			this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			return true;
		} else if(92 == this.character) {
			this.captureSegment(captureStart,this.position,true);
			this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			if(10 == this.character || 13 == this.character) this.skipSeparationSpace(false,nodeIndent); else if(yaml_Parser.SIMPLE_ESCAPE_SEQUENCES.h.hasOwnProperty(this.character)) {
				this.result += yaml_Parser.SIMPLE_ESCAPE_SEQUENCES.h[this.character];
				this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			} else if(yaml_Parser.HEXADECIMAL_ESCAPE_SEQUENCES.h.hasOwnProperty(this.character)) {
				var hexLength = yaml_Parser.HEXADECIMAL_ESCAPE_SEQUENCES.h[this.character];
				var hexResult = 0;
				var _g = 1;
				while(_g < hexLength) {
					var hexIndex = _g++;
					var hexOffset = (hexLength - hexIndex) * 4;
					this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
					if(48 <= this.character && this.character <= 57) hexResult |= this.character - 48 << hexOffset; else if(65 <= this.character && this.character <= 70) hexResult |= this.character - 65 + 10 << hexOffset; else if(97 <= this.character && this.character <= 102) hexResult |= this.character - 97 + 10 << hexOffset; else this.throwError("expected hexadecimal character",{ fileName : "Parser.hx", lineNumber : 784, className : "yaml.Parser", methodName : "readDoubleQuotedScalar"});
				}
				this.result += String.fromCharCode(hexResult);
				this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			} else this.throwError("unknown escape sequence",{ fileName : "Parser.hx", lineNumber : 794, className : "yaml.Parser", methodName : "readDoubleQuotedScalar"});
			captureStart = captureEnd = this.position;
		} else if(10 == this.character || 13 == this.character) {
			this.captureSegment(captureStart,captureEnd,true);
			this.writeFoldedLines(this.skipSeparationSpace(false,nodeIndent));
			captureStart = captureEnd = this.position;
			this.character = HxOverrides.cca(this.input,this.position);
		} else if(this.position == this.lineStart && this.testDocumentSeparator()) this.throwError("unexpected end of the document within a double quoted scalar",{ fileName : "Parser.hx", lineNumber : 809, className : "yaml.Parser", methodName : "readDoubleQuotedScalar"}); else {
			this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			captureEnd = this.position;
		}
		this.throwError("unexpected end of the stream within a double quoted scalar",{ fileName : "Parser.hx", lineNumber : 818, className : "yaml.Parser", methodName : "readDoubleQuotedScalar"});
		return false;
	}
	,composeNode: function(parentIndent,nodeContext,allowToSeek,allowCompact) {
		var allowBlockStyles;
		var allowBlockScalars;
		var allowBlockCollections;
		var atNewLine = false;
		var isIndented = true;
		var hasContent = false;
		this.tag = null;
		this.anchor = null;
		this.kind = null;
		this.result = null;
		allowBlockCollections = 4 == nodeContext || 3 == nodeContext;
		allowBlockStyles = allowBlockScalars = allowBlockCollections;
		if(allowToSeek) {
			if(this.skipSeparationSpace(true,-1) != 0) {
				atNewLine = true;
				if(this.lineIndent == parentIndent) isIndented = false; else if(this.lineIndent > parentIndent) isIndented = true; else return false;
			}
		}
		if(isIndented) while(this.readTagProperty() || this.readAnchorProperty()) if(this.skipSeparationSpace(true,-1) != 0) {
			atNewLine = true;
			if(this.lineIndent > parentIndent) {
				isIndented = true;
				allowBlockCollections = allowBlockStyles;
			} else if(this.lineIndent == parentIndent) {
				isIndented = false;
				allowBlockCollections = allowBlockStyles;
			} else return true;
		} else allowBlockCollections = false;
		if(allowBlockCollections) allowBlockCollections = atNewLine || allowCompact;
		if(isIndented || 4 == nodeContext) {
			var flowIndent;
			var blockIndent;
			if(1 == nodeContext || 2 == nodeContext) flowIndent = parentIndent; else flowIndent = parentIndent + 1;
			blockIndent = this.position - this.lineStart;
			if(isIndented) {
				if(allowBlockCollections && (this.readBlockSequence(blockIndent) || this.readBlockMapping(blockIndent)) || this.readFlowCollection(flowIndent)) hasContent = true; else {
					if(allowBlockScalars && this.readBlockScalar(flowIndent) || this.readSingleQuotedScalar(flowIndent) || this.readDoubleQuotedScalar(flowIndent)) hasContent = true; else if(this.readAlias()) {
						hasContent = true;
						if(null != this.tag || null != this.anchor) this.throwError("alias node should not have any properties",{ fileName : "Parser.hx", lineNumber : 932, className : "yaml.Parser", methodName : "composeNode"});
					} else if(this.readPlainScalar(flowIndent,1 == nodeContext)) {
						hasContent = true;
						if(null == this.tag) this.tag = "?";
					}
					if(null != this.anchor) this.anchorMap.set(this.anchor,this.result);
				}
			} else hasContent = allowBlockCollections && this.readBlockSequence(blockIndent);
		}
		if(null != this.tag && "!" != this.tag) {
			var _result = null;
			if("?" == this.tag) {
				if(this.resolve) {
					var _g1 = 0;
					var _g = this.implicitTypes.length;
					while(_g1 < _g) {
						var typeIndex = _g1++;
						var type = this.implicitTypes[typeIndex];
						var resolvedType = false;
						try {
							_result = type.resolve(this.result,this.usingMaps,false);
							this.tag = type.tag;
							this.result = _result;
							resolvedType = true;
						} catch( e ) {
							if (e instanceof js__$Boot_HaxeError) e = e.val;
							if( js_Boot.__instanceof(e,yaml_ResolveTypeException) ) {
							} else throw(e);
						}
						if(resolvedType) break;
					}
				}
			} else if(this.typeMap.exists(this.tag)) {
				var t = this.typeMap.get(this.tag);
				if(null != this.result && t.loader.kind != this.kind) this.throwError("unacceptable node kind for !<" + this.tag + "> tag; it should be \"" + t.loader.kind + "\", not \"" + this.kind + "\"",{ fileName : "Parser.hx", lineNumber : 996, className : "yaml.Parser", methodName : "composeNode"});
				if(!t.loader.skip) try {
					_result = t.resolve(this.result,this.usingMaps,true);
					this.result = _result;
				} catch( e1 ) {
					if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
					if( js_Boot.__instanceof(e1,yaml_ResolveTypeException) ) {
						this.throwError("cannot resolve a node with !<" + this.tag + "> explicit tag",{ fileName : "Parser.hx", lineNumber : 1014, className : "yaml.Parser", methodName : "composeNode"});
					} else throw(e1);
				}
			} else this.throwWarning("unknown tag !<" + this.tag + ">",{ fileName : "Parser.hx", lineNumber : 1020, className : "yaml.Parser", methodName : "composeNode"});
		}
		return null != this.tag || null != this.anchor || hasContent;
	}
	,readFlowCollection: function(nodeIndent) {
		var readNext = true;
		var _tag = this.tag;
		var _result;
		var terminator;
		var isPair;
		var isExplicitPair;
		var isMapping;
		var keyNode;
		var keyTag;
		var valueNode;
		var _g = this.character;
		if(_g != null) switch(_g) {
		case 91:
			terminator = 93;
			isMapping = false;
			_result = [];
			break;
		case 123:
			terminator = 125;
			isMapping = true;
			if(this.usingMaps) _result = new yaml_util_TObjectMap(); else _result = { };
			break;
		default:
			return false;
		} else return false;
		if(null != this.anchor) this.anchorMap.set(this.anchor,_result);
		this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
		while(this.position < this.length) {
			this.skipSeparationSpace(true,nodeIndent);
			if(this.character == terminator) {
				this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
				this.tag = _tag;
				if(isMapping) this.kind = "object"; else this.kind = "array";
				this.result = _result;
				return true;
			} else if(!readNext) this.throwError("missed comma between flow collection entries",{ fileName : "Parser.hx", lineNumber : 1075, className : "yaml.Parser", methodName : "readFlowCollection"});
			keyTag = keyNode = valueNode = null;
			isPair = isExplicitPair = false;
			if(63 == this.character) {
				var following = HxOverrides.cca(this.input,this.position + 1);
				if(32 == following || 9 == following || 10 == following || 13 == following) {
					isPair = isExplicitPair = true;
					this.position += 1;
					this.character = following;
					this.skipSeparationSpace(true,nodeIndent);
				}
			}
			var _line = this.line;
			this.composeNode(nodeIndent,1,false,true);
			keyTag = this.tag;
			keyNode = this.result;
			if((isExplicitPair || this.line == _line) && 58 == this.character) {
				isPair = true;
				this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
				this.skipSeparationSpace(true,nodeIndent);
				this.composeNode(nodeIndent,1,false,true);
				valueNode = this.result;
			}
			if(isMapping) {
				if(this.usingMaps) this.storeMappingPair(_result,keyTag,keyNode,valueNode); else this.storeObjectMappingPair(_result,keyTag,keyNode,valueNode);
			} else if(isPair) {
				if(this.usingMaps) _result.push(this.storeMappingPair(null,keyTag,keyNode,valueNode)); else _result.push(this.storeObjectMappingPair(null,keyTag,keyNode,valueNode));
			} else _result.push(keyNode);
			this.skipSeparationSpace(true,nodeIndent);
			if(44 == this.character) {
				readNext = true;
				this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			} else readNext = false;
		}
		this.throwError("unexpected end of the stream within a flow collection",{ fileName : "Parser.hx", lineNumber : 1143, className : "yaml.Parser", methodName : "readFlowCollection"});
		return false;
	}
	,readBlockScalar: function(nodeIndent) {
		var captureStart;
		var folding;
		var chomping = 1;
		var detectedIndent = false;
		var textIndent = nodeIndent;
		var emptyLines = -1;
		var _g = this.character;
		if(_g != null) switch(_g) {
		case 124:
			folding = false;
			break;
		case 62:
			folding = true;
			break;
		default:
			return false;
		} else return false;
		this.kind = "string";
		this.result = "";
		while(this.position < this.length) {
			this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			if(43 == this.character || 45 == this.character) {
				if(1 == chomping) if(43 == this.character) chomping = 3; else chomping = 2; else this.throwError("repeat of a chomping mode identifier",{ fileName : "Parser.hx", lineNumber : 1183, className : "yaml.Parser", methodName : "readBlockScalar"});
			} else if(48 <= this.character && this.character <= 57) {
				if(48 == this.character) this.throwError("bad explicit indentation width of a block scalar; it cannot be less than one",{ fileName : "Parser.hx", lineNumber : 1191, className : "yaml.Parser", methodName : "readBlockScalar"}); else if(!detectedIndent) {
					textIndent = nodeIndent + (this.character - 49);
					detectedIndent = true;
				} else this.throwError("repeat of an indentation width identifier",{ fileName : "Parser.hx", lineNumber : 1200, className : "yaml.Parser", methodName : "readBlockScalar"});
			} else break;
		}
		if(32 == this.character || 9 == this.character) {
			do this.character = haxe_Utf8.charCodeAt(this.input,++this.position); while(32 == this.character || 9 == this.character);
			if(35 == this.character) do this.character = haxe_Utf8.charCodeAt(this.input,++this.position); while(this.position < this.length && 10 != this.character && 13 != this.character);
		}
		while(this.position < this.length) {
			this.readLineBreak();
			this.lineIndent = 0;
			while((!detectedIndent || this.lineIndent < textIndent) && 32 == this.character) {
				this.lineIndent += 1;
				this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			}
			if(!detectedIndent && this.lineIndent > textIndent) textIndent = this.lineIndent;
			if(10 == this.character || 13 == this.character) {
				emptyLines += 1;
				continue;
			}
			if(this.lineIndent < textIndent) {
				if(3 == chomping) this.result += yaml_util_Strings.repeat("\n",emptyLines + 1); else if(1 == chomping) this.result += "\n";
				break;
			}
			detectedIndent = true;
			if(folding) {
				if(32 == this.character || 9 == this.character) {
					this.result += yaml_util_Strings.repeat("\n",emptyLines + 1);
					emptyLines = 1;
				} else if(0 == emptyLines) {
					this.result += " ";
					emptyLines = 0;
				} else {
					this.result += yaml_util_Strings.repeat("\n",emptyLines);
					emptyLines = 0;
				}
			} else {
				this.result += yaml_util_Strings.repeat("\n",emptyLines + 1);
				emptyLines = 0;
			}
			captureStart = this.position;
			do this.character = haxe_Utf8.charCodeAt(this.input,++this.position); while(this.position < this.length && 10 != this.character && 13 != this.character);
			this.captureSegment(captureStart,this.position,false);
		}
		return true;
	}
	,readBlockSequence: function(nodeIndent) {
		var _line;
		var _tag = this.tag;
		var _result = [];
		var following;
		var detected = false;
		if(null != this.anchor) this.anchorMap.set(this.anchor,_result);
		while(this.position < this.length) {
			if(45 != this.character) break;
			following = HxOverrides.cca(this.input,this.position + 1);
			if(32 != following && 9 != following && 10 != following && 13 != following) break;
			detected = true;
			this.position += 1;
			this.character = following;
			if(this.skipSeparationSpace(true,-1) != 0) {
				if(this.lineIndent <= nodeIndent) {
					_result.push(null);
					continue;
				}
			}
			_line = this.line;
			this.composeNode(nodeIndent,3,false,true);
			_result.push(this.result);
			this.skipSeparationSpace(true,-1);
			if((this.line == _line || this.lineIndent > nodeIndent) && this.position < this.length) this.throwError("bad indentation of a sequence entry",{ fileName : "Parser.hx", lineNumber : 1365, className : "yaml.Parser", methodName : "readBlockSequence"}); else if(this.lineIndent < nodeIndent) break;
		}
		if(detected) {
			this.tag = _tag;
			this.kind = "array";
			this.result = _result;
			return true;
		} else return false;
	}
	,readBlockMapping: function(nodeIndent) {
		var following;
		var allowCompact = false;
		var _line;
		var _tag = this.tag;
		var _result;
		if(this.usingMaps) _result = new yaml_util_TObjectMap(); else _result = { };
		var keyTag = null;
		var keyNode = null;
		var valueNode = null;
		var atExplicitKey = false;
		var detected = false;
		if(null != this.anchor) this.anchorMap.set(this.anchor,_result);
		while(this.position < this.length) {
			following = HxOverrides.cca(this.input,this.position + 1);
			_line = this.line;
			if((63 == this.character || 58 == this.character) && (32 == following || 9 == following || 10 == following || 13 == following)) {
				if(63 == this.character) {
					if(atExplicitKey) {
						if(this.usingMaps) this.storeMappingPair(_result,keyTag,keyNode,null); else this.storeObjectMappingPair(_result,keyTag,keyNode,null);
						keyTag = keyNode = valueNode = null;
					}
					detected = true;
					atExplicitKey = true;
					allowCompact = true;
				} else if(atExplicitKey) {
					atExplicitKey = false;
					allowCompact = true;
				} else this.throwError("incomplete explicit mapping pair; a key node is missed",{ fileName : "Parser.hx", lineNumber : 1440, className : "yaml.Parser", methodName : "readBlockMapping"});
				this.position += 1;
				this.character = following;
			} else if(this.composeNode(nodeIndent,2,false,true)) {
				if(this.line == _line) {
					while(32 == this.character || 9 == this.character) this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
					if(58 == this.character) {
						this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
						if(32 != this.character && 9 != this.character && 10 != this.character && 13 != this.character) this.throwError("a whitespace character is expected after the key-value separator within a block mapping",{ fileName : "Parser.hx", lineNumber : 1467, className : "yaml.Parser", methodName : "readBlockMapping"});
						if(atExplicitKey) {
							if(this.usingMaps) this.storeMappingPair(_result,keyTag,keyNode,null); else this.storeObjectMappingPair(_result,keyTag,keyNode,null);
							keyTag = keyNode = valueNode = null;
						}
						detected = true;
						atExplicitKey = false;
						allowCompact = false;
						keyTag = this.tag;
						keyNode = this.result;
					} else if(detected) this.throwError("can not read an implicit mapping pair; a colon is missed",{ fileName : "Parser.hx", lineNumber : 1489, className : "yaml.Parser", methodName : "readBlockMapping"}); else {
						this.tag = _tag;
						return true;
					}
				} else if(detected) this.throwError("can not read a block mapping entry; a multiline key may not be an implicit key",{ fileName : "Parser.hx", lineNumber : 1501, className : "yaml.Parser", methodName : "readBlockMapping"}); else {
					this.tag = _tag;
					return true;
				}
			} else break;
			if(this.line == _line || this.lineIndent > nodeIndent) {
				if(this.composeNode(nodeIndent,4,true,allowCompact)) {
					if(atExplicitKey) keyNode = this.result; else valueNode = this.result;
				}
				if(!atExplicitKey) {
					if(this.usingMaps) this.storeMappingPair(_result,keyTag,keyNode,valueNode); else this.storeObjectMappingPair(_result,keyTag,keyNode,valueNode);
					keyTag = keyNode = valueNode = null;
				}
				this.skipSeparationSpace(true,-1);
			}
			if(this.lineIndent > nodeIndent && this.position < this.length) this.throwError("bad indentation of a mapping entry",{ fileName : "Parser.hx", lineNumber : 1541, className : "yaml.Parser", methodName : "readBlockMapping"}); else if(this.lineIndent < nodeIndent) break;
		}
		if(atExplicitKey) {
			if(this.usingMaps) this.storeMappingPair(_result,keyTag,keyNode,null); else this.storeObjectMappingPair(_result,keyTag,keyNode,null);
		}
		if(detected) {
			this.tag = _tag;
			this.kind = "object";
			this.result = _result;
		}
		return detected;
	}
	,readTagProperty: function() {
		var _position;
		var isVerbatim = false;
		var isNamed = false;
		var tagHandle = null;
		var tagName = null;
		if(33 != this.character) return false;
		if(null != this.tag) this.throwError("duplication of a tag property",{ fileName : "Parser.hx", lineNumber : 1579, className : "yaml.Parser", methodName : "readTagProperty"});
		this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
		if(60 == this.character) {
			isVerbatim = true;
			this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
		} else if(33 == this.character) {
			isNamed = true;
			tagHandle = "!!";
			this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
		} else tagHandle = "!";
		_position = this.position;
		if(isVerbatim) {
			do this.character = haxe_Utf8.charCodeAt(this.input,++this.position); while(this.position < this.length && 62 != this.character);
			if(this.position < this.length) {
				tagName = yaml_util_Utf8.substring(this.input,_position,this.position);
				this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			} else this.throwError("unexpected end of the stream within a verbatim tag",{ fileName : "Parser.hx", lineNumber : 1614, className : "yaml.Parser", methodName : "readTagProperty"});
		} else {
			while(this.position < this.length && 32 != this.character && 9 != this.character && 10 != this.character && 13 != this.character) {
				if(33 == this.character) {
					if(!isNamed) {
						tagHandle = yaml_util_Utf8.substring(this.input,_position - 1,this.position + 1);
						if(this.validate && !yaml_Parser.PATTERN_TAG_HANDLE.match(tagHandle)) this.throwError("named tag handle cannot contain such characters",{ fileName : "Parser.hx", lineNumber : 1633, className : "yaml.Parser", methodName : "readTagProperty"});
						isNamed = true;
						_position = this.position + 1;
					} else this.throwError("tag suffix cannot contain exclamation marks",{ fileName : "Parser.hx", lineNumber : 1641, className : "yaml.Parser", methodName : "readTagProperty"});
				}
				this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			}
			tagName = yaml_util_Utf8.substring(this.input,_position,this.position);
			if(this.validate && yaml_Parser.PATTERN_FLOW_INDICATORS.match(tagName)) this.throwError("tag suffix cannot contain flow indicator characters",{ fileName : "Parser.hx", lineNumber : 1652, className : "yaml.Parser", methodName : "readTagProperty"});
		}
		if(this.validate && tagName != null && tagName != "" && !yaml_Parser.PATTERN_TAG_URI.match(tagName)) this.throwError("tag name cannot contain such characters: " + tagName,{ fileName : "Parser.hx", lineNumber : 1658, className : "yaml.Parser", methodName : "readTagProperty"});
		if(isVerbatim) this.tag = tagName; else if(this.tagMap.exists(tagHandle)) this.tag = this.tagMap.get(tagHandle) + tagName; else if("!" == tagHandle) this.tag = "!" + tagName; else if("!!" == tagHandle) this.tag = "tag:yaml.org,2002:" + tagName; else this.throwError("undeclared tag handle \"" + tagHandle + "\"",{ fileName : "Parser.hx", lineNumber : 1679, className : "yaml.Parser", methodName : "readTagProperty"});
		return true;
	}
	,readAnchorProperty: function() {
		var _position;
		if(38 != this.character) return false;
		if(null != this.anchor) this.throwError("duplication of an anchor property",{ fileName : "Parser.hx", lineNumber : 1693, className : "yaml.Parser", methodName : "readAnchorProperty"});
		this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
		_position = this.position;
		while(this.position < this.length && 32 != this.character && 9 != this.character && 10 != this.character && 13 != this.character && 44 != this.character && 91 != this.character && 93 != this.character && 123 != this.character && 125 != this.character) this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
		if(this.position == _position) this.throwError("name of an anchor node must contain at least one character",{ fileName : "Parser.hx", lineNumber : 1713, className : "yaml.Parser", methodName : "readAnchorProperty"});
		this.anchor = yaml_util_Utf8.substring(this.input,_position,this.position);
		return true;
	}
	,readAlias: function() {
		var _position;
		var alias;
		if(42 != this.character) return false;
		this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
		_position = this.position;
		while(this.position < this.length && 32 != this.character && 9 != this.character && 10 != this.character && 13 != this.character && 44 != this.character && 91 != this.character && 93 != this.character && 123 != this.character && 125 != this.character) this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
		if(this.position == _position) this.throwError("name of an alias node must contain at least one character",{ fileName : "Parser.hx", lineNumber : 1745, className : "yaml.Parser", methodName : "readAlias"});
		alias = yaml_util_Utf8.substring(this.input,_position,this.position);
		if(!this.anchorMap.exists(alias)) this.throwError("unidentified alias \"" + alias + "\"",{ fileName : "Parser.hx", lineNumber : 1750, className : "yaml.Parser", methodName : "readAlias"});
		this.result = this.anchorMap.get(alias);
		this.skipSeparationSpace(true,-1);
		return true;
	}
	,readDocument: function() {
		var documentStart = this.position;
		var _position;
		var directiveName;
		var directiveArgs;
		var hasDirectives = false;
		this.version = null;
		this.checkLineBreaks = false;
		this.tagMap = new haxe_ds_StringMap();
		this.anchorMap = new haxe_ds_StringMap();
		while(this.position < this.length) {
			this.skipSeparationSpace(true,-1);
			if(this.lineIndent > 0 || 37 != this.character) break;
			hasDirectives = true;
			this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			_position = this.position;
			while(this.position < this.length && 32 != this.character && 9 != this.character && 10 != this.character && 13 != this.character) this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
			directiveName = yaml_util_Utf8.substring(this.input,_position,this.position);
			directiveArgs = [];
			if(directiveName.length < 1) this.throwError("directive name must not be less than one character in length",{ fileName : "Parser.hx", lineNumber : 1795, className : "yaml.Parser", methodName : "readDocument"});
			while(this.position < this.length) {
				while(32 == this.character || 9 == this.character) this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
				if(35 == this.character) {
					do this.character = haxe_Utf8.charCodeAt(this.input,++this.position); while(this.position < this.length && 10 != this.character && 13 != this.character);
					break;
				}
				if(10 == this.character || 13 == this.character) break;
				_position = this.position;
				while(this.position < this.length && 32 != this.character && 9 != this.character && 10 != this.character && 13 != this.character) this.character = haxe_Utf8.charCodeAt(this.input,++this.position);
				directiveArgs.push(yaml_util_Utf8.substring(this.input,_position,this.position));
			}
			if(this.position < this.length) this.readLineBreak();
			if(this.directiveHandlers.exists(directiveName)) (this.directiveHandlers.get(directiveName))(directiveName,directiveArgs); else this.throwWarning("unknown document directive \"" + directiveName + "\"",{ fileName : "Parser.hx", lineNumber : 1839, className : "yaml.Parser", methodName : "readDocument"});
		}
		this.skipSeparationSpace(true,-1);
		if(0 == this.lineIndent && 45 == this.character && 45 == HxOverrides.cca(this.input,this.position + 1) && 45 == HxOverrides.cca(this.input,this.position + 2)) {
			this.position += 3;
			this.character = HxOverrides.cca(this.input,this.position);
			this.skipSeparationSpace(true,-1);
		} else if(hasDirectives) this.throwError("directives end mark is expected",{ fileName : "Parser.hx", lineNumber : 1857, className : "yaml.Parser", methodName : "readDocument"});
		this.composeNode(this.lineIndent - 1,4,false,true);
		this.skipSeparationSpace(true,-1);
		if(this.validate && this.checkLineBreaks && yaml_Parser.PATTERN_NON_ASCII_LINE_BREAKS.match(yaml_util_Utf8.substring(this.input,documentStart,this.position))) this.throwWarning("non-ASCII line breaks are interpreted as content",{ fileName : "Parser.hx", lineNumber : 1865, className : "yaml.Parser", methodName : "readDocument"});
		this.output(this.result);
		if(this.position == this.lineStart && this.testDocumentSeparator()) {
			if(46 == this.character) {
				this.position += 3;
				this.character = HxOverrides.cca(this.input,this.position);
				this.skipSeparationSpace(true,-1);
			}
			return;
		}
		if(this.position < this.length) this.throwError("end of the stream or a document separator is expected",{ fileName : "Parser.hx", lineNumber : 1883, className : "yaml.Parser", methodName : "readDocument"}); else return;
	}
	,__class__: yaml_Parser
};
var yaml_RenderOptions = function(schema,styles) {
	if(schema != null) this.schema = schema; else this.schema = new yaml_schema_DefaultSchema();
	if(styles != null) this.styles = styles; else this.styles = new haxe_ds_StringMap();
	this.indent = 2;
	this.flow = -1;
};
yaml_RenderOptions.__name__ = ["yaml","RenderOptions"];
yaml_RenderOptions.prototype = {
	setSchema: function(schema) {
		this.schema = schema;
		return this;
	}
	,setFlowLevel: function(level) {
		this.flow = level;
		return this;
	}
	,setIndent: function(indent) {
		this.indent = indent;
		return this;
	}
	,setStyle: function(name,value) {
		this.styles.set(name,value);
		return this;
	}
	,__class__: yaml_RenderOptions
};
var yaml_Renderer = function() {
};
yaml_Renderer.__name__ = ["yaml","Renderer"];
yaml_Renderer.options = function() {
	return new yaml_RenderOptions();
};
yaml_Renderer.compileStyleMap = function(schema,map) {
	if(null == map) return new haxe_ds_StringMap();
	var result = new haxe_ds_StringMap();
	var $it0 = map.keys();
	while( $it0.hasNext() ) {
		var tag = $it0.next();
		var style = Std.string(__map_reserved[tag] != null?map.getReserved(tag):map.h[tag]);
		if(0 == tag.indexOf("!!")) tag = "tag:yaml.org,2002:" + tag.substring(2);
		var type = schema.compiledTypeMap.get(tag);
		if(type != null && type.dumper != null) {
			if(type.dumper.styleAliases.exists(style)) style = type.dumper.styleAliases.get(style);
		}
		if(__map_reserved[tag] != null) result.setReserved(tag,style); else result.h[tag] = style;
	}
	return result;
};
yaml_Renderer.encodeHex = function(charCode) {
	var handle;
	var length;
	var str = yaml_util_Ints.toString(charCode,16).toUpperCase();
	if(charCode <= 255) {
		handle = "x";
		length = 2;
	} else if(charCode <= 65535) {
		handle = "u";
		length = 4;
	} else if(charCode <= -1) {
		handle = "U";
		length = 8;
	} else throw new js__$Boot_HaxeError(new yaml_YamlException("code point within a string may not be greater than 0xFFFFFFFF",null,{ fileName : "Renderer.hx", lineNumber : 586, className : "yaml.Renderer", methodName : "encodeHex"}));
	return "\\" + handle + yaml_util_Strings.repeat("0",length - str.length) + str;
};
yaml_Renderer.prototype = {
	safeRender: function(input,options) {
		options.schema = new yaml_schema_SafeSchema();
		return this.render(input,options);
	}
	,render: function(input,options) {
		this.schema = options.schema;
		this.indent = Std["int"](Math.max(1,options.indent));
		this.flowLevel = options.flow;
		this.styleMap = yaml_Renderer.compileStyleMap(this.schema,options.styles);
		this.implicitTypes = this.schema.compiledImplicit;
		this.explicitTypes = this.schema.compiledExplicit;
		this.writeNode(0,input,true,true);
		return Std.string(this.result) + "\n";
	}
	,generateNextLine: function(level) {
		return "\n" + yaml_util_Strings.repeat(" ",this.indent * level);
	}
	,testImplicitResolving: function(object) {
		var _g = 0;
		var _g1 = this.implicitTypes;
		while(_g < _g1.length) {
			var type = _g1[_g];
			++_g;
			try {
				if(!type.loader.skip) {
					type.resolve(object,false);
					return true;
				}
			} catch( e ) {
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				if( js_Boot.__instanceof(e,yaml_ResolveTypeException) ) {
				} else throw(e);
			}
		}
		return false;
	}
	,writeScalar: function(object) {
		var isQuoted = false;
		var checkpoint = 0;
		var position = -1;
		this.result = "";
		if(0 == object.length || 32 == HxOverrides.cca(object,0) || 32 == HxOverrides.cca(object,object.length - 1)) isQuoted = true;
		var length = object.length;
		while(++position < length) {
			var character = HxOverrides.cca(object,position);
			if(!isQuoted) {
				if(9 == character || 10 == character || 13 == character || 44 == character || 91 == character || 93 == character || 123 == character || 125 == character || 35 == character || 38 == character || 42 == character || 33 == character || 124 == character || 62 == character || 39 == character || 34 == character || 37 == character || 64 == character || 96 == character || 63 == character || 58 == character || 45 == character) isQuoted = true;
			}
			if(yaml_Renderer.ESCAPE_SEQUENCES.h.hasOwnProperty(character) || !(32 <= character && character <= 126 || 133 == character || 160 <= character && character <= 55295 || 57344 <= character && character <= 65533 || 65536 <= character && character <= 1114111)) {
				this.result += yaml_util_Utf8.substring(object,checkpoint,position);
				if(yaml_Renderer.ESCAPE_SEQUENCES.h.hasOwnProperty(character)) this.result += yaml_Renderer.ESCAPE_SEQUENCES.h[character]; else this.result += yaml_Renderer.encodeHex(character);
				checkpoint = position + 1;
				isQuoted = true;
			}
		}
		if(checkpoint < position) this.result += yaml_util_Utf8.substring(object,checkpoint,position);
		if(!isQuoted && this.testImplicitResolving(this.result)) isQuoted = true;
		if(isQuoted) this.result = "\"" + Std.string(this.result) + "\"";
	}
	,writeFlowSequence: function(level,object) {
		var _result = "";
		var _tag = this.tag;
		var _g1 = 0;
		var _g = object.length;
		while(_g1 < _g) {
			var index = _g1++;
			if(0 != index) _result += ", ";
			this.writeNode(level,object[index],false,false);
			_result += Std.string(this.result);
		}
		this.tag = _tag;
		this.result = "[" + _result + "]";
	}
	,writeBlockSequence: function(level,object,compact) {
		var _result = "";
		var _tag = this.tag;
		var _g1 = 0;
		var _g = object.length;
		while(_g1 < _g) {
			var index = _g1++;
			if(!compact || 0 != index) _result += this.generateNextLine(level);
			this.writeNode(level + 1,object[index],true,true);
			_result += "- " + Std.string(this.result);
		}
		this.tag = _tag;
		this.result = _result;
	}
	,writeFlowMapping: function(level,object) {
		if(Type["typeof"](object) == ValueType.TObject) this.writeObjectFlowMapping(level,object); else this.writeMapFlowMapping(level,object);
	}
	,writeObjectFlowMapping: function(level,object) {
		var _result = "";
		var _tag = this.tag;
		var index = 0;
		var objectKey;
		var _g = 0;
		var _g1 = Reflect.fields(object);
		while(_g < _g1.length) {
			var objectKey1 = _g1[_g];
			++_g;
			if(0 != index++) _result += ", ";
			var objectValue = Reflect.field(object,objectKey1);
			this.writeNode(level,objectKey1,false,false);
			if(this.result.length > 1024) _result += "? ";
			_result += Std.string(this.result) + ": ";
			this.writeNode(level,objectValue,false,false);
			_result += Std.string(this.result);
		}
		this.tag = _tag;
		this.result = "{" + _result + "}";
	}
	,writeMapFlowMapping: function(level,object) {
		var _result = "";
		var _tag = this.tag;
		var index = 0;
		var objectKey;
		var keys = object.keys();
		while( keys.hasNext() ) {
			var objectKey1 = keys.next();
			if(0 != index++) _result += ", ";
			var objectValue = object.get(objectKey1);
			this.writeNode(level,objectKey1,false,false);
			if(this.result.length > 1024) _result += "? ";
			_result += Std.string(this.result) + ": ";
			this.writeNode(level,objectValue,false,false);
			_result += Std.string(this.result);
		}
		this.tag = _tag;
		this.result = "{" + _result + "}";
	}
	,writeBlockMapping: function(level,object,compact) {
		if(Type["typeof"](object) == ValueType.TObject) this.writeObjectBlockMapping(level,object,compact); else this.writeMapBlockMapping(level,object,compact);
	}
	,writeObjectBlockMapping: function(level,object,compact) {
		var _result = "";
		var _tag = this.tag;
		var index = 0;
		var _g = 0;
		var _g1 = Reflect.fields(object);
		while(_g < _g1.length) {
			var objectKey = _g1[_g];
			++_g;
			if(!compact || 0 != index++) _result += this.generateNextLine(level);
			var objectValue = Reflect.field(object,objectKey);
			this.writeNode(level + 1,objectKey,true,true);
			var explicitPair = null != this.tag && "?" != this.tag && this.result.length <= 1024;
			if(explicitPair) _result += "? ";
			_result += Std.string(this.result);
			if(explicitPair) _result += this.generateNextLine(level);
			this.writeNode(level + 1,objectValue,true,explicitPair);
			_result += ": " + Std.string(this.result);
		}
		this.tag = _tag;
		this.result = _result;
	}
	,writeMapBlockMapping: function(level,object,compact) {
		var _result = "";
		var _tag = this.tag;
		var index = 0;
		var keys = object.keys();
		while( keys.hasNext() ) {
			var objectKey = keys.next();
			if(!compact || 0 != index++) _result += this.generateNextLine(level);
			var objectValue = object.get(objectKey);
			this.writeNode(level + 1,objectKey,true,true);
			var explicitPair = null != this.tag && "?" != this.tag && this.result.length <= 1024;
			if(explicitPair) _result += "? ";
			_result += Std.string(this.result);
			if(explicitPair) _result += this.generateNextLine(level);
			this.writeNode(level + 1,objectValue,true,explicitPair);
			_result += ": " + Std.string(this.result);
		}
		this.tag = _tag;
		this.result = _result;
	}
	,detectType: function(object,explicit) {
		var _result = null;
		var typeList;
		if(explicit) typeList = this.explicitTypes; else typeList = this.implicitTypes;
		var style;
		this.kind = this.kindOf(object);
		var _g = 0;
		while(_g < typeList.length) {
			var type = typeList[_g];
			++_g;
			if(null != type.dumper && type.dumper.skip != true && (null == type.dumper.kind || this.kind == type.dumper.kind) && (null == type.dumper.instanceOf || js_Boot.__instanceof(object,type.dumper.instanceOf) && (null == type.dumper.predicate || type.dumper.predicate(object)))) {
				if(explicit) this.tag = type.tag; else this.tag = "?";
				if(this.styleMap.exists(type.tag)) style = this.styleMap.get(type.tag); else style = type.dumper.defaultStyle;
				var success = true;
				try {
					_result = type.represent(object,style);
				} catch( e ) {
					if (e instanceof js__$Boot_HaxeError) e = e.val;
					if( js_Boot.__instanceof(e,yaml_RepresentTypeException) ) {
						success = false;
					} else throw(e);
				}
				if(success) {
					this.kind = this.kindOf(_result);
					this.result = _result;
				} else if(explicit) throw new js__$Boot_HaxeError(new yaml_YamlException("cannot represent an object of !<" + type.tag + "> type",null,{ fileName : "Renderer.hx", lineNumber : 444, className : "yaml.Renderer", methodName : "detectType"})); else continue;
				return true;
			}
		}
		return false;
	}
	,writeNode: function(level,object,block,compact) {
		this.tag = null;
		this.result = object;
		if(!this.detectType(object,false)) this.detectType(object,true);
		if(block) block = 0 > this.flowLevel || this.flowLevel > level;
		if(null != this.tag && "?" != this.tag || 2 != this.indent && level > 0) compact = false;
		if("object" == this.kind) {
			var empty;
			if(Type["typeof"](object) == ValueType.TObject) empty = Reflect.fields(object).length == 0; else empty = Lambda.empty(object);
			if(block && !empty) this.writeBlockMapping(level,object,compact); else this.writeFlowMapping(level,object);
		} else if("array" == this.kind) {
			if(block && 0 != this.result.length) this.writeBlockSequence(level,this.result,compact); else this.writeFlowSequence(level,this.result);
		} else if("string" == this.kind) {
			if("?" != this.tag) this.writeScalar(this.result);
		} else throw new js__$Boot_HaxeError(new yaml_YamlException("unacceptabe kind of an object to dump (" + this.kind + ")",null,{ fileName : "Renderer.hx", lineNumber : 501, className : "yaml.Renderer", methodName : "writeNode"}));
		if(null != this.tag && "?" != this.tag) this.result = "!<" + this.tag + "> " + Std.string(this.result);
	}
	,kindOf: function(object) {
		var kind = Type["typeof"](object);
		{
			var _g = Type["typeof"](object);
			switch(_g[1]) {
			case 0:
				return "null";
			case 1:
				return "integer";
			case 2:
				return "float";
			case 3:
				return "boolean";
			case 4:
				if((object instanceof Array) && object.__enum__ == null) return "array"; else return "object";
				break;
			case 5:
				return "function";
			case 6:
				var c = _g[2];
				if(c == String) return "string"; else if(c == Array) return "array"; else if(c == haxe_io_Bytes) return "binary"; else return "object";
				break;
			case 7:
				return "enum";
			case 8:
				return "unknown";
			}
		}
	}
	,__class__: yaml_Renderer
};
var yaml_Schema = function(include,explicit,implicit) {
	if(include == null) this.include = []; else this.include = include;
	if(implicit == null) this.implicit = []; else this.implicit = implicit;
	if(explicit == null) this.explicit = []; else this.explicit = explicit;
	var _g = 0;
	var _g1 = this.implicit;
	while(_g < _g1.length) {
		var type = _g1[_g];
		++_g;
		if(null != type.loader && "string" != type.loader.kind) throw new js__$Boot_HaxeError(new yaml_YamlException("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.",null,{ fileName : "Schema.hx", lineNumber : 28, className : "yaml.Schema", methodName : "new"}));
	}
	this.compiledImplicit = yaml_Schema.compileList(this,"implicit",[]);
	this.compiledExplicit = yaml_Schema.compileList(this,"explicit",[]);
	this.compiledTypeMap = yaml_Schema.compileMap([this.compiledImplicit,this.compiledExplicit]);
};
yaml_Schema.__name__ = ["yaml","Schema"];
yaml_Schema.create = function(types,schemas) {
	if(schemas == null) schemas = [yaml_Schema.DEFAULT]; else if(schemas.length == 0) schemas.push(yaml_Schema.DEFAULT);
	return new yaml_Schema(schemas,types);
};
yaml_Schema.compileList = function(schema,name,result) {
	var exclude = [];
	var _g = 0;
	var _g1 = schema.include;
	while(_g < _g1.length) {
		var includedSchema = _g1[_g];
		++_g;
		result = yaml_Schema.compileList(includedSchema,name,result);
	}
	var types;
	switch(name) {
	case "implicit":
		types = schema.implicit;
		break;
	case "explicit":
		types = schema.explicit;
		break;
	default:
		throw new js__$Boot_HaxeError(new yaml_YamlException("unknown type list type: " + name,null,{ fileName : "Schema.hx", lineNumber : 61, className : "yaml.Schema", methodName : "compileList"}));
	}
	var _g2 = 0;
	while(_g2 < types.length) {
		var currenYamlType = types[_g2];
		++_g2;
		var _g21 = 0;
		var _g11 = result.length;
		while(_g21 < _g11) {
			var previousIndex = _g21++;
			var previousType = result[previousIndex];
			if(previousType.tag == currenYamlType.tag) exclude.push(previousIndex);
		}
		result.push(currenYamlType);
	}
	var filteredResult = [];
	var _g12 = 0;
	var _g3 = result.length;
	while(_g12 < _g3) {
		var i = _g12++;
		if(!Lambda.has(exclude,i)) filteredResult.push(result[i]);
	}
	return filteredResult;
};
yaml_Schema.compileMap = function(list) {
	var result = new haxe_ds_StringMap();
	var _g = 0;
	while(_g < list.length) {
		var member = list[_g];
		++_g;
		var _g1 = 0;
		while(_g1 < member.length) {
			var type = member[_g1];
			++_g1;
			result.set(type.tag,type);
		}
	}
	return result;
};
yaml_Schema.prototype = {
	__class__: yaml_Schema
};
var yaml_Yaml = function() {
};
yaml_Yaml.__name__ = ["yaml","Yaml"];
yaml_Yaml.parse = function(document,options) {
	if(options == null) options = new yaml_ParserOptions();
	return new yaml_Parser().parse(document,options);
};
yaml_Yaml.render = function(data,options) {
	if(options == null) options = new yaml_RenderOptions();
	return new yaml_Renderer().render(data,options);
};
yaml_Yaml.prototype = {
	__class__: yaml_Yaml
};
var yaml_YamlException = function(message,cause,info) {
	if(message == null) message = "";
	this.name = Type.getClassName(js_Boot.getClass(this));
	this.message = message;
	this.cause = cause;
	this.info = info;
};
yaml_YamlException.__name__ = ["yaml","YamlException"];
yaml_YamlException.prototype = {
	get_name: function() {
		return this.name;
	}
	,get_message: function() {
		return this.message;
	}
	,toString: function() {
		var str = this.get_name() + ": " + this.get_message();
		if(this.info != null) str += " at " + this.info.className + "#" + this.info.methodName + " (" + this.info.lineNumber + ")";
		return str;
	}
	,__class__: yaml_YamlException
};
var yaml_YamlType = function(tag,loaderOptions,dumperOptions) {
	if(loaderOptions == null && dumperOptions == null) throw new js__$Boot_HaxeError(new yaml_YamlException("Incomplete YAML type definition. \"loader\" or \"dumper\" setting must be specified.",null,{ fileName : "YamlType.hx", lineNumber : 34, className : "yaml.YamlType", methodName : "new"}));
	this.tag = tag;
	this.loader = loaderOptions;
	this.dumper = dumperOptions;
	if(loaderOptions != null && !loaderOptions.skip) this.validateLoaderOptions();
	if(dumperOptions != null && !dumperOptions.skip) this.validateDumperOptions();
};
yaml_YamlType.__name__ = ["yaml","YamlType"];
yaml_YamlType.prototype = {
	resolve: function(object,usingMaps,explicit) {
		if(explicit == null) explicit = false;
		if(usingMaps == null) usingMaps = true;
		this.cantResolveType({ fileName : "YamlType.hx", lineNumber : 48, className : "yaml.YamlType", methodName : "resolve"});
		return null;
	}
	,represent: function(object,style) {
		this.cantRepresentType({ fileName : "YamlType.hx", lineNumber : 54, className : "yaml.YamlType", methodName : "represent"});
		return null;
	}
	,cantResolveType: function(info) {
		throw new js__$Boot_HaxeError(new yaml_ResolveTypeException("",null,info));
		return null;
	}
	,cantRepresentType: function(info) {
		throw new js__$Boot_HaxeError(new yaml_RepresentTypeException("",null,info));
		return null;
	}
	,validateLoaderOptions: function() {
		if(this.loader.skip != true && "string" != this.loader.kind && "array" != this.loader.kind && "object" != this.loader.kind) throw new js__$Boot_HaxeError(new yaml_YamlException("Unacceptable \"kind\" setting of a type loader: " + this.loader.kind,null,{ fileName : "YamlType.hx", lineNumber : 74, className : "yaml.YamlType", methodName : "validateLoaderOptions"}));
	}
	,validateDumperOptions: function() {
		if(this.dumper.skip != true && "undefined" != this.dumper.kind && "null" != this.dumper.kind && "boolean" != this.dumper.kind && "integer" != this.dumper.kind && "float" != this.dumper.kind && "string" != this.dumper.kind && "array" != this.dumper.kind && "object" != this.dumper.kind && "binary" != this.dumper.kind && "function" != this.dumper.kind) throw new js__$Boot_HaxeError(new yaml_YamlException("Unacceptable \"kind\" setting of a type dumper: " + this.dumper.kind,null,{ fileName : "YamlType.hx", lineNumber : 92, className : "yaml.YamlType", methodName : "validateDumperOptions"}));
	}
	,__class__: yaml_YamlType
};
var yaml_ResolveTypeException = function(message,cause,info) {
	if(message == null) message = "";
	yaml_YamlException.call(this,message,cause,info);
};
yaml_ResolveTypeException.__name__ = ["yaml","ResolveTypeException"];
yaml_ResolveTypeException.__super__ = yaml_YamlException;
yaml_ResolveTypeException.prototype = $extend(yaml_YamlException.prototype,{
	__class__: yaml_ResolveTypeException
});
var yaml_RepresentTypeException = function(message,cause,info) {
	if(message == null) message = "";
	yaml_YamlException.call(this,message,cause,info);
};
yaml_RepresentTypeException.__name__ = ["yaml","RepresentTypeException"];
yaml_RepresentTypeException.__super__ = yaml_YamlException;
yaml_RepresentTypeException.prototype = $extend(yaml_YamlException.prototype,{
	__class__: yaml_RepresentTypeException
});
var yaml_schema_DefaultSchema = function() {
	yaml_Schema.call(this,[new yaml_schema_SafeSchema()],null);
};
yaml_schema_DefaultSchema.__name__ = ["yaml","schema","DefaultSchema"];
yaml_schema_DefaultSchema.__super__ = yaml_Schema;
yaml_schema_DefaultSchema.prototype = $extend(yaml_Schema.prototype,{
	__class__: yaml_schema_DefaultSchema
});
var yaml_schema_MinimalSchema = function() {
	yaml_Schema.call(this,[],[new yaml_type_YString(),new yaml_type_YSeq(),new yaml_type_YMap()]);
};
yaml_schema_MinimalSchema.__name__ = ["yaml","schema","MinimalSchema"];
yaml_schema_MinimalSchema.__super__ = yaml_Schema;
yaml_schema_MinimalSchema.prototype = $extend(yaml_Schema.prototype,{
	__class__: yaml_schema_MinimalSchema
});
var yaml_schema_SafeSchema = function() {
	yaml_Schema.call(this,[new yaml_schema_MinimalSchema()],[new yaml_type_YBinary(),new yaml_type_YOmap(),new yaml_type_YPairs(),new yaml_type_YSet()],[new yaml_type_YNull(),new yaml_type_YBool(),new yaml_type_YInt(),new yaml_type_YFloat(),new yaml_type_YTimestamp(),new yaml_type_YMerge()]);
};
yaml_schema_SafeSchema.__name__ = ["yaml","schema","SafeSchema"];
yaml_schema_SafeSchema.__super__ = yaml_Schema;
yaml_schema_SafeSchema.prototype = $extend(yaml_Schema.prototype,{
	__class__: yaml_schema_SafeSchema
});
var yaml_type_YBinary = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:binary",{ kind : "string"},{ kind : "binary", instanceOf : haxe_io_Bytes});
};
yaml_type_YBinary.__name__ = ["yaml","type","YBinary"];
yaml_type_YBinary.__super__ = yaml_YamlType;
yaml_type_YBinary.prototype = $extend(yaml_YamlType.prototype,{
	resolve: function(object,usingMaps,explicit) {
		if(usingMaps == null) usingMaps = true;
		var length = object.length;
		var idx = 0;
		var result = [];
		var leftbits = 0;
		var leftdata = 0;
		var _g = 0;
		while(_g < length) {
			var idx1 = _g++;
			var code = HxOverrides.cca(object,idx1);
			var value = yaml_type_YBinary.BASE64_BINTABLE[code & 127];
			if(10 != code && 13 != code) {
				if(-1 == value) return this.cantResolveType({ fileName : "YBinary.hx", lineNumber : 49, className : "yaml.type.YBinary", methodName : "resolve"});
				leftdata = leftdata << 6 | value;
				leftbits += 6;
				if(leftbits >= 8) {
					leftbits -= 8;
					if(61 != code) result.push(leftdata >> leftbits & 255);
					leftdata &= (1 << leftbits) - 1;
				}
			}
		}
		if(leftbits != 0) this.cantResolveType({ fileName : "YBinary.hx", lineNumber : 71, className : "yaml.type.YBinary", methodName : "resolve"});
		var bytes = haxe_io_Bytes.alloc(result.length);
		var _g1 = 0;
		var _g2 = result.length;
		while(_g1 < _g2) {
			var i = _g1++;
			bytes.b[i] = result[i] & 255;
		}
		return bytes;
	}
	,represent: function(object,style) {
		var result = "";
		var index = 0;
		var max = object.length - 2;
		while(index < max) {
			result += yaml_type_YBinary.BASE64_CHARTABLE[object.b[index] >> 2];
			result += yaml_type_YBinary.BASE64_CHARTABLE[((object.b[index] & 3) << 4) + (object.b[index + 1] >> 4)];
			result += yaml_type_YBinary.BASE64_CHARTABLE[((object.b[index + 1] & 15) << 2) + (object.b[index + 2] >> 6)];
			result += yaml_type_YBinary.BASE64_CHARTABLE[object.b[index + 2] & 63];
			index += 3;
		}
		var rest = object.length % 3;
		if(0 != rest) {
			index = object.length - rest;
			result += yaml_type_YBinary.BASE64_CHARTABLE[object.b[index] >> 2];
			if(2 == rest) {
				result += yaml_type_YBinary.BASE64_CHARTABLE[((object.b[index] & 3) << 4) + (object.b[index + 1] >> 4)];
				result += yaml_type_YBinary.BASE64_CHARTABLE[(object.b[index + 1] & 15) << 2];
				result += "=";
			} else {
				result += yaml_type_YBinary.BASE64_CHARTABLE[(object.b[index] & 3) << 4];
				result += 61 + "=";
			}
		}
		return result;
	}
	,__class__: yaml_type_YBinary
});
var yaml_type_YBool = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:bool",{ kind : "string"},{ kind : "boolean", defaultStyle : "lowercase"});
};
yaml_type_YBool.__name__ = ["yaml","type","YBool"];
yaml_type_YBool.__super__ = yaml_YamlType;
yaml_type_YBool.prototype = $extend(yaml_YamlType.prototype,{
	resolve: function(object,usingMaps,explicit) {
		if(usingMaps == null) usingMaps = true;
		if(explicit) {
			if(yaml_type_YBool.YAML_EXPLICIT_BOOLEAN_MAP.exists(object)) return yaml_type_YBool.YAML_EXPLICIT_BOOLEAN_MAP.get(object); else return this.cantResolveType({ fileName : "YBool.hx", lineNumber : 64, className : "yaml.type.YBool", methodName : "resolve"});
		} else if(yaml_type_YBool.YAML_IMPLICIT_BOOLEAN_MAP.exists(object)) return yaml_type_YBool.YAML_IMPLICIT_BOOLEAN_MAP.get(object); else return this.cantResolveType({ fileName : "YBool.hx", lineNumber : 75, className : "yaml.type.YBool", methodName : "resolve"});
	}
	,represent: function(object,style) {
		if(style != null) switch(style) {
		case "uppercase":
			if(object) return "TRUE"; else return "FALSE";
			break;
		case "lowercase":
			if(object) return "true"; else return "false";
			break;
		case "camelcase":
			if(object) return "True"; else return "False";
			break;
		default:
			throw new js__$Boot_HaxeError(new yaml_YamlException("Style not supported: " + style,null,{ fileName : "YBool.hx", lineNumber : 88, className : "yaml.type.YBool", methodName : "represent"}));
			return null;
		} else {
			throw new js__$Boot_HaxeError(new yaml_YamlException("Style not supported: " + style,null,{ fileName : "YBool.hx", lineNumber : 88, className : "yaml.type.YBool", methodName : "represent"}));
			return null;
		}
	}
	,__class__: yaml_type_YBool
});
var yaml_type_YFloat = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:float",{ kind : "string"},{ kind : "float", defaultStyle : "lowercase"});
};
yaml_type_YFloat.__name__ = ["yaml","type","YFloat"];
yaml_type_YFloat.__super__ = yaml_YamlType;
yaml_type_YFloat.prototype = $extend(yaml_YamlType.prototype,{
	resolve: function(object,usingMaps,explicit) {
		if(usingMaps == null) usingMaps = true;
		if(!yaml_type_YFloat.YAML_FLOAT_PATTERN.match(object)) this.cantResolveType({ fileName : "YFloat.hx", lineNumber : 23, className : "yaml.type.YFloat", methodName : "resolve"});
		var value = StringTools.replace(object,"_","").toLowerCase();
		var sign;
		if("-" == value.charAt(0)) sign = -1; else sign = 1;
		if(0 <= "+-".indexOf(value.charAt(0))) value = HxOverrides.substr(value,1,null);
		if(".inf" == value) if(1 == sign) {
			return Infinity;
		} else return -Infinity; else if(".nan" == value) return NaN; else if(0 <= value.indexOf(":")) {
			var digits = [];
			var _g = 0;
			var _g1 = value.split(":");
			while(_g < _g1.length) {
				var v1 = _g1[_g];
				++_g;
				digits.unshift(parseFloat(v1));
			}
			var v = 0.0;
			var base = 1;
			var _g2 = 0;
			while(_g2 < digits.length) {
				var d = digits[_g2];
				++_g2;
				v += d * base;
				base *= 60;
			}
			return sign * v;
		} else return sign * parseFloat(value);
	}
	,represent: function(object,style) {
		if(isNaN(object)) if(style != null) switch(style) {
		case "lowercase":
			return ".nan";
		case "uppercase":
			return ".NAN";
		case "camelcase":
			return ".NaN";
		default:
			return ".nan";
		} else return ".nan"; else if(Infinity == object) if(style != null) switch(style) {
		case "lowercase":
			return ".inf";
		case "uppercase":
			return ".INF";
		case "camelcase":
			return ".Inf";
		default:
			return ".inf";
		} else return ".inf"; else if(-Infinity == object) if(style != null) switch(style) {
		case "lowercase":
			return "-.inf";
		case "uppercase":
			return "-.INF";
		case "camelcase":
			return "-.Inf";
		default:
			return "-.inf";
		} else return "-.inf"; else return yaml_util_Floats.toString(object);
	}
	,__class__: yaml_type_YFloat
});
var yaml_type_YInt = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:int",{ kind : "string"},{ kind : "integer", defaultStyle : "decimal", styleAliases : this.createStyleAliases()});
};
yaml_type_YInt.__name__ = ["yaml","type","YInt"];
yaml_type_YInt.__super__ = yaml_YamlType;
yaml_type_YInt.prototype = $extend(yaml_YamlType.prototype,{
	createStyleAliases: function() {
		var styleAliases = new haxe_ds_StringMap();
		if(__map_reserved.bin != null) styleAliases.setReserved("bin","binary"); else styleAliases.h["bin"] = "binary";
		if(__map_reserved["2"] != null) styleAliases.setReserved("2","binary"); else styleAliases.h["2"] = "binary";
		if(__map_reserved.oct != null) styleAliases.setReserved("oct","octal"); else styleAliases.h["oct"] = "octal";
		if(__map_reserved["8"] != null) styleAliases.setReserved("8","octal"); else styleAliases.h["8"] = "octal";
		if(__map_reserved.dec != null) styleAliases.setReserved("dec","decimal"); else styleAliases.h["dec"] = "decimal";
		if(__map_reserved.hex != null) styleAliases.setReserved("hex","hexadecimal"); else styleAliases.h["hex"] = "hexadecimal";
		if(__map_reserved["16"] != null) styleAliases.setReserved("16","hexadecimal"); else styleAliases.h["16"] = "hexadecimal";
		return styleAliases;
	}
	,resolve: function(object,usingMaps,explicit) {
		if(usingMaps == null) usingMaps = true;
		if(!yaml_type_YInt.YAML_INTEGER_PATTERN.match(object)) this.cantResolveType({ fileName : "YInt.hx", lineNumber : 38, className : "yaml.type.YInt", methodName : "resolve"});
		var value = StringTools.replace(object,"_","").toLowerCase();
		var sign;
		if("-" == value.charAt(0)) sign = -1; else sign = 1;
		var digits = [];
		if(0 <= "+-".indexOf(value.charAt(0))) value = HxOverrides.substr(value,1,null);
		if("0" == value) return 0; else if(value.indexOf("0b") == 0) return sign * yaml_util_Ints.parseInt(HxOverrides.substr(value,2,null),2); else if(value.indexOf("0x") == 0) return sign * yaml_util_Ints.parseInt(value,16); else if(value.indexOf("0") == 0) return sign * yaml_util_Ints.parseInt(value,8); else if(0 <= value.indexOf(":")) {
			var _g = 0;
			var _g1 = value.split(":");
			while(_g < _g1.length) {
				var v = _g1[_g];
				++_g;
				digits.unshift(yaml_util_Ints.parseInt(v,10));
			}
			var result = 0;
			var base = 1;
			var _g2 = 0;
			while(_g2 < digits.length) {
				var d = digits[_g2];
				++_g2;
				result += d * base;
				base *= 60;
			}
			return sign * result;
		} else return sign * yaml_util_Ints.parseInt(value,10);
	}
	,represent: function(object,style) {
		if(style != null) switch(style) {
		case "binary":
			return "0b" + yaml_util_Ints.toString(object,2);
		case "octal":
			return "0" + yaml_util_Ints.toString(object,8);
		case "decimal":
			return yaml_util_Ints.toString(object,10);
		case "hexadecimal":
			return "0x" + yaml_util_Ints.toString(object,16);
		default:
			throw new js__$Boot_HaxeError(new yaml_YamlException("Style not supported: " + style,null,{ fileName : "YInt.hx", lineNumber : 99, className : "yaml.type.YInt", methodName : "represent"}));
			return null;
		} else {
			throw new js__$Boot_HaxeError(new yaml_YamlException("Style not supported: " + style,null,{ fileName : "YInt.hx", lineNumber : 99, className : "yaml.type.YInt", methodName : "represent"}));
			return null;
		}
	}
	,__class__: yaml_type_YInt
});
var yaml_type_YMap = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:map",{ kind : "object", skip : true},{ skip : true});
};
yaml_type_YMap.__name__ = ["yaml","type","YMap"];
yaml_type_YMap.__super__ = yaml_YamlType;
yaml_type_YMap.prototype = $extend(yaml_YamlType.prototype,{
	__class__: yaml_type_YMap
});
var yaml_type_YMerge = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:merge",{ kind : "string"},{ skip : true});
};
yaml_type_YMerge.__name__ = ["yaml","type","YMerge"];
yaml_type_YMerge.__super__ = yaml_YamlType;
yaml_type_YMerge.prototype = $extend(yaml_YamlType.prototype,{
	resolve: function(object,usingMaps,explicit) {
		if(usingMaps == null) usingMaps = true;
		if("<<" == object) return object; else return this.cantResolveType({ fileName : "YMerge.hx", lineNumber : 14, className : "yaml.type.YMerge", methodName : "resolve"});
	}
	,represent: function(object,style) {
		return null;
	}
	,__class__: yaml_type_YMerge
});
var yaml_type_YNull = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:null",{ kind : "string"},{ kind : "null", defaultStyle : "lowercase"});
};
yaml_type_YNull.__name__ = ["yaml","type","YNull"];
yaml_type_YNull.__super__ = yaml_YamlType;
yaml_type_YNull.prototype = $extend(yaml_YamlType.prototype,{
	resolve: function(object,usingMaps,explicit) {
		if(explicit == null) explicit = false;
		if(usingMaps == null) usingMaps = true;
		if(yaml_type_YNull.YAML_NULL_MAP.exists(object)) return null; else return this.cantResolveType({ fileName : "YNull.hx", lineNumber : 24, className : "yaml.type.YNull", methodName : "resolve"});
	}
	,represent: function(object,style) {
		if(style != null) switch(style) {
		case "canonical":
			return "~";
		case "lowercase":
			return "null";
		case "uppercase":
			return "NULL";
		case "camelcase":
			return "Null";
		default:
			return "~";
		} else return "~";
	}
	,__class__: yaml_type_YNull
});
var yaml_type_YOmap = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:omap",{ kind : "array"},{ skip : true});
};
yaml_type_YOmap.__name__ = ["yaml","type","YOmap"];
yaml_type_YOmap.__super__ = yaml_YamlType;
yaml_type_YOmap.prototype = $extend(yaml_YamlType.prototype,{
	resolve: function(object,usingMaps,explicit) {
		if(explicit == null) explicit = false;
		if(usingMaps == null) usingMaps = true;
		if(usingMaps) this.validateOMap(object); else this.validateObjectOMap(object);
		return object;
	}
	,validateOMap: function(object) {
		var objectKeys = new yaml_util_TObjectMap();
		var _g = 0;
		while(_g < object.length) {
			var pair = object[_g];
			++_g;
			var pairHasKey = false;
			var pairKey = null;
			if(!js_Boot.__instanceof(pair,yaml_util_TObjectMap)) this.cantResolveType({ fileName : "YOmap.hx", lineNumber : 31, className : "yaml.type.YOmap", methodName : "validateOMap"});
			var $it0 = pair.keys();
			while( $it0.hasNext() ) {
				var key = $it0.next();
				if(pairKey == null) pairKey = key; else this.cantResolveType({ fileName : "YOmap.hx", lineNumber : 36, className : "yaml.type.YOmap", methodName : "validateOMap"});
			}
			if(pairKey == null) this.cantResolveType({ fileName : "YOmap.hx", lineNumber : 40, className : "yaml.type.YOmap", methodName : "validateOMap"});
			if(objectKeys.exists(pairKey)) this.cantResolveType({ fileName : "YOmap.hx", lineNumber : 43, className : "yaml.type.YOmap", methodName : "validateOMap"}); else objectKeys.set(pairKey,null);
		}
		return object;
	}
	,validateObjectOMap: function(object) {
		var objectKeys = new haxe_ds_StringMap();
		var _g = 0;
		while(_g < object.length) {
			var pair = object[_g];
			++_g;
			var pairHasKey = false;
			var pairKey = null;
			if(Type["typeof"](pair) != ValueType.TObject) this.cantResolveType({ fileName : "YOmap.hx", lineNumber : 60, className : "yaml.type.YOmap", methodName : "validateObjectOMap"});
			var _g1 = 0;
			var _g2 = Reflect.fields(pair);
			while(_g1 < _g2.length) {
				var key = _g2[_g1];
				++_g1;
				if(pairKey == null) pairKey = key; else this.cantResolveType({ fileName : "YOmap.hx", lineNumber : 65, className : "yaml.type.YOmap", methodName : "validateObjectOMap"});
			}
			if(pairKey == null) this.cantResolveType({ fileName : "YOmap.hx", lineNumber : 69, className : "yaml.type.YOmap", methodName : "validateObjectOMap"});
			if(__map_reserved[pairKey] != null?objectKeys.existsReserved(pairKey):objectKeys.h.hasOwnProperty(pairKey)) this.cantResolveType({ fileName : "YOmap.hx", lineNumber : 72, className : "yaml.type.YOmap", methodName : "validateObjectOMap"}); else if(__map_reserved[pairKey] != null) objectKeys.setReserved(pairKey,null); else objectKeys.h[pairKey] = null;
		}
	}
	,__class__: yaml_type_YOmap
});
var yaml_type_YPairs = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:pairs",{ kind : "array"},{ skip : true});
};
yaml_type_YPairs.__name__ = ["yaml","type","YPairs"];
yaml_type_YPairs.__super__ = yaml_YamlType;
yaml_type_YPairs.prototype = $extend(yaml_YamlType.prototype,{
	resolve: function(object,usingMaps,explicit) {
		if(explicit == null) explicit = false;
		if(usingMaps == null) usingMaps = true;
		if(usingMaps) return this.resolveMapPair(object); else return this.resolveObjectPair(object);
	}
	,resolveMapPair: function(object) {
		var result = [];
		var _g = 0;
		while(_g < object.length) {
			var pair = object[_g];
			++_g;
			if(!js_Boot.__instanceof(pair,yaml_util_TObjectMap)) this.cantResolveType({ fileName : "YPairs.hx", lineNumber : 28, className : "yaml.type.YPairs", methodName : "resolveMapPair"});
			var fieldCount = 0;
			var keyPair = null;
			var $it0 = pair.keys();
			while( $it0.hasNext() ) {
				var key = $it0.next();
				keyPair = key;
				if(fieldCount++ > 1) break;
			}
			if(fieldCount != 1) this.cantResolveType({ fileName : "YPairs.hx", lineNumber : 39, className : "yaml.type.YPairs", methodName : "resolveMapPair"});
			result.push([keyPair,pair.get(keyPair)]);
		}
		return result;
	}
	,resolveObjectPair: function(object) {
		var result = [];
		var _g = 0;
		while(_g < object.length) {
			var pair = object[_g];
			++_g;
			if(Type["typeof"](pair) != ValueType.TObject) this.cantResolveType({ fileName : "YPairs.hx", lineNumber : 52, className : "yaml.type.YPairs", methodName : "resolveObjectPair"});
			var fieldCount = 0;
			var keyPair = null;
			var _g1 = 0;
			var _g2 = Reflect.fields(pair);
			while(_g1 < _g2.length) {
				var key = _g2[_g1];
				++_g1;
				keyPair = key;
				if(fieldCount++ > 1) break;
			}
			if(fieldCount != 1) this.cantResolveType({ fileName : "YPairs.hx", lineNumber : 63, className : "yaml.type.YPairs", methodName : "resolveObjectPair"});
			result.push([keyPair,Reflect.field(pair,keyPair)]);
		}
		return result;
	}
	,__class__: yaml_type_YPairs
});
var yaml_type_YSeq = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:seq",{ kind : "array", skip : true},{ skip : true});
};
yaml_type_YSeq.__name__ = ["yaml","type","YSeq"];
yaml_type_YSeq.__super__ = yaml_YamlType;
yaml_type_YSeq.prototype = $extend(yaml_YamlType.prototype,{
	__class__: yaml_type_YSeq
});
var yaml_type_YSet = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:set",{ kind : "object"},{ skip : true});
};
yaml_type_YSet.__name__ = ["yaml","type","YSet"];
yaml_type_YSet.__super__ = yaml_YamlType;
yaml_type_YSet.prototype = $extend(yaml_YamlType.prototype,{
	resolve: function(object,usingMaps,explicit) {
		if(explicit == null) explicit = false;
		if(usingMaps == null) usingMaps = true;
		if(usingMaps) this.validateSet(object); else this.validateObjectSet(object);
		return object;
	}
	,validateSet: function(object) {
		var $it0 = object.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			if(object.get(key) != null) this.cantResolveType({ fileName : "YSet.hx", lineNumber : 24, className : "yaml.type.YSet", methodName : "validateSet"});
		}
	}
	,validateObjectSet: function(object) {
		var _g = 0;
		var _g1 = Reflect.fields(object);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			if(Reflect.field(object,key) != null) this.cantResolveType({ fileName : "YSet.hx", lineNumber : 31, className : "yaml.type.YSet", methodName : "validateObjectSet"});
		}
	}
	,__class__: yaml_type_YSet
});
var yaml_type_YString = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:str",{ kind : "string", skip : true},{ skip : true});
};
yaml_type_YString.__name__ = ["yaml","type","YString"];
yaml_type_YString.__super__ = yaml_YamlType;
yaml_type_YString.prototype = $extend(yaml_YamlType.prototype,{
	__class__: yaml_type_YString
});
var yaml_type_YTimestamp = function() {
	yaml_YamlType.call(this,"tag:yaml.org,2002:timestamp",{ kind : "string"},{ kind : "object", instanceOf : Date});
};
yaml_type_YTimestamp.__name__ = ["yaml","type","YTimestamp"];
yaml_type_YTimestamp.nativeDate = function() {
	return Date;
	return null;
};
yaml_type_YTimestamp.__super__ = yaml_YamlType;
yaml_type_YTimestamp.prototype = $extend(yaml_YamlType.prototype,{
	resolve: function(object,usingMaps,explicit) {
		if(explicit == null) explicit = false;
		if(usingMaps == null) usingMaps = true;
		if(!yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.match(object)) this.cantResolveType({ fileName : "YTimestamp.hx", lineNumber : 28, className : "yaml.type.YTimestamp", methodName : "resolve"});
		var year = 0;
		var month = 0;
		var day = 0;
		var hour = 0;
		var minute = 0;
		var second = 0;
		var fraction = 0;
		var delta = 0;
		try {
			year = Std.parseInt(yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.matched(1));
			month = Std.parseInt(yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.matched(2)) - 1;
			day = Std.parseInt(yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.matched(3));
			hour = Std.parseInt(yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.matched(4));
			minute = Std.parseInt(yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.matched(5));
			second = Std.parseInt(yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.matched(6));
			var matched = -1;
			if(year == null) matched = year = 0;
			if(month == null) matched = month = 0;
			if(day == null) matched = day = 0;
			if(hour == null) matched = hour = 0;
			if(minute == null) matched = minute = 0;
			if(second == null) matched = second = 0;
			if(matched == 0) throw new js__$Boot_HaxeError("Nothing left to match");
			var msecs = yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.matched(7);
			if(msecs == null) throw new js__$Boot_HaxeError("Nothing left to match");
			var f = msecs.substring(0,3);
			while(f.length < 3) f += "0";
			fraction = Std.parseInt(f);
			if(yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.matched(9) != null) {
				var tz_hour = Std.parseInt(yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.matched(10));
				if(tz_hour == null) throw new js__$Boot_HaxeError("Nothing left to match");
				var tz_minute = 0;
				try {
					tz_minute = Std.parseInt(yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.matched(11));
					if(tz_minute == null) tz_minute = 0;
				} catch( e ) {
					if (e instanceof js__$Boot_HaxeError) e = e.val;
				}
				delta = (tz_hour * 60 + tz_minute) * 60000;
				if("-" == yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP.matched(9)) delta = -delta;
			}
		} catch( e1 ) {
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		}
		var stamp = yaml_type_YTimestamp.nativeDate().UTC(year,month,day,hour,minute,second,fraction);
		if(delta != 0) stamp = stamp - delta;
		var d = new Date();
		d.setTime(stamp);
		return d;
	}
	,represent: function(object,style) {
		return yaml_util_Dates.toISOString(object);
	}
	,__class__: yaml_type_YTimestamp
});
var yaml_util_Dates = function() { };
yaml_util_Dates.__name__ = ["yaml","util","Dates"];
yaml_util_Dates.getNativeDate = function() {
	return Date;
	return null;
};
yaml_util_Dates.toISOString = function(date) {
	var NativeDate = yaml_util_Dates.getNativeDate();
	var d = new NativeDate(date.getTime());
	return d.getUTCFullYear() + "-" + StringTools.lpad("" + (d.getUTCMonth() + 1),"0",2) + "-" + StringTools.lpad("" + d.getUTCDate(),"0",2) + "T" + StringTools.lpad("" + d.getUTCHours(),"0",2) + ":" + StringTools.lpad("" + d.getUTCMinutes(),"0",2) + ":" + StringTools.lpad("" + d.getUTCSeconds(),"0",2) + "." + StringTools.rpad((function($this) {
		var $r;
		var _this = "" + yaml_util_Floats.round(d.getUTCMilliseconds() / 1000,3);
		$r = HxOverrides.substr(_this,2,5);
		return $r;
	}(this)),"0",3) + "Z";
};
var yaml_util_Floats = function() { };
yaml_util_Floats.__name__ = ["yaml","util","Floats"];
yaml_util_Floats.toString = function(value) {
	if(value == null) return "null"; else return "" + value;
};
yaml_util_Floats.round = function(value,precision) {
	value = value * Math.pow(10,precision);
	return Math.round(value) / Math.pow(10,precision);
};
var yaml_util_Ints = function() { };
yaml_util_Ints.__name__ = ["yaml","util","Ints"];
yaml_util_Ints.toString = function(value,radix) {
	if(radix == null) radix = 10;
	if(radix < 2 || radix > yaml_util_Ints.BASE.length) throw new js__$Boot_HaxeError("Unsupported radix " + radix);
	return value.toString(radix);
};
yaml_util_Ints.parseInt = function(value,radix) {
	if(radix != null && (radix < 2 || radix > yaml_util_Ints.BASE.length)) throw new js__$Boot_HaxeError("Unsupported radix " + radix);
	var v = parseInt(value,radix);
	if(isNaN(v)) return null; else return v;
};
var yaml_util_TObjectMap = function(weakKeys) {
	if(weakKeys == null) weakKeys = false;
	this._keys = [];
	this.values = [];
};
yaml_util_TObjectMap.__name__ = ["yaml","util","TObjectMap"];
yaml_util_TObjectMap.prototype = {
	set: function(key,value) {
		var _g1 = 0;
		var _g = this._keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._keys[i] == key) {
				this._keys[i] = key;
				this.values[i] = value;
				return;
			}
		}
		this._keys.push(key);
		this.values.push(value);
	}
	,get: function(key) {
		var _g1 = 0;
		var _g = this._keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._keys[i] == key) return this.values[i];
		}
		return null;
	}
	,exists: function(key) {
		var _g = 0;
		var _g1 = this._keys;
		while(_g < _g1.length) {
			var k = _g1[_g];
			++_g;
			if(k == key) return true;
		}
		return false;
	}
	,remove: function(key) {
		var _g1 = 0;
		var _g = this._keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._keys[i] == key) {
				this._keys.splice(i,1);
				this.values.splice(i,1);
				return true;
			}
		}
		return false;
	}
	,keys: function() {
		return HxOverrides.iter(this._keys);
	}
	,iterator: function() {
		return HxOverrides.iter(this.values);
	}
	,toString: function() {
		var s = "{";
		var ks = this._keys;
		var vs = this.values;
		var _g1 = 0;
		var _g = this._keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			var k;
			if(Type.getClass(ks[i]) == Array) k = "[" + ks[i] + "]"; else k = ks[i];
			var v;
			if(Type.getClass(vs[i]) == Array) v = "[" + vs[i] + "]"; else v = vs[i];
			s += k + " => " + v + ", ";
		}
		if(this._keys.length > 0) s = HxOverrides.substr(s,0,s.length - 2);
		return s + "}";
	}
	,__class__: yaml_util_TObjectMap
};
var yaml_util_Strings = function() { };
yaml_util_Strings.__name__ = ["yaml","util","Strings"];
yaml_util_Strings.repeat = function(source,times) {
	var result = "";
	var _g = 0;
	while(_g < times) {
		var i = _g++;
		result += source;
	}
	return result;
};
var yaml_util_Utf8 = function() { };
yaml_util_Utf8.__name__ = ["yaml","util","Utf8"];
yaml_util_Utf8.substring = function(value,startIndex,endIndex) {
	var size = value.length;
	var pos = startIndex;
	var length = 0;
	if(endIndex == null) length = size - pos; else {
		if(startIndex > endIndex) {
			pos = endIndex;
			endIndex = startIndex;
		}
		length = endIndex - pos;
	}
	return HxOverrides.substr(value,pos,length);
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
var ArrayBuffer = (Function("return typeof ArrayBuffer != 'undefined' ? ArrayBuffer : null"))() || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = (Function("return typeof DataView != 'undefined' ? DataView : null"))() || js_html_compat_DataView;
var Uint8Array = (Function("return typeof Uint8Array != 'undefined' ? Uint8Array : null"))() || js_html_compat_Uint8Array._new;
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
yaml_Parser.KIND_STRING = "string";
yaml_Parser.KIND_ARRAY = "array";
yaml_Parser.KIND_OBJECT = "object";
yaml_Parser.CONTEXT_FLOW_IN = 1;
yaml_Parser.CONTEXT_FLOW_OUT = 2;
yaml_Parser.CONTEXT_BLOCK_IN = 3;
yaml_Parser.CONTEXT_BLOCK_OUT = 4;
yaml_Parser.CHOMPING_CLIP = 1;
yaml_Parser.CHOMPING_STRIP = 2;
yaml_Parser.CHOMPING_KEEP = 3;
yaml_Parser.CHAR_TAB = 9;
yaml_Parser.CHAR_LINE_FEED = 10;
yaml_Parser.CHAR_CARRIAGE_RETURN = 13;
yaml_Parser.CHAR_SPACE = 32;
yaml_Parser.CHAR_EXCLAMATION = 33;
yaml_Parser.CHAR_DOUBLE_QUOTE = 34;
yaml_Parser.CHAR_SHARP = 35;
yaml_Parser.CHAR_PERCENT = 37;
yaml_Parser.CHAR_AMPERSAND = 38;
yaml_Parser.CHAR_SINGLE_QUOTE = 39;
yaml_Parser.CHAR_ASTERISK = 42;
yaml_Parser.CHAR_PLUS = 43;
yaml_Parser.CHAR_COMMA = 44;
yaml_Parser.CHAR_MINUS = 45;
yaml_Parser.CHAR_DOT = 46;
yaml_Parser.CHAR_SLASH = 47;
yaml_Parser.CHAR_DIGIT_ZERO = 48;
yaml_Parser.CHAR_DIGIT_ONE = 49;
yaml_Parser.CHAR_DIGIT_NINE = 57;
yaml_Parser.CHAR_COLON = 58;
yaml_Parser.CHAR_LESS_THAN = 60;
yaml_Parser.CHAR_GREATER_THAN = 62;
yaml_Parser.CHAR_QUESTION = 63;
yaml_Parser.CHAR_COMMERCIAL_AT = 64;
yaml_Parser.CHAR_CAPITAL_A = 65;
yaml_Parser.CHAR_CAPITAL_F = 70;
yaml_Parser.CHAR_CAPITAL_L = 76;
yaml_Parser.CHAR_CAPITAL_N = 78;
yaml_Parser.CHAR_CAPITAL_P = 80;
yaml_Parser.CHAR_CAPITAL_U = 85;
yaml_Parser.CHAR_LEFT_SQUARE_BRACKET = 91;
yaml_Parser.CHAR_BACKSLASH = 92;
yaml_Parser.CHAR_RIGHT_SQUARE_BRACKET = 93;
yaml_Parser.CHAR_UNDERSCORE = 95;
yaml_Parser.CHAR_GRAVE_ACCENT = 96;
yaml_Parser.CHAR_SMALL_A = 97;
yaml_Parser.CHAR_SMALL_B = 98;
yaml_Parser.CHAR_SMALL_E = 101;
yaml_Parser.CHAR_SMALL_F = 102;
yaml_Parser.CHAR_SMALL_N = 110;
yaml_Parser.CHAR_SMALL_R = 114;
yaml_Parser.CHAR_SMALL_T = 116;
yaml_Parser.CHAR_SMALL_U = 117;
yaml_Parser.CHAR_SMALL_V = 118;
yaml_Parser.CHAR_SMALL_X = 120;
yaml_Parser.CHAR_LEFT_CURLY_BRACKET = 123;
yaml_Parser.CHAR_VERTICAL_LINE = 124;
yaml_Parser.CHAR_RIGHT_CURLY_BRACKET = 125;
yaml_Parser.SIMPLE_ESCAPE_SEQUENCES = (function($this) {
	var $r;
	var hash = new haxe_ds_IntMap();
	hash.set(48,yaml_Parser.createUtf8Char(0));
	hash.set(97,yaml_Parser.createUtf8Char(7));
	hash.set(98,yaml_Parser.createUtf8Char(8));
	hash.set(116,yaml_Parser.createUtf8Char(9));
	hash.set(9,yaml_Parser.createUtf8Char(9));
	hash.set(110,yaml_Parser.createUtf8Char(10));
	hash.set(118,yaml_Parser.createUtf8Char(11));
	hash.set(102,yaml_Parser.createUtf8Char(12));
	hash.set(114,yaml_Parser.createUtf8Char(13));
	hash.set(101,yaml_Parser.createUtf8Char(27));
	hash.set(32,yaml_Parser.createUtf8Char(32));
	hash.set(34,yaml_Parser.createUtf8Char(34));
	hash.set(47,yaml_Parser.createUtf8Char(47));
	hash.set(92,yaml_Parser.createUtf8Char(92));
	hash.set(78,yaml_Parser.createUtf8Char(133));
	hash.set(95,yaml_Parser.createUtf8Char(160));
	hash.set(76,yaml_Parser.createUtf8Char(8232));
	hash.set(80,yaml_Parser.createUtf8Char(8233));
	$r = hash;
	return $r;
}(this));
yaml_Parser.HEXADECIMAL_ESCAPE_SEQUENCES = (function($this) {
	var $r;
	var hash = new haxe_ds_IntMap();
	hash.h[120] = 2;
	hash.h[117] = 4;
	hash.h[85] = 8;
	$r = hash;
	return $r;
}(this));
yaml_Parser.PATTERN_NON_PRINTABLE = new EReg("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F-\\x84\\x86-\\x9F\\uD800-\\uDFFF\\uFFFE\\uFFFF]","u");
yaml_Parser.PATTERN_NON_ASCII_LINE_BREAKS = new EReg("[\\x85\\u2028\\u2029]","u");
yaml_Parser.PATTERN_FLOW_INDICATORS = new EReg("[,\\[\\]\\{\\}]","u");
yaml_Parser.PATTERN_TAG_HANDLE = new EReg("^(?:!|!!|![a-z\\-]+!)$","iu");
yaml_Parser.PATTERN_TAG_URI = new EReg("^(?:!|[^,\\[\\]\\{\\}])(?:%[0-9a-f]{2}|[0-9a-z\\-#;/\\?:@&=\\+\\$,_\\.!~\\*'\\(\\)\\[\\]])*$","iu");
yaml_Renderer.CHAR_TAB = 9;
yaml_Renderer.CHAR_LINE_FEED = 10;
yaml_Renderer.CHAR_CARRIAGE_RETURN = 13;
yaml_Renderer.CHAR_SPACE = 32;
yaml_Renderer.CHAR_EXCLAMATION = 33;
yaml_Renderer.CHAR_DOUBLE_QUOTE = 34;
yaml_Renderer.CHAR_SHARP = 35;
yaml_Renderer.CHAR_PERCENT = 37;
yaml_Renderer.CHAR_AMPERSAND = 38;
yaml_Renderer.CHAR_SINGLE_QUOTE = 39;
yaml_Renderer.CHAR_ASTERISK = 42;
yaml_Renderer.CHAR_COMMA = 44;
yaml_Renderer.CHAR_MINUS = 45;
yaml_Renderer.CHAR_COLON = 58;
yaml_Renderer.CHAR_GREATER_THAN = 62;
yaml_Renderer.CHAR_QUESTION = 63;
yaml_Renderer.CHAR_COMMERCIAL_AT = 64;
yaml_Renderer.CHAR_LEFT_SQUARE_BRACKET = 91;
yaml_Renderer.CHAR_RIGHT_SQUARE_BRACKET = 93;
yaml_Renderer.CHAR_GRAVE_ACCENT = 96;
yaml_Renderer.CHAR_LEFT_CURLY_BRACKET = 123;
yaml_Renderer.CHAR_VERTICAL_LINE = 124;
yaml_Renderer.CHAR_RIGHT_CURLY_BRACKET = 125;
yaml_Renderer.HEX_VALUES = "0123456789ABCDEF";
yaml_Renderer.ESCAPE_SEQUENCES = (function($this) {
	var $r;
	var hash = new haxe_ds_IntMap();
	hash.h[0] = "\\0";
	hash.h[7] = "\\a";
	hash.h[8] = "\\b";
	hash.h[9] = "\\t";
	hash.h[10] = "\\n";
	hash.h[11] = "\\v";
	hash.h[12] = "\\f";
	hash.h[13] = "\\r";
	hash.h[27] = "\\e";
	hash.h[34] = "\\\"";
	hash.h[92] = "\\\\";
	hash.h[133] = "\\N";
	hash.h[160] = "\\_";
	hash.h[8232] = "\\L";
	hash.h[8233] = "\\P";
	$r = hash;
	return $r;
}(this));
yaml_type_YBinary.BASE64_PADDING_CODE = 61;
yaml_type_YBinary.BASE64_PADDING_CHAR = "=";
yaml_type_YBinary.BASE64_BINTABLE = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,0,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1];
yaml_type_YBinary.BASE64_CHARTABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
yaml_type_YBool.YAML_IMPLICIT_BOOLEAN_MAP = (function($this) {
	var $r;
	var hash = new haxe_ds_StringMap();
	if(__map_reserved["true"] != null) hash.setReserved("true",true); else hash.h["true"] = true;
	if(__map_reserved.True != null) hash.setReserved("True",true); else hash.h["True"] = true;
	if(__map_reserved.TRUE != null) hash.setReserved("TRUE",true); else hash.h["TRUE"] = true;
	if(__map_reserved["false"] != null) hash.setReserved("false",false); else hash.h["false"] = false;
	if(__map_reserved.False != null) hash.setReserved("False",false); else hash.h["False"] = false;
	if(__map_reserved.FALSE != null) hash.setReserved("FALSE",false); else hash.h["FALSE"] = false;
	$r = hash;
	return $r;
}(this));
yaml_type_YBool.YAML_EXPLICIT_BOOLEAN_MAP = (function($this) {
	var $r;
	var hash = new haxe_ds_StringMap();
	if(__map_reserved["true"] != null) hash.setReserved("true",true); else hash.h["true"] = true;
	if(__map_reserved.True != null) hash.setReserved("True",true); else hash.h["True"] = true;
	if(__map_reserved.TRUE != null) hash.setReserved("TRUE",true); else hash.h["TRUE"] = true;
	if(__map_reserved["false"] != null) hash.setReserved("false",false); else hash.h["false"] = false;
	if(__map_reserved.False != null) hash.setReserved("False",false); else hash.h["False"] = false;
	if(__map_reserved.FALSE != null) hash.setReserved("FALSE",false); else hash.h["FALSE"] = false;
	if(__map_reserved.y != null) hash.setReserved("y",true); else hash.h["y"] = true;
	if(__map_reserved.Y != null) hash.setReserved("Y",true); else hash.h["Y"] = true;
	if(__map_reserved.yes != null) hash.setReserved("yes",true); else hash.h["yes"] = true;
	if(__map_reserved.Yes != null) hash.setReserved("Yes",true); else hash.h["Yes"] = true;
	if(__map_reserved.YES != null) hash.setReserved("YES",true); else hash.h["YES"] = true;
	if(__map_reserved.n != null) hash.setReserved("n",false); else hash.h["n"] = false;
	if(__map_reserved.N != null) hash.setReserved("N",false); else hash.h["N"] = false;
	if(__map_reserved.no != null) hash.setReserved("no",false); else hash.h["no"] = false;
	if(__map_reserved.No != null) hash.setReserved("No",false); else hash.h["No"] = false;
	if(__map_reserved.NO != null) hash.setReserved("NO",false); else hash.h["NO"] = false;
	if(__map_reserved.on != null) hash.setReserved("on",true); else hash.h["on"] = true;
	if(__map_reserved.On != null) hash.setReserved("On",true); else hash.h["On"] = true;
	if(__map_reserved.ON != null) hash.setReserved("ON",true); else hash.h["ON"] = true;
	if(__map_reserved.off != null) hash.setReserved("off",false); else hash.h["off"] = false;
	if(__map_reserved.Off != null) hash.setReserved("Off",false); else hash.h["Off"] = false;
	if(__map_reserved.OFF != null) hash.setReserved("OFF",false); else hash.h["OFF"] = false;
	$r = hash;
	return $r;
}(this));
yaml_type_YFloat.YAML_FLOAT_PATTERN = new EReg("^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?" + "|\\.[0-9_]+(?:[eE][-+][0-9]+)?" + "|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*" + "|[-+]?\\.(?:inf|Inf|INF)" + "|\\.(?:nan|NaN|NAN))$","iu");
yaml_type_YInt.YAML_INTEGER_PATTERN = new EReg("^(?:[-+]?0b[0-1_]+" + "|[-+]?0[0-7_]+" + "|[-+]?(?:0|[1-9][0-9_]*)" + "|[-+]?0x[0-9a-fA-F_]+" + "|[-+]?[1-9][0-9_]*(?::[0-5]?[0-9])+)$","iu");
yaml_type_YNull.YAML_NULL_MAP = (function($this) {
	var $r;
	var hash = new haxe_ds_StringMap();
	if(__map_reserved["~"] != null) hash.setReserved("~",true); else hash.h["~"] = true;
	if(__map_reserved["null"] != null) hash.setReserved("null",true); else hash.h["null"] = true;
	if(__map_reserved.Null != null) hash.setReserved("Null",true); else hash.h["Null"] = true;
	if(__map_reserved.NULL != null) hash.setReserved("NULL",true); else hash.h["NULL"] = true;
	$r = hash;
	return $r;
}(this));
yaml_type_YTimestamp.YAML_TIMESTAMP_REGEXP = new EReg("^([0-9][0-9][0-9][0-9])" + "-([0-9][0-9]?)" + "-([0-9][0-9]?)" + "(?:(?:[Tt]|[ \\t]+)" + "([0-9][0-9]?)" + ":([0-9][0-9])" + ":([0-9][0-9])" + "(?:\\.([0-9]*))?" + "(?:[ \\t]*(Z|([-+])([0-9][0-9]?)" + "(?::([0-9][0-9]))?))?)?$","iu");
yaml_util_Ints.BASE = "0123456789abcdefghijklmnopqrstuvwxyz";
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});
