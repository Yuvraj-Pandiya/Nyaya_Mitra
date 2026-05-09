package com.nyayamitra.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nyayamitra.entity.*;
import com.nyayamitra.repository.LawyerRepository;
import com.nyayamitra.repository.SituationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * DataInitializer — seeds MongoDB data into PostgreSQL on startup if empty.
 * Parses data/situations.json and data/lawyers.json, mapping nested JSON to flat entities.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final SituationRepository situationRepository;
    private final LawyerRepository lawyerRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        log.info("Checking if database needs seeding...");

        try {
            if (situationRepository.count() == 0) {
                log.info("No situations found. Seeding from situations.json...");
                InputStream inputStream = new ClassPathResource("data/situations.json").getInputStream();
                JsonNode root = objectMapper.readTree(inputStream);
                
                List<Situation> situations = new ArrayList<>();
                for (JsonNode node : root) {
                    Situation situation = new Situation();
                    situation.setSituationId(node.get("id").asText());
                    situation.setCategory(node.get("category").asText());
                    situation.setIcon(node.path("icon").asText(null));
                    
                    if (node.has("title")) {
                        situation.setTitleEn(node.get("title").path("en").asText(null));
                        situation.setTitleHi(node.get("title").path("hi").asText(null));
                    }
                    if (node.has("description")) {
                        situation.setDescriptionEn(node.get("description").path("en").asText(null));
                        situation.setDescriptionHi(node.get("description").path("hi").asText(null));
                    }
                    if (node.has("templateType")) {
                        String type = node.get("templateType").asText();
                        situation.setTemplateType(Situation.TemplateType.valueOf(type));
                    }

                    // Parse Rights
                    if (node.has("rights") && node.get("rights").isArray()) {
                        for (JsonNode rNode : node.get("rights")) {
                            SituationRight right = new SituationRight();
                            right.setSituation(situation);
                            if (rNode.has("title")) {
                                right.setTitleEn(rNode.get("title").path("en").asText(null));
                                right.setTitleHi(rNode.get("title").path("hi").asText(null));
                            }
                            if (rNode.has("description")) {
                                right.setDescriptionEn(rNode.get("description").path("en").asText(null));
                                right.setDescriptionHi(rNode.get("description").path("hi").asText(null));
                            }
                            situation.getRights().add(right);
                        }
                    }

                    // Parse Laws
                    if (node.has("laws") && node.get("laws").isArray()) {
                        for (JsonNode lNode : node.get("laws")) {
                            LawSection law = new LawSection();
                            law.setSituation(situation);
                            law.setSection(lNode.path("section").asText(null));
                            law.setAct(lNode.path("act").asText(null));
                            law.setFullText(lNode.path("fullText").asText(null));
                            if (lNode.has("summary")) {
                                law.setSummaryEn(lNode.get("summary").path("en").asText(null));
                                law.setSummaryHi(lNode.get("summary").path("hi").asText(null));
                            }
                            situation.getLaws().add(law);
                        }
                    }

                    // Parse Checklist
                    if (node.has("checklist") && node.get("checklist").isArray()) {
                        for (JsonNode cNode : node.get("checklist")) {
                            ChecklistItem item = new ChecklistItem();
                            item.setSituation(situation);
                            item.setChecklistId(cNode.path("id").asText(null));
                            item.setRequired(cNode.path("required").asBoolean(false));
                            if (cNode.has("item")) {
                                item.setItemEn(cNode.get("item").path("en").asText(null));
                                item.setItemHi(cNode.get("item").path("hi").asText(null));
                            }
                            situation.getChecklist().add(item);
                        }
                    }

                    // Parse Steps
                    if (node.has("steps") && node.get("steps").isArray()) {
                        for (JsonNode sNode : node.get("steps")) {
                            ProcedureStep step = new ProcedureStep();
                            step.setSituation(situation);
                            step.setStepNumber(sNode.path("stepNumber").asInt(0));
                            if (sNode.has("title")) {
                                step.setTitleEn(sNode.get("title").path("en").asText(null));
                                step.setTitleHi(sNode.get("title").path("hi").asText(null));
                            }
                            if (sNode.has("description")) {
                                step.setDescriptionEn(sNode.get("description").path("en").asText(null));
                                step.setDescriptionHi(sNode.get("description").path("hi").asText(null));
                            }
                            if (sNode.has("tip")) {
                                step.setTipEn(sNode.get("tip").path("en").asText(null));
                                step.setTipHi(sNode.get("tip").path("hi").asText(null));
                            }
                            situation.getSteps().add(step);
                        }
                    }

                    situations.add(situation);
                }
                
                situationRepository.saveAll(situations);
                log.info("Successfully seeded {} situations.", situations.size());
            } else {
                log.info("Situations already seeded.");
            }

            if (lawyerRepository.count() == 0) {
                log.info("No lawyers found. Seeding from lawyers.json...");
                InputStream inputStream = new ClassPathResource("data/lawyers.json").getInputStream();
                List<Lawyer> lawyers = objectMapper.readValue(inputStream, new TypeReference<>() {});
                lawyerRepository.saveAll(lawyers);
                log.info("Successfully seeded {} lawyers.", lawyers.size());
            } else {
                log.info("Lawyers already seeded.");
            }
        } catch (Exception e) {
            log.error("Failed to seed data: ", e);
        }
    }
}
