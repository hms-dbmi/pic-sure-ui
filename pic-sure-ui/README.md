# pic-sure-ui


Instructions to launch in dev mode:

Prerequisites: Maven 3+, Java, Docker and docker-compose

`mvn clean install && docker-compose build && docker-compose up -d `

If you make source code changes, just save your changes and refresh your browser(may need to disable your browser's cache).

If you change webjar dependencies then you may need to rerun the above command line.

Then open your browser at `http://<docker-machine-ip>`

After successfully testing locally, to build the docker image, you can use the below shell command sequence:

```
GIT_BRANCH=`git branch | grep \* | cut -d " " -f 2`
GIT_COMMIT=`git log | head -1 | cut -d " " -f 2 | cut -c 1-8`

docker build --tag <your docker repository>/pic-sure-ui:${GIT_BRANCH}.${GIT_COMMIT} .
docker push <your docker repository>/pic-sure-ui:${GIT_BRANCH}.${GIT_COMMIT}

```


To build an image for release, run:

`docker build -t [<your docker repository>/]pic-sure-ui:<your tag> .`

To run test via Jasmin, run:

`mvn jasmine:bdd`







