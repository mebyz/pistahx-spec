#usage (build + generate)

input=[yaml_filename] output=[haxe_filename] ./run.sh

#build only

haxe -main Main -D nodejs -lib yaml -lib hxnodejs -js yaml2hx.js

# generate only 

input=[yaml_filename] output=[haxe_filename] node yaml2hx.js type=[typedef/routes]

Trollolol