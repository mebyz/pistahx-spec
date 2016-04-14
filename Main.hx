import js.Node;
import js.Node.*;
import js.node.Fs;

import yaml.Yaml;
import yaml.Parser;
import yaml.Renderer;
import yaml.util.ObjectMap;


// PARTIAL OPENAPI 
typedef ApiDefinition = {
    swagger: String,
    info: InfoObject,
    ?host: String,
    ?basePath: String,
    ?schemes: Array<String>,/*,
    ?consumes: MimeTypes,
    ?produces: MimeTypes,
    paths: PathsObject,*/
    definitions: Array<Map<String,Dynamic>>/*,
    ?parameters: ParametersDefinitionsObject,
    ?responses: ResponsesDefinitionsObject,
    ?securityDefinitions: SecurityDefinitionsObject,
    ?security: Array<SecurityRequirementObject>,
    ?tags: Array<TagObject>,
    ?externalDocs: ExternalDocumentationObject*/
}

typedef MimeTypes = Array<String>;

typedef InfoObject = {
    title: String,
    ?description: String,
    termsOfService: String,
   // ?contact: ContactObject,
   // ?license: LicenseObject,
    version: String
}


typedef DefinitionsObject = Array<Dynamic>; ////CHANGE HERE
// PARTIAL OPENAPI

class Main {
  static function main() {
    var dn = Node.__dirname;
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
