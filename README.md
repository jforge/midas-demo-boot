# Midas Spring Boot Client Demo

Prototype of a Spring Boot client for the picturesafe [Midas](http://midas.picturesafe.de) REST-API. This demo creates a Spring Boot powered Website with a AngulaJS GUI and performs simple Midas API calls.

## Requirements

### Build requirements

* JDK 1.7 or higher ([JDK download](http://www.oracle.com/technetwork/java/javase/downloads/index.html))
* Maven 3.0 or higher ([Maven download](https://maven.apache.org/download.cgi))

### API key

You will need an API key to access the picturesafe Midas REST-API. To use your personal API key with this demo project you have to save it to a file named `midas.properties` accessible through your classpath. The file contents must look like this:

```properties
midas.apikey=<your-api-key>
```

If you don't know how to include this file in your classpath, simply save it to `src/main/resources` in the project directory. If you don't have an API key yet please see _"Get Your API Key"_ in this document.

## Run demo application

After startup the demo is available at [localhost:8080](http://localhost:8080/)

```bash
mvn spring-boot:run
```

## Build executable JAR

```bash
mvn clean package
```

## Get Your API Key

Please use the picturesafe Midas [registration form](http://midas.picturesafe.de/customer-demo/registration/registerApiKey.xhtml) to request your personal API key.