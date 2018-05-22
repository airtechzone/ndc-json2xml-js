# json2xml (Node.js)

This Node.js tool converts NDC JSON messages into XML equivalents.

It uses the "sequences-*.json" supporting files in order to output valid NDC messages (with properly ordered sequences). This file is stored in the Sequences folder: the correct NDC version should be chosen for the input message version.

**Known limitation:** this tool is limited to a tree depth of 50 levels due to the presence of some recursive structures that can be found in 17.1/17.2, for example.

Dependency: request (NPM).
