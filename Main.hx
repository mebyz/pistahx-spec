import js.node.Fs;
import yaml.Yaml;
import yaml.Parser;
import yaml.Renderer;
import yaml.util.ObjectMap;

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
  static function main() {
    var specPath = './api.yaml';
    var yaml = Fs.readFileSync(specPath, 'utf8');
    var nativeObject : ApiDefinition = Yaml.parse(yaml, Parser.options().useObjects());
  
    var defs = nativeObject.definitions;
    var defsx = Reflect.fields(defs);

    Lambda.map(defsx,function(def) {
        var res = 'typedef $def = ';
        var content = Reflect.field(defs,def);
        
        if (Reflect.hasField(content.properties, 'result')){
            res += 'Array<' + Reflect.field(content.properties.result.items,"$ref").replace('#/definitions/','')+'>;';
        }
        else {

         res += '{';
         ////

         ////
         res += '};';
        }           
        trace(res);
    });


  }
}
