package com.cortex.ide.controller;

import com.cortex.ide.model.FileNode;
import com.cortex.ide.service.FileService;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping("/tree")
    public FileNode getTree(@RequestParam String path) throws IOException {
        return fileService.getTree(path);
    }

    @GetMapping("/read")
    public Map<String, String> readFile(@RequestParam String path) throws IOException {
        String content = fileService.readFile(path);
        String language = fileService.detectLanguage(path);
        return Map.of("content", content, "language", language, "path", path);
    }

    @PostMapping("/write")
    public Map<String, String> writeFile(@RequestBody Map<String, String> body) throws IOException {
        fileService.writeFile(body.get("path"), body.get("content"));
        return Map.of("status", "ok");
    }

    @PostMapping("/create")
    public Map<String, String> createFile(@RequestBody Map<String, String> body) throws IOException {
        String path = body.get("path");
        String type = body.getOrDefault("type", "file");
        if ("directory".equals(type)) {
            fileService.createDirectory(path);
        } else {
            fileService.createFile(path);
        }
        return Map.of("status", "ok");
    }

    @DeleteMapping("/delete")
    public Map<String, String> deleteFile(@RequestParam String path) throws IOException {
        fileService.deleteFile(path);
        return Map.of("status", "ok");
    }

    @PostMapping("/rename")
    public Map<String, String> renameFile(@RequestBody Map<String, String> body) throws IOException {
        fileService.renameFile(body.get("oldPath"), body.get("newPath"));
        return Map.of("status", "ok");
    }
}
