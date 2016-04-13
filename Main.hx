import js.Node;
import js.Node.*;
import js.node.Fs;

import yaml.Yaml;
import yaml.Parser;
import yaml.Renderer;
import yaml.util.ObjectMap;


//OPENAPI 
typedef ApiDefinition = {
    swagger: String,
    info: InfoObject,
    ?host: String,
    ?basePath: String,
    ?schemes: Array<String>/*,
    ?consumes: MimeTypes,
    ?produces: MimeTypes,
    paths: PathsObject,
    ?definitions: DefinitionsObject,
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

//OPENAPI

class Main {
  static function main() {
    var dn = Node.__dirname;
    var specPath = './api.yaml';
    var yaml = Fs.readFileSync(specPath, 'utf8');
    var nativeObject : ApiDefinition = Yaml.parse(yaml, Parser.options().useObjects());
  
    var k1=Type.getClassName(Type.getClass(nativeObject.swagger));
    trace('yaml key swagger is a $k1 :');
    trace(nativeObject.swagger);

    var k2=Type.getClassName(Type.getClass(Reflect.field(nativeObject.info,'x-testfloatval')));
    trace('yaml key info is a $k2');
    trace(Reflect.field(nativeObject.info,'x-testfloatval'));

    var k3=Type.getClassName(Type.getClass(nativeObject.info.title));
    trace('yaml key info.title is a $k3');
    trace(nativeObject.info.title);
  }
}
