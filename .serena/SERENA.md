# Serena Integration Guide

## 📋 Overview

This project is configured to use **Serena**, a powerful MCP (Model Context Protocol) server that enhances GitHub Copilot with advanced code understanding, semantic search, and intelligent refactoring capabilities.

## 🚀 Getting Started

### 1. Install uv (Package Manager)
Serena requires `uv`. If not installed:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. VS Code Configuration
The project already has `.vscode/settings.json` configured to automatically start the Serena MCP server.

When you open this project in VS Code, Copilot will automatically:
- Initialize Serena MCP server
- Connect to your language servers
- Enable semantic code analysis

### 3. Using Serena with Copilot

Once connected, you can use Copilot with enhanced capabilities:

#### **Symbol Search & Navigation**
```
@symbol <name>  - Find symbols in the codebase
@file <path>    - Reference specific files
```

#### **Code Refactoring**
```
/refactor - AI-powered refactoring suggestions
/analyze  - Deep code analysis
```

#### **Semantic Understanding**
- Find all usages of a symbol
- Understand dependencies
- Navigate through related code
- Get intelligent completions based on context

## 🔧 Project Configuration

- **Language**: TypeScript/JavaScript
- **Framework**: Next.js 16
- **Backend**: Language Server Protocol (LSP)
- **Supported Tools**: Symbol search, code editing, refactoring, memory system

## 📁 Serena Configuration Files

- `.serena/config.yaml` - Main Serena configuration
- `.vscode/settings.json` - VS Code MCP integration

## 🎯 Best Practices

1. **Keep Copilot Chat Open** - Serena works best when you're actively using Copilot
2. **Use Symbol References** - Ask Copilot to find symbols and their usages
3. **Leverage Project Context** - Serena understands your Next.js structure
4. **Enable Memory** - Serena can remember conversation context across sessions

## 📖 Documentation

For more information, visit:
- [Serena Official Docs](https://oraios.github.io/serena)
- [GitHub Repository](https://github.com/oraios/serena)
- [MCP Protocol](https://modelcontextprotocol.io)

## ⚙️ Troubleshooting

### Serena not connecting?
1. Verify `uv` is installed: `which uvx`
2. Check `.vscode/settings.json` is configured
3. Restart VS Code
4. Check Copilot output panel for errors

### Language server issues?
- Ensure TypeScript language server is available
- Check project has proper `tsconfig.json`
- Verify source files are in `src/` directory

## 🔗 Integration with Other Tools

Serena works alongside:
- ✅ ESLint
- ✅ Prettier
- ✅ TypeScript
- ✅ Poku (testing)

All tools are configured to work together harmoniously.
