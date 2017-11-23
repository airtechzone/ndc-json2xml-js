# json2xml

This tools outputs a XML version of the input JSON file.

It uses the "sequences-*.json" supporting files in order to place output valid NDC messages (properly ordered sequences). This file is stored in the Sequences folder: the correct NDC version should be chosen for the message version being inputted.

**Known limitation:** this tool is limited to a tree depth of 50 levels due to the presence of some recursive structures that can be found in 17.1/17.2, for example.

Dependency: request (NPM).
