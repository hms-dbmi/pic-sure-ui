# pic-sure-ui


Instructions to launch in dev mode:

Prerequisites: Maven 3+, Java, Docker and docker-compose

mvn clean install && docker-compose build && docker-compose up -d 

If you make source code changes, just save your changes and refresh your browser(may need to disable your browser's cache).

If you change webjar dependencies then you may need to rerun the above command line.

Then open your browser at http://<docker-machine-ip>


To build an image for release, run:

`docker build -t [<your docker repository>/]pic-sure-ui:<your tag> .`

To run test via Jasmin, run:

`mvn jasmine:bdd`








