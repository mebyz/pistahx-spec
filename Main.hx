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
//typedef ApiDefinition={_keys:Array<Dynamic>, values:Array<Dynamic> };
//typedef ApiDefinition2={_keys:Array<Dynamic>, values:Array<Dynamic> ,d:Int};

typedef ApiDefinitionRootKeys = {
    swagger: String,
    info: InfoObject,
    host: String,
    basePath: String,
    schemes: Array<String>,
    definitions: Array<Map<String,Dynamic>>
}

typedef MimeTypes = Array<String>;

typedef InfoObject = {
    title: String,
    ?description: String,
    termsOfService: String,
    version: String
}

//// !TODO : CHANGE DYNAMIC HERE
typedef DefinitionsObject = Array<Dynamic>; 
// PARTIAL OPENAPI END


enum Spec {
    None;
    ApiDefinition(_keys:Array<Dynamic>, values:Array<Dynamic>);
}

class Main {

   static public function getType(expr : Dynamic) : String{
        // TODO : find a way to type match with hx-yaml types (ie : YInt) ??
        var type = expr.type;            
        return switch (type) {
            case 'string'   : 'String';
            case 'integer'  : 'Int';
            case 'boolean'  : 'Bool';
            case _          : 'String';
        }
    }

     static public function safeParse(yaml : String) {

       var spec = safeParseTry(Yaml.parse(yaml));

       switch(spec) {
            case ApiDefinition(keys,values) : trace('ok spec');
            case None : trace('wrong spec');
        }
       
            
    }

     static public function safeParseTry(yaml : Dynamic) : Spec{
        if (Reflect.hasField(yaml,'_keys') && Reflect.hasField(yaml,'values')) {
            Lambda.mapi(yaml._keys,function(i,key){
                    if (!Reflect.hasField(yaml.values[i],'_keys')) {
                        trace(key);
                        trace(yaml.values[i]);
                    }
                    else {
                        trace(key);
                        safeParseTry({_keys:yaml.values[i]._keys,values:yaml.values[i].values});
                    }
                });
            return ApiDefinition(yaml._keys,yaml.values);   
        }

        return None;         
    }

    static function main() {

        if(process.env.exists("input") && process.env.exists("output")) {
        
            var specPath    = process.env.get("input");
            var outPath     = process.env.get("output");

            var yaml = Fs.readFileSync(specPath, 'utf8');
            var nativeObject = Yaml.parse(yaml, Parser.options().useObjects());


            safeParse(yaml);


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
                    res.push('\t\tvar imap = new thx.AnonymousMap(i);');
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
                                 var r : EReg = ~/\./;
                                if(r.match(field))
                                    keys.push('$prop : imap.get(\'$field\')');
                                else
                                    keys.push('$prop : i.$field');
                            });                     
                            res.push(keys.join(',\r\t\t\t'));
                        }
                    }

                    res.push('\r\t\t});\r');
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
