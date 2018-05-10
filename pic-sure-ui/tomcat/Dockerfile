FROM tomcat:7-jre8

RUN rm -rf /usr/local/tomcat/webapps/*
COPY build/pic-sure-ui.war /usr/local/tomcat/webapps
RUN mv /usr/local/tomcat/webapps/pic-sure-ui.war /usr/local/tomcat/webapps/ROOT.war
COPY *.xml /usr/local/tomcat/conf/

EXPOSE 8080
