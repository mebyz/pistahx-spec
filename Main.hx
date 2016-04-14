import js.node.Fs;
import yaml.Yaml;
import yaml.Parser;
import yaml.Renderer;
import yaml.util.ObjectMap;
import yaml.type.YInt;
import js.Node;
import js.Node.*;

// PARTIAL OPENAPI START
typedef ApiDefinition = {
    swagger: String,
    info: InfoObject,
    ?host: String,
    ?basePath: String,
    ?schemes: Array<String>,
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



class Main {

   static public function getType(expr : Dynamic) : String{
        // TODO : find a way to type match with hx-yaml types (ie : YInt) ??
        var type = expr.type;            
        return switch (type) {
            case 'string'   : 'String';
            case 'integer'  : 'Int';
            case _          : 'String';
        }
    }

    static function main() {

        if(process.env.exists("input") && process.env.exists("output")) {
        
            var specPath    = process.env.get("input");
            var outPath     = process.env.get("output");

            var yaml = Fs.readFileSync(specPath, 'utf8');
            var nativeObject : ApiDefinition = Yaml.parse(yaml, Parser.options().useObjects());

            var defs = nativeObject.definitions;
            var defsx = Reflect.fields(defs);
            var final = [];
            Lambda.map(defsx,function(def) {
                var res = [];
                res.push('typedef $def = ');
                var content = Reflect.field(defs, def);
                

                if (Reflect.hasField(content, 'properties')) {
                         

                    if (Reflect.hasField(content.properties, 'result')) {
                        res.push('List<' + Reflect.field(content.properties.result.items,"$ref").replace('#/definitions/','')+'>;\r');
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

                        res.push("\r\t\t};\r");
                    
                    }
                }
                else {
                    var type = getType(content);
                    res.push('$type;\r');
                }
                
                final.push(res.join(''));

            });


            Fs.writeFile(
                outPath, 
                new js.node.Buffer(final.join('\r')),
                function(err) {
                console.log('$outPath file saved!');
                }
            );
        }
        else 
            trace('missing one or more parameters ( usage : input=[yaml_filename] output=[haxe_filename] ./run.sh ) ');
    }
}
