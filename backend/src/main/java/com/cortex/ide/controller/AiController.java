package com.cortex.ide.controller;

import com.cortex.ide.service.AiService;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> body) throws IOException, InterruptedException {
        return aiService.chat(
            body.get("message"),
            body.get("projectPath"),
            body.get("provider"),
            body.get("model"),
            body.get("apiKey")
        );
    }

    @PostMapping("/edit")
    public String edit(@RequestBody Map<String, String> body) throws IOException, InterruptedException {
        return aiService.edit(
            body.get("instruction"),
            body.get("projectPath"),
            body.get("provider"),
            body.get("model"),
            body.get("apiKey")
        );
    }

    @PostMapping("/debate")
    public String debate(@RequestBody Map<String, String> body) throws IOException, InterruptedException {
        return aiService.debate(
            body.get("topic"),
            body.get("provider"),
            body.get("model"),
            body.get("apiKey")
        );
    }

    @PostMapping("/review")
    public String review(@RequestBody Map<String, String> body) throws IOException, InterruptedException {
        return aiService.review(
            body.get("filePath"),
            body.get("content"),
            body.get("provider"),
            body.get("model"),
            body.get("apiKey")
        );
    }
}
