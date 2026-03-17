package com.cortex.ide.service;

import com.google.gson.JsonObject;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.*;
import java.io.IOException;

@Service
public class AiService {

    private static final String CORTEX_API = "https://cortex-ai.fly.dev";

    public String chat(String message, String projectPath, String provider, String model, String apiKey)
            throws IOException, InterruptedException {
        JsonObject payload = basePayload(provider, model, apiKey);
        payload.addProperty("message", message);
        payload.addProperty("project_path", projectPath);
        return callApi("/chat", payload.toString());
    }

    public String edit(String instruction, String projectPath, String provider, String model, String apiKey)
            throws IOException, InterruptedException {
        JsonObject payload = basePayload(provider, model, apiKey);
        payload.addProperty("instruction", instruction);
        payload.addProperty("project_path", projectPath);
        return callApi("/edit", payload.toString());
    }

    public String debate(String topic, String provider, String model, String apiKey)
            throws IOException, InterruptedException {
        JsonObject payload = basePayload(provider, model, apiKey);
        payload.addProperty("topic", topic);
        payload.addProperty("rounds", 2);
        return callApi("/debate", payload.toString());
    }

    public String review(String filePath, String content, String provider, String model, String apiKey)
            throws IOException, InterruptedException {
        JsonObject payload = basePayload(provider, model, apiKey);
        payload.addProperty("file_path", filePath);
        payload.addProperty("file_content", content);
        return callApi("/review", payload.toString());
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

    private JsonObject basePayload(String provider, String model, String apiKey) {
        JsonObject payload = new JsonObject();
        payload.addProperty("lang", "es");

        if (provider != null && !provider.isBlank()) {
            payload.addProperty("provider", provider);
        }
        if (model != null && !model.isBlank()) {
            payload.addProperty("model", model);
        }
        if (apiKey != null && !apiKey.isBlank()) {
            payload.addProperty("api_key", apiKey);
        }
        return payload;
    }
}
