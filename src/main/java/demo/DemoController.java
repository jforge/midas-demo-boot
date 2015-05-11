package demo;

import de.picturesafe.midas.model.textmining.AnalyzeRequest;
import de.picturesafe.midas.model.textmining.category.Category;
import de.picturesafe.midas.model.textmining.category.CategoryResult;
import de.picturesafe.midas.model.textmining.entity.Entity;
import de.picturesafe.midas.model.textmining.entity.EntityResult;
import de.picturesafe.midas.model.textmining.entity.KeywordResult;

import org.apache.commons.lang.StringUtils;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.annotation.Resource;

@RestController
public class DemoController {
    @Resource
    private RestTemplate midasTemplate;

    @RequestMapping(value = "/analyse", method = RequestMethod.POST)
    public TextAnalysis analyse(@RequestBody Text text) {
        final TextAnalysis textAnalysis = new TextAnalysis();
        textAnalysis.setText(text.getText());

        populateCategories(text, textAnalysis);
        populateLocations(text, textAnalysis);
        populateKeywords(text, textAnalysis);

        return textAnalysis;
    }

    private void populateCategories(Text text, TextAnalysis textAnalysis) {
        final AnalyzeRequest analyzeRequest = new AnalyzeRequest(text.getText());
        final CategoryResult categoryResult
                = midasTemplate.postForObject("http://midas.picturesafe.de/rest-service/rest/textmining/category", analyzeRequest, CategoryResult.class);

        if (!CollectionUtils.isEmpty(categoryResult.getCategories())) {
            final Category category = categoryResult.getCategories().iterator().next();
            textAnalysis.setCategories(Arrays.asList(StringUtils.split(category.getName(), '|')));
        }
    }

    private void populateLocations(Text text, TextAnalysis textAnalysis) {
        final AnalyzeRequest analyzeRequest = new AnalyzeRequest(text.getText());
        final EntityResult entityResult
                = midasTemplate.postForObject("http://midas.picturesafe.de/rest-service/rest/textmining/entity/locations", analyzeRequest, EntityResult.class);

        if (!CollectionUtils.isEmpty(entityResult.getEntities())) {
            final List<String> locations = new ArrayList<>(entityResult.getEntities().size());
            for (final Entity entity : entityResult.getEntities()) {
                locations.add(entity.getLabel());
            }
            textAnalysis.setLocations(locations);
        }
    }

    private void populateKeywords(Text text, TextAnalysis textAnalysis) {
        final AnalyzeRequest analyzeRequest = new AnalyzeRequest(text.getText());
        final KeywordResult keywordResult
                = midasTemplate.postForObject("http://midas.picturesafe.de/rest-service/rest/textmining/keyword", analyzeRequest, KeywordResult.class);

        if (!CollectionUtils.isEmpty(keywordResult.getKeywords())) {
            final List<String> keywords = new ArrayList<>(keywordResult.getKeywords().size());
            for (final Entity entity : keywordResult.getKeywords()) {
                keywords.add(entity.getLabel());
            }
            textAnalysis.setKeywords(keywords);
        }
    }
}
