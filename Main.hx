import js.node.Fs;
import yaml.Yaml;
import yaml.Parser;
import yaml.Renderer;
import yaml.util.ObjectMap;
import yaml.type.YInt;
import js.Node;
import js.Node.*;
import haxe.ds.*;

import haxe.Json.*;

using  haxe.ds.Option;
// PARTIAL OPENAPI START


enum ApiCheck {
    None;
    ApiObject(def:ApiDefinition);
}

typedef ApiDefinition = {
    swagger : ApiVersion,
    host    : ApiHost,
    basePath: ApiBasePath,
}

typedef ApiVersion  = String;
typedef ApiHost     = String;
typedef ApiBasePath = String;


typedef ApiBinding = {
    site            : String, 
    localhost       : String, 
    operations      : Array<Dynamic>,
    userDomain      : String ,
    legacyDomain    : String

}

typedef Operation = {
    ?httpMethod     : String,
    ?path           : String,
    ?summary        : String,
    ?cacheEvents    : Dynamic,
    ?operationId    : String,
    ?businessClasss : String
}
class ApiOperation {
    
  var txtArgs   : String;
  var original       : Dynamic;
  var path      : String;
  var urlParams : Dynamic;
  var extraParams     : Dynamic; 
  var cacheEvents     : Dynamic; 
  var summary : Dynamic;

  public function new(t : Dynamic){
    original = t;
    path =  original.operation.path;     
    summary = haxe.Json.parse(StringTools.replace(original.operation.summary,"'",'"'));


    cacheEvents = original.operation.cacheEvents;

    var r = ~/\{([^}]+)\}/g;
    urlParams = [];
    r.map(path, function(r) {
      var match = r.matched(0);
      switch (match) {
          default: 
            var f = match;
            f   = StringTools.replace(f,'{',':');
            f   = StringTools.replace(f,'}','');
            urlParams.push(f); 
            return match;
      };
    });
    
    path   = StringTools.replace(path,'{',':');
    path   = StringTools.replace(path,'}','');
    
    // extraParams will hold all our query parameters
    extraParams = { 'url_params' : urlParams , 'ttl' : summary.ttl, 'xttl' : summary.xttl, 'cachekey' :  summary.cachekey, 'xcachekey' : summary.xcachekey };    
  }
 
  public function getCacheArgs() {
    return summary;
  }

  public function getExtraParams() {
    return extraParams;
  }

  public function getCacheEvents() : Array<String>{
    return cacheEvents;
  }

  public function getPath() {
    return path;
  }

}

class Main {


  public static function initApiBinding(spec : String) : ApiBinding {
  
    var nativeObject = Yaml.parse(spec, Parser.options().useObjects());
   
    var info = Reflect.field(nativeObject, 'info');
        
    var sitePath = '';
    if (Reflect.hasField(info, 'x-website'))
        sitePath = Reflect.field(info, 'x-website');

    var localHost = '';
    if (Reflect.hasField(info, 'x-website'))
            localHost = Reflect.field(info, 'x-localhost');

    var userDomain = '';
    if (Reflect.hasField(info, 'x-domain'))
            userDomain = Reflect.field(info, 'x-domain');

    var legacyDomain = '';
    if (Reflect.hasField(info, 'x-legacy'))
            legacyDomain = Reflect.field(info, 'x-legacy');

    var paths  = Reflect.field(nativeObject, 'paths');
  
    var opPaths = [];
    var preparePath = Reflect.fields(nativeObject.paths);
    for (p in preparePath){
        var op = Reflect.field(nativeObject.paths,p);
        op.path = p;
        opPaths.push(op);
    }

    var operations = [];
       
    Lambda.map(opPaths, function(op) {
        var opex = Reflect.fields(op);

        var rPath = Reflect.field(op, 'path');
        Lambda.map(opex, function(opx) {
            var operation : Operation = {};
            switch(opx){
                case 'path' : operation.path = opx; 
                case _ : {
                    
                    operation.httpMethod = opx;
                    operation.path = rPath; 
                    operation.summary = '';
                    operation.operationId = '';
                    operation.businessClasss='Business';

                    var methodargs = Reflect.field(op, opx);      
                    var methodargsMap = Reflect.fields(methodargs);
                 
                    methodargsMap
                    .map(function (patharg) {
                        var val = Reflect.field(methodargs, patharg);
                        switch(patharg) {
                            case 'summary': operation.summary=val;
                            case 'operationId': operation.operationId=val;
                            case 'x-cache-flush': operation.cacheEvents=val;
                            case 'x-business-class': operation.businessClasss=val;
                        }
                    }); 
                    operations.push({operation:operation});
                }
            }
        });
    });    

    return {
        site : sitePath, 
        localhost: localHost, 
        operations : operations, 
        userDomain : userDomain ,
        legacyDomain : legacyDomain
    }
  }

   static public function getType(expr : Dynamic) : String{
        // TODO : find a way to type match with hx-yaml types (ie : YInt) ??
        var type = expr.type;     
        var format = expr.format;         
        return switch (type) {
            case 'string'   : switch (format) {
                case 'date': 'Date';
                case _: 'String';
            };
            case 'date'     : 'Date';
            case 'integer'  : 'Int';
            case 'boolean'  : 'Bool';
            case _          : 'String';
        }
    }

    static public function checkApiVersion(val : Dynamic) : ApiVersion {
        return switch (Type.getClass(val)) {
            case ApiVersion: val;
            case _ : throw "validateSwagger Error : YAML 'swagger' key  should be of type ApiVersion (String)";
        }
    }

    static public function checkApiHost(val : Dynamic) : ApiHost {
        return switch (Type.getClass(val)) {
            case ApiHost: val;
            case _ : throw "validateSwagger Error : YAML 'host' key  should be of type ApiHost (String)";
        }
    }

    static public function checkApiBasePath(val : Dynamic) : ApiBasePath {
        return switch (Type.getClass(val)) {
            case ApiBasePath: val;
            case _ : throw "validateSwagger Error : YAML 'basePath' key  should be of type ApiBasePath (String)";
        }
    }

    static public function safeParse(yaml : String) {

       var spec = safeParseTry(Yaml.parse(yaml));
       //trace(spec);
       switch(spec) {
            case ApiObject(d) : trace('ok spec');
            case None : trace('wrong spec');
        }   
    }

    static public function safeParseTry(yaml : Dynamic) : ApiCheck {
        if (Reflect.hasField(yaml,'_keys') && Reflect.hasField(yaml,'values')) {
            var v = untyped {};
            Lambda.mapi(yaml._keys,function(i,key){
                    var val = yaml.values[i];
                    if (!Reflect.hasField(val,'_keys')) {
                        switch (key) {
                            case 'swagger'  : v.swagger  = checkApiVersion(val);
                            case 'host'     : v.host     = checkApiHost(val);
                            case 'basePath' : v.basePath = checkApiBasePath(val);
                            case _: trace('skip');
                                    /*switch (Type.getClass(val)) {
                                        case _ : trace(key);
                                                 trace(val);
                                                 trace(Type.getClass(val));
                                    }*/
                        }
                    }
                    else {
                        //trace(key);
                        //safeParseTry({_keys:yaml.values[i]._keys,values:yaml.values[i].values});
                    }
                });
            return ApiObject(v);   
        }
        return None;         
    }

    static function main() {

        if(process.env.exists("input") && process.env.exists("output") && process.env.exists("type")) {
        
            var specPath    = process.env.get("input");
            var outPath     = process.env.get("output");
            var type        = process.env.get("type");

            var yaml = Fs.readFileSync(specPath, 'utf8');
            var nativeObject = Yaml.parse(yaml, Parser.options().useObjects());

            var apiBind = initApiBinding(yaml);

            if (type == "routes") {
                var final = [''];    
                apiBind
                .operations
                .map( function(operation) {
                    var apiOp = new ApiOperation(operation);
                    var args  = apiOp.getCacheArgs();
                    var extra = apiOp.getExtraParams();
                    var path  = apiOp.getPath();
                    var opId = operation.operation.operationId;
                    var businessClass = operation.operation.businessClasss;
                    var opMethod = operation.operation.httpMethod + '_' + opId;
                    var res = [];
                    res.push('\r\rapp.'+operation.operation.httpMethod+'( conf.get(\'BASE_URL\')+\'$path\',\r\t\t');

                     if (args.ttl != '0')     
                        res.push('cacheo.route({ expire: '+args.ttl+' }),\r\t\t');
                     else
                        res.push('untyped function(req: PistahxRequest, res: Response, next: MiddlewareNext) { next(); },\r\t\t');
                    res.push('untyped function(req : PistahxRequest, res : Response){\r\t\t');
                    res.push('$businessClass.$opMethod(db, req, res, dbcacher, cacheo, '+haxe.Json.stringify(extra)+').then(function(out) {\n');

                    if(Reflect.hasField(apiOp,'cacheEvents')){
                    var defsx = Reflect.fields(Reflect.field(apiOp,'cacheEvents'));
                    Lambda.map(defsx,function(def) {

                        res.push("cacheo.del('cacheout:'+conf.get('APP_NAME')+':'+conf.get('BASE_URL')+'"+Reflect.field(apiOp,'cacheEvents')[0]+"', function( err ,num ) {});\n");
                   
                    });
                    }
                    
                    res.push('res.send(out); });\r');
                    res.push('});');
                    final.push(res.join(''));
                });

                Fs.writeFile(
                    outPath, 
                    new js.node.Buffer(final.join('')),
                    function(err) {
                    console.log('$outPath file saved!');
                    }
                );

            }

            if (type == "typedef") {

                var defs = nativeObject.definitions;
                var defsx = Reflect.fields(defs);
                var final = ['import thx.core.*;\r\r'];
                Lambda.map(defsx,function(def) {
                    var res = [];
                    res.push('typedef $def = ');
                    var content = Reflect.field(defs, def);
                    

                    if (Reflect.hasField(content, 'properties')) {
                             

                        if (Reflect.hasField(content.properties, 'result')) {
                            res.push('List<' + Reflect.field(content.properties.result.items,"$ref").replace('#/definitions/','')+'>;\r\r');
                        }
                        else {
                    

                            res.push('{\r\t\t\t');

                            var props = Reflect.fields(content.properties);
                            var keys = [];
                            Lambda.map(props,function(prop) {
                                var propx = Reflect.field(content.properties,prop);
                                var type = getType(propx);
                                keys.push('$prop : $type');
                            }); 

                            res.push(keys.join(',\r\t\t\t'));

                            res.push("\r\t\t};\r\r");
                        
                        }
                    }
                    else {
                        var type = getType(content);
                        res.push('$type;\r\r');
                    }
                    
                    final.push(res.join(''));
                    

                    //MAPPERS
                    res=[];
                    if (Reflect.hasField(content, 'x-dto-model')) {
                        var tbName=Reflect.field(content,'x-dto-model');

                        res.push('class '+def+'Mapper {\r\r');

                        res.push('\tpublic static function db'+def+'To'+def+'( i : DB__$tbName) : $def {\r');
                        res.push('\t\tvar imap = new thx.AnonymousMap(i);\r\t');
                        res.push('\t\treturn {\r\t\t\t');

                        if (Reflect.hasField(content, 'properties')) {
                                 

                            if (Reflect.hasField(content.properties, 'result')) {
                            }
                            else {

                                var props = Reflect.fields(content.properties);
                                var keys = [];
                                Lambda.map(props,function(prop) {
                                    var propx = Reflect.field(content.properties,prop);
                                    var field = Reflect.field(propx,'x-dto-field');
                                    var assoc = Reflect.field(propx,'x-dto-assoc');
                                    var ftype = Reflect.field(propx,'x-dto-field-type');
                                    var r : EReg = ~/\./;
//                                     if(r.match(assoc)){
//                                        keys.push('$prop : untyped imap.get(\'$assoc\')');
//                                    }
                                    if(r.match(field)){
                                        if (ftype == 'Int')
                                        keys.push('$prop : Std.parseInt(imap.get(\'$field\'))');
                                        else 
                                        keys.push('$prop : untyped imap.get(\'$field\')');
                                    }
                                    else {

                                        if(Reflect.hasField(propx,'x-dto-assoc')){
                                            keys.push('$prop : untyped imap.get(\'$assoc\')');
                                        }
                                        else
                                            keys.push('$prop : i.$field');
                                    }
                                });                     
                                res.push(keys.join(',\r\t\t\t'));
                            }
                        }

                        res.push('\r\t\t};\r');
                        res.push('\t}\r\r');

                        res.push('\tpublic static function '+def.substring(0, 1).toLowerCase()+def.substring(1)+'ToDb$def( i : $def) :  DB__'+tbName+' {\r');
                        res.push('\t\treturn {\r\t\t\t');

                        if (Reflect.hasField(content, 'properties')) {
                                 

                            if (Reflect.hasField(content.properties, 'result')) {
                            }
                            else {

                                var props = Reflect.fields(content.properties);
                                var keys = [];
                                Lambda.map(props,function(prop) {
                                    var propx = Reflect.field(content.properties,prop);
                                    var field = Reflect.field(propx,'x-dto-field');
                                    var r : EReg = ~/\./;
                                    if(Reflect.hasField(propx,'x-dto-field')){
        					                if ( field.indexOf('.') == -1 )
                                                keys.push('$field : i.$prop');
                                    }
                                });                     
                                res.push(keys.join(',\r\t\t\t'));
                            }
                        }

                        res.push('\r\t\t};\r');
                        res.push('\t}\r\r');


                        res.push('}\r\r');
                    }
                    final.push(res.join(''));
                });


                Fs.writeFile(
                    outPath, 
                    new js.node.Buffer(final.join('')),
                    function(err) {
                    console.log('$outPath file saved!');
                    }
                );
            }
        }
        else 
            trace('missing one or more parameters ( usage : input=[yaml_filename] output=[haxe_filename] type=[typedef/routes]./yaml2hx.js ) ');
    }
}
