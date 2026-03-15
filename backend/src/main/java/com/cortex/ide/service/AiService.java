package com.cortex.ide.service;

import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.*;
import java.io.IOException;

@Service
public class AiService {

    private static final String CORTEX_API = "https://cortex-ai.fly.dev";

    public String chat(String message, String projectPath) throws IOException, InterruptedException {
        return callApi("/chat", String.format(
            "{\"message\": %s, \"lang\": \"es\"}", 
            com.google.gson.JsonParser.parseString(message)
        ));
    }

    public String edit(String instruction, String projectPath) throws IOException, InterruptedException {
        return callApi("/edit", String.format(
            "{\"instruction\": %s, \"project_path\": %s, \"lang\": \"es\"}",
            com.google.gson.JsonParser.parseString(instruction),
            com.google.gson.JsonParser.parseString(projectPath)
        ));
    }

    public String debate(String topic) throws IOException, InterruptedException {
        return callApi("/debate", String.format(
            "{\"topic\": %s, \"lang\": \"es\", \"rounds\": 2}",
            com.google.gson.JsonParser.parseString(topic)
        ));
    }

    public String review(String filePath, String content) throws IOException, InterruptedException {
        return callApi("/review", String.format(
            "{\"file_path\": %s, \"file_content\": %s, \"lang\": \"es\"}",
            com.google.gson.JsonParser.parseString(filePath),
            com.google.gson.JsonParser.parseString(content)
        ));
    }

    private String callApi(String endpoint, String body) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(CORTEX_API + endpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
}
