package de.picturesafe.midas.demo.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.support.HttpRequestWrapper;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.HiddenHttpMethodFilter;

import java.io.IOException;
import java.util.Collections;
import javax.servlet.Filter;

@SpringBootApplication
@Configuration
@Import(DemoController.class)
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    public Filter hiddenHttpMethodFilter() {
        return new HiddenHttpMethodFilter();
    }

    @Bean
    public RestTemplate midasTemplate() {
        //final HttpHost httpHost = new HttpHost("midas.picturesafe.de", 80, "http");
        final RestTemplate restTemplate = new RestTemplate();
        restTemplate.setInterceptors(Collections.<ClientHttpRequestInterceptor>singletonList(new ClientHttpRequestInterceptor() {
            @Override
            public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
                final HttpRequest wrapper = new HttpRequestWrapper(request);
                wrapper.getHeaders().set("apikey", "uRJk9RQXpfa2no5miyJVwDknnduGr9Ey");
                return execution.execute(wrapper, body);
            }
        }));
        return restTemplate;
        /*return new RestTemplate(new HttpComponentsClientHttpRequestFactory() {
            @Override
            protected HttpContext createHttpContext(HttpMethod httpMethod, URI uri) {
                final AuthCache authCache = new BasicAuthCache();
                final BasicScheme basicScheme = new BasicScheme();
                authCache.put(httpHost, basicScheme);

                final HttpClientContext localContext = HttpClientContext.create();
                localContext.setAuthCache(authCache);

                final BasicCredentialsProvider provider = new BasicCredentialsProvider();
                provider.setCredentials(new AuthScope(httpHost), new UsernamePasswordCredentials("apikey", "uRJk9RQXpfa2no5miyJVwDknnduGr9Ey"));
                localContext.setCredentialsProvider(provider);

                return localContext;
            }
        });*/
    }
}
