package com.cortex.ide.controller;

import com.cortex.ide.service.TerminalService;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/terminal")
public class TerminalController {

    private final TerminalService terminalService;

    public TerminalController(TerminalService terminalService) {
        this.terminalService = terminalService;
    }

    @PostMapping("/execute")
    public Map<String, String> execute(@RequestBody Map<String, String> body) throws IOException, InterruptedException {
        String cwd = body.get("cwd");
        if (cwd != null) terminalService.setWorkingDirectory(cwd);
        String output = terminalService.execute(body.get("command"));
        return Map.of("output", output);
    }

    @PostMapping("/kill")
    public Map<String, String> kill() {
        terminalService.killProcess();
        return Map.of("status", "killed");
    }
}
