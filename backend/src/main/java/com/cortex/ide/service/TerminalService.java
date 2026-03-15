package com.cortex.ide.service;

import org.springframework.stereotype.Service;
import java.io.*;
import java.util.concurrent.*;

@Service
public class TerminalService {

    private Process currentProcess;
    private String workingDirectory;

    public void setWorkingDirectory(String dir) {
        this.workingDirectory = dir;
    }

    public String execute(String command) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("bash", "-c", command);
        if (workingDirectory != null) pb.directory(new File(workingDirectory));
        pb.redirectErrorStream(true);
        
        Process process = pb.start();
        this.currentProcess = process;
        
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        
        boolean finished = process.waitFor(120, TimeUnit.SECONDS);
        if (!finished) {
            process.destroyForcibly();
            output.append("\n[TIMEOUT: Command killed after 120s]");
        }
        
        return output.toString();
    }

    public void killProcess() {
        if (currentProcess != null && currentProcess.isAlive()) {
            currentProcess.destroyForcibly();
        }
    }
}
