package com.cortex.ide.service;

import com.cortex.ide.model.FileNode;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

@Service
public class FileService {

    private static final Set<String> IGNORE = Set.of(
        "node_modules", ".git", "target", "build", "dist",
        "__pycache__", ".venv", ".idea", ".vscode", "coverage"
    );

    public FileNode getTree(String rootPath) throws IOException {
        Path root = Path.of(rootPath);
        FileNode rootNode = new FileNode(root.getFileName().toString(), rootPath, "directory");
        buildTree(root, rootNode, 0, 5);
        return rootNode;
    }

    private void buildTree(Path dir, FileNode node, int depth, int maxDepth) throws IOException {
        if (depth >= maxDepth) return;
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir)) {
            List<Path> entries = new ArrayList<>();
            stream.forEach(entries::add);
            entries.sort((a, b) -> {
                boolean aDir = Files.isDirectory(a);
                boolean bDir = Files.isDirectory(b);
                if (aDir != bDir) return aDir ? -1 : 1;
                return a.getFileName().toString().compareToIgnoreCase(b.getFileName().toString());
            });
            for (Path entry : entries) {
                String name = entry.getFileName().toString();
                if (name.startsWith(".") && !name.equals(".env")) continue;
                if (IGNORE.contains(name)) continue;
                
                if (Files.isDirectory(entry)) {
                    FileNode child = new FileNode(name, entry.toString(), "directory");
                    node.addChild(child);
                    buildTree(entry, child, depth + 1, maxDepth);
                } else {
                    node.addChild(new FileNode(name, entry.toString(), "file"));
                }
            }
        }
    }

    public String readFile(String path) throws IOException {
        return Files.readString(Path.of(path));
    }

    public void writeFile(String path, String content) throws IOException {
        Path p = Path.of(path);
        Files.createDirectories(p.getParent());
        Files.writeString(p, content);
    }

    public void createFile(String path) throws IOException {
        Path p = Path.of(path);
        Files.createDirectories(p.getParent());
        if (!Files.exists(p)) Files.createFile(p);
    }

    public void createDirectory(String path) throws IOException {
        Files.createDirectories(Path.of(path));
    }

    public void deleteFile(String path) throws IOException {
        Path p = Path.of(path);
        if (Files.isDirectory(p)) {
            try (Stream<Path> walk = Files.walk(p)) {
                walk.sorted(Comparator.reverseOrder()).forEach(f -> {
                    try { Files.delete(f); } catch (IOException e) { /* skip */ }
                });
            }
        } else {
            Files.deleteIfExists(p);
        }
    }

    public void renameFile(String oldPath, String newPath) throws IOException {
        Files.move(Path.of(oldPath), Path.of(newPath));
    }

    public String detectLanguage(String fileName) {
        if (fileName.endsWith(".java")) return "java";
        if (fileName.endsWith(".js")) return "javascript";
        if (fileName.endsWith(".jsx")) return "javascript";
        if (fileName.endsWith(".ts")) return "typescript";
        if (fileName.endsWith(".tsx")) return "typescript";
        if (fileName.endsWith(".py")) return "python";
        if (fileName.endsWith(".css")) return "css";
        if (fileName.endsWith(".html")) return "html";
        if (fileName.endsWith(".json")) return "json";
        if (fileName.endsWith(".xml")) return "xml";
        if (fileName.endsWith(".yml") || fileName.endsWith(".yaml")) return "yaml";
        if (fileName.endsWith(".md")) return "markdown";
        if (fileName.endsWith(".sh")) return "shell";
        if (fileName.endsWith(".sql")) return "sql";
        return "plaintext";
    }
}
