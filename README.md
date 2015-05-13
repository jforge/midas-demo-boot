# Spring Boot Midas client

Prototype of a Spring Boot client for the picturesafe [Midas](http://midas.picturesafe.de) REST-API. 

## Requirements

### Build requirements

* JDK 1.7 or higher ([JDK download](http://www.oracle.com/technetwork/java/javase/downloads/index.html))
* Maven 3.0 or higher ([Maven download](https://maven.apache.org/download.cgi))

### API key

You will need an API key to access the picturesafe Midas REST-API. To use your personal API key with this demo project you have to save it to a 
`midas.properties` file in your classpath. The file entry must look like this:

```properties
midas.apikey=<your-api-key>
```

If you don't know how to include this file in your classpath, simply save it to `src/main/resources` in the project directory.
If you don't have an API key yet please see _"Get an API key"_ in this document.

## Run demo application

```bash
mvn spring-boot:run
```

## Build executable JAR

```bash
mvn clean package
```

## Get an API key

Please use the picturesafe Midas [registration form](http://midas.picturesafe.de/customer-demo/registration/register.xhtml) to request your personal API key.