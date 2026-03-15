package com.cortex.ide.model;

import java.util.List;
import java.util.ArrayList;

public class FileNode {
    private String name;
    private String path;
    private String type; // "file" or "directory"
    private List<FileNode> children;
    private String extension;

    public FileNode(String name, String path, String type) {
        this.name = name;
        this.path = path;
        this.type = type;
        this.children = new ArrayList<>();
        if (type.equals("file") && name.contains(".")) {
            this.extension = name.substring(name.lastIndexOf(".") + 1);
        }
    }

    public String getName() { return name; }
    public String getPath() { return path; }
    public String getType() { return type; }
    public List<FileNode> getChildren() { return children; }
    public String getExtension() { return extension; }
    public void addChild(FileNode child) { children.add(child); }
}
