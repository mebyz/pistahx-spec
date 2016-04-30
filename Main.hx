import js.node.Fs;
import yaml.Yaml;
import yaml.Parser;
import yaml.Renderer;
import yaml.util.ObjectMap;
import yaml.type.YInt;
import js.Node;
import js.Node.*;
import haxe.ds.*;

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

/*
export interface ApiDefinition {
    swagger: string
    info: InfoObject
    host?: string
    basePath?: string
    schemes?: string[]
    consumes?: MimeTypes
    produces?: MimeTypes
    paths: PathsObject
    definitions?: DefinitionsObject
    parameters?: ParametersDefinitionsObject
    responses?: ResponsesDefinitionsObject
    securityDefinitions?: SecurityDefinitionsObject
    security?: SecurityRequirementObject[]
    tags?: TagObject[]
    externalDocs?: ExternalDocumentationObject
}

type MimeTypes = string[]

export interface InfoObject {
    title: string
    description?: string
    termsOfService?: string
    contact?: ContactObject
    license?: LicenseObject
    version: string
}

export interface ContactObject {
    name?: string
    url?: string
    email?: string
}

export interface LicenseObject {
    name: string
    url?: string
}
*/

class Main {

   static public function getType(expr : Dynamic) : String{
        // TODO : find a way to type match with hx-yaml types (ie : YInt) ??
        var type = expr.type;     
        var format = expr.format;         
        return switch (type) {
            case 'string'   : switch (format) {
                case 'date': 'Date';
                case _: 'String';
            };
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

        if(process.env.exists("input") && process.env.exists("output")) {
        
            var specPath    = process.env.get("input");
            var outPath     = process.env.get("output");

            var yaml = Fs.readFileSync(specPath, 'utf8');
            var nativeObject = Yaml.parse(yaml, Parser.options().useObjects());


            //safeParse(yaml);


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
                    
                    res.push('\tpublic static function map'+def+'s( i : Array<DB__$tbName> , f : $def -> $def) : '+def+'s {\r');
                    res.push('\t\treturn Lambda.map(i, function (j : DB__$tbName) : $def {\r');
                    res.push('\t\t\treturn map$def(j,f);\r');
                    res.push('\t\t});\r');
                    res.push('\t}\r\r');

                    res.push('\tpublic static function map$def( i : DB__$tbName , f : $def -> $def) : $def {\r');
                    res.push('\t\tvar imap = new thx.AnonymousMap(i);\r\t\t');
                    res.push('\t\treturn f({\r\t\t\t');

                    if (Reflect.hasField(content, 'properties')) {
                             

                        if (Reflect.hasField(content.properties, 'result')) {
                        }
                        else {

                            var props = Reflect.fields(content.properties);
                            var keys = [];
                            Lambda.map(props,function(prop) {
                                var propx = Reflect.field(content.properties,prop);
                                var field = Reflect.field(propx,'x-dto-field');
				var ftype = Reflect.field(propx,'x-dto-field-type');
                                 var r : EReg = ~/\./;
                                if(r.match(field)){
                                    if (ftype == 'Int')
					keys.push('$prop : Std.parseInt(imap.get(\'$field\'))');
				    else 
					keys.push('$prop : imap.get(\'$field\')');
				}
                                else
                                    keys.push('$prop : i.$field');
                            });                     
                            res.push(keys.join(',\r\t\t\t'));
                        }
                    }

                    res.push('\r\t\t});\r');
                    res.push('\t}\r\r');

                    res.push('\tpublic static function mapDB$def( i : $def) :  DB__'+tbName+' {\r');
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
                                    keys.push('$field : i.$prop');
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
        else 
            trace('missing one or more parameters ( usage : input=[yaml_filename] output=[haxe_filename] ./run.sh ) ');
    }
}
