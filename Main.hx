import js.node.Fs;
import yaml.Yaml;
import yaml.Parser;
import yaml.Renderer;
import yaml.util.ObjectMap;
import yaml.type.YInt;

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
        var specPath = './api.yaml';
        var yaml = Fs.readFileSync(specPath, 'utf8');
        var nativeObject : ApiDefinition = Yaml.parse(yaml, Parser.options().useObjects());

        var defs = nativeObject.definitions;
        var defsx = Reflect.fields(defs);
        var res = [];
        Lambda.map(defsx,function(def) {
            res.push(' typedef $def = ');
            var content = Reflect.field(defs,def);
            
            if (Reflect.hasField(content.properties, 'result')){
                res.push('Array<' + Reflect.field(content.properties.result.items,"$ref").replace('#/definitions/','')+'>;');
            }
            else {

                res.push('{');

                var props = Reflect.fields(content.properties);
                var keys = [];
                Lambda.map(props,function(prop) {
                    var propx = Reflect.field(content.properties,prop);
                    var type = getType(propx);
                    keys.push('$prop : $type');
                }); 

                res.push(keys.toString());

                res.push("}; ");
            }           
        });
        trace(res.join(''));
    }
}
