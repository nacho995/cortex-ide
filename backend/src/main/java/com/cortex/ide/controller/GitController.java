package com.cortex.ide.controller;

import com.cortex.ide.service.GitService;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/git")
public class GitController {

    private final GitService gitService;

    public GitController(GitService gitService) {
        this.gitService = gitService;
    }

    @GetMapping("/status")
    public Map<String, Object> getStatus(@RequestParam String path) throws IOException, InterruptedException {
        return gitService.getStatus(path);
    }

    @GetMapping("/diff")
    public Map<String, String> getDiff(@RequestParam String path) throws IOException, InterruptedException {
        return Map.of("diff", gitService.getDiff(path));
    }

    @PostMapping("/commit")
    public Map<String, String> commit(@RequestBody Map<String, String> body) throws IOException, InterruptedException {
        String result = gitService.commit(body.get("path"), body.get("message"));
        return Map.of("result", result);
    }

    @PostMapping("/undo")
    public Map<String, String> undo(@RequestBody Map<String, String> body) throws IOException, InterruptedException {
        String result = gitService.undo(body.get("path"));
        return Map.of("result", result);
    }
}
