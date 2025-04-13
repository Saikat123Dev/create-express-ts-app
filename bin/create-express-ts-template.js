#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const util = require('util');
const cp = require('child_process');
const exec = util.promisify(cp.exec);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Define colors for console output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    red: "\x1b[31m"
};

// ASCII art for the welcome message
console.log(`${colors.cyan}
╭━━━╮╱╱╱╱╱╱╱╱╱╱╱╭╮╱╱╱╭━━━━╮╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭╮
┃╭━╮┃╱╱╱╱╱╱╱╱╱╱╱┃┃╱╱╱┃╭╮╭╮┃╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱┃┃
┃╰━━┳━━┳━━┳━━┳━━┫┃╭━━╫┃┃┃┣┻━┳━━┳━╮╭━━┳━━┳━╯┃
╰━━╮┃┃━┫╭╮┃╭╮┃┃━┫┃┃╭╮┃┃┃┃┃╭╮┃┃━┫╭╮┫┃━┫╭╮┃╭╮┃
┃╰━╯┃┃━┫╰╯┃╰╯┃┃━┫╰┫╭╮┃┃┃┃┃╰╯┃┃━┫┃┃┃┃━┫╰╯┃╰╯┃
╰━━━┻━━┫╭━┫╭━┻━━┻━┻╯╰┻╯╰╯╰━━┻━━┻╯╰┻━━┻━━┻━━╯
╱╱╱╱╱╱╱┃┃╱┃┃
╱╱╱╱╱╱╱╰╯╱╰╯
${colors.reset}`);

console.log(`${colors.blue}Create a new Express TypeScript project with best practices${colors.reset}`);
console.log('-------------------------------------------------------------\n');

const questions = [
    {
        name: 'projectName',
        message: 'Project name:',
        default: 'express-typescript-app'
    },
    {
        name: 'description',
        message: 'Project description:',
        default: 'Express TypeScript API with best practices'
    },
    {
        name: 'author',
        message: 'Author:',
        default: ''
    },
    {
        name: 'enableMongoDB',
        message: 'Enable MongoDB? (y/n):',
        default: 'y'
    },
    {
        name: 'enableSwagger',
        message: 'Enable Swagger documentation? (y/n):',
        default: 'y'
    },
    {
        name: 'enableDocker',
        message: 'Generate Docker files? (y/n):',
        default: 'y'
    }
];

// Function to prompt questions sequentially
async function askQuestions() {
    const answers = {};

    for (const question of questions) {
        const answer = await new Promise(resolve => {
            rl.question(`${colors.yellow}? ${question.message}${colors.reset} (${question.default}) `, (input) => {
                resolve(input || question.default);
            });
        });

        answers[question.name] = answer;
    }

    return answers;
}

// Function to copy template files recursively
function copyTemplateFiles(templateDir, targetDir, variables) {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Read all files in the template directory
    const files = fs.readdirSync(templateDir);

    for (const file of files) {
        const sourcePath = path.join(templateDir, file);
        const destPath = path.join(targetDir, file);

        const stats = fs.statSync(sourcePath);

        if (stats.isDirectory()) {
            // Recursively copy directories
            copyTemplateFiles(sourcePath, destPath, variables);
        } else {
            // Read file content
            let content = fs.readFileSync(sourcePath, 'utf8');

            // Replace variables in the content
            for (const [key, value] of Object.entries(variables)) {
                const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
                content = content.replace(regex, value);
            }

            // Write modified content to destination
            fs.writeFileSync(destPath, content);
        }
    }
}

// Function to install dependencies
async function installDependencies(projectDir) {
    console.log(`\n${colors.cyan}Installing dependencies...${colors.reset}`);

    try {
        process.chdir(projectDir);
        execSync('npm install', { stdio: 'inherit' });
        console.log(`${colors.green}Dependencies installed successfully!${colors.reset}`);
    } catch (error) {
        console.error(`${colors.red}Failed to install dependencies:${colors.reset}`, error);
        console.log(`${colors.yellow}You can install them manually by running 'npm install' in the project directory.${colors.reset}`);
    }
}

// Function to initialize git repository
async function initGitRepo(projectDir) {
    console.log(`\n${colors.cyan}Initializing Git repository...${colors.reset}`);

    try {
        process.chdir(projectDir);
        execSync('git init && git add . && git commit -m "Initial commit from express-typescript-template"', { stdio: 'inherit' });
        console.log(`${colors.green}Git repository initialized successfully!${colors.reset}`);
    } catch (error) {
        console.error(`${colors.red}Failed to initialize Git repository:${colors.reset}`, error);
    }
}

// Main function
async function main() {
    try {
        // Ask questions
        const answers = await askQuestions();
        rl.close();

        console.log('\n');

        // Get project directory
        const projectName = answers.projectName;
        const projectDir = path.join(process.cwd(), projectName);

        // Get the package directory (where the template files are located)
        const packageDir = path.join(__dirname, '..');
        const templateDir = path.join(packageDir, 'template');

        // Check if project directory already exists
        if (fs.existsSync(projectDir)) {
            console.log(`${colors.red}Error: Directory ${projectDir} already exists.${colors.reset}`);
            process.exit(1);
        }

        console.log(`${colors.cyan}Creating new Express TypeScript project: ${colors.green}${projectName}${colors.reset}`);
        console.log(`${colors.cyan}Location: ${colors.reset}${projectDir}`);

        // Prepare variables for template replacement
        const variables = {
            projectName: answers.projectName,
            description: answers.description,
            author: answers.author,
            enableMongoDB: answers.enableMongoDB.toLowerCase() === 'y' ? 'true' : 'false',
            year: new Date().getFullYear()
        };

        // Copy template files
        copyTemplateFiles(templateDir, projectDir, variables);

        // Conditionally include MongoDB dependencies
        if (answers.enableMongoDB.toLowerCase() === 'y') {
            console.log(`${colors.cyan}Adding MongoDB support...${colors.reset}`);
        } else {
            // Remove MongoDB related files
            fs.unlinkSync(path.join(projectDir, 'src/config/db.config.ts'));
            console.log(`${colors.cyan}Skipping MongoDB support...${colors.reset}`);
        }

        // Conditionally include Swagger
        if (answers.enableSwagger.toLowerCase() !== 'y') {
            fs.unlinkSync(path.join(projectDir, 'src/config/swagger.config.ts'));
            console.log(`${colors.cyan}Skipping Swagger support...${colors.reset}`);
        }

        // Conditionally include Docker files
        if (answers.enableDocker.toLowerCase() === 'y') {
            console.log(`${colors.cyan}Adding Docker support...${colors.reset}`);
        } else {
            // Remove Docker related files
            fs.unlinkSync(path.join(projectDir, 'Dockerfile'));
            fs.unlinkSync(path.join(projectDir, 'docker-compose.yml'));
            console.log(`${colors.cyan}Skipping Docker support...${colors.reset}`);
        }

        // Install dependencies
        await installDependencies(projectDir);

        // Initialize git repository
        await initGitRepo(projectDir);

        console.log(`\n${colors.green}Project created successfully!${colors.reset}`);
        console.log(`\n${colors.blue}To get started:${colors.reset}`);
        console.log(`  cd ${projectName}`);
        console.log(`  npm run dev`);
        console.log(`\n${colors.blue}Happy coding!${colors.reset}`);

    } catch (error) {
        console.error(`${colors.red}Error creating project:${colors.reset}`, error);
        process.exit(1);
    }
}

// Run the main function
main();