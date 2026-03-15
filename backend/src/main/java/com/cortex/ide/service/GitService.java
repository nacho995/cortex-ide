package com.cortex.ide.service;

import org.springframework.stereotype.Service;
import java.io.*;
import java.util.*;

@Service
public class GitService {

    public Map<String, Object> getStatus(String projectPath) throws IOException, InterruptedException {
        Map<String, Object> result = new HashMap<>();
        result.put("branch", runGit(projectPath, "rev-parse", "--abbrev-ref", "HEAD").trim());
        result.put("status", runGit(projectPath, "status", "--short"));
        result.put("log", getLog(projectPath, 10));
        return result;
    }

    public List<Map<String, String>> getLog(String projectPath, int n) throws IOException, InterruptedException {
        String output = runGit(projectPath, "log", "-" + n, "--pretty=format:%h|%s|%an|%cr");
        List<Map<String, String>> commits = new ArrayList<>();
        for (String line : output.split("\n")) {
            String[] parts = line.split("\\|", 4);
            if (parts.length == 4) {
                commits.add(Map.of("hash", parts[0], "message", parts[1], "author", parts[2], "time", parts[3]));
            }
        }
        return commits;
    }

    public String getDiff(String projectPath) throws IOException, InterruptedException {
        return runGit(projectPath, "diff");
    }

    public String commit(String projectPath, String message) throws IOException, InterruptedException {
        runGit(projectPath, "add", ".");
        return runGit(projectPath, "commit", "-m", message);
    }

    public String undo(String projectPath) throws IOException, InterruptedException {
        return runGit(projectPath, "reset", "--soft", "HEAD~1");
    }

    private String runGit(String projectPath, String... args) throws IOException, InterruptedException {
        List<String> cmd = new ArrayList<>();
        cmd.add("git");
        cmd.addAll(Arrays.asList(args));
        ProcessBuilder pb = new ProcessBuilder(cmd);
        pb.directory(new File(projectPath));
        pb.redirectErrorStream(true);
        Process p = pb.start();
        String output = new String(p.getInputStream().readAllBytes());
        p.waitFor();
        return output;
    }
}
