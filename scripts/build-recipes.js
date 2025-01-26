const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('front-matter');

// Configure paths
const MARKDOWN_DIR = path.join(__dirname, '../src/markdown');
const PUBLIC_DIR = path.join(__dirname, '../public');
const TEMPLATE_DIR = path.join(__dirname, '../src/templates');

async function buildRecipes() {
    try {
        // Ensure output directories exist
        await fs.ensureDir(path.join(PUBLIC_DIR, 'recipes/tried-and-tested'));
        await fs.ensureDir(path.join(PUBLIC_DIR, 'recipes/excited-to-try'));

        // Read recipe template
        const templateHtml = await fs.readFile(
            path.join(TEMPLATE_DIR, 'recipe-page.html'),
            'utf-8'
        );

        // Process all markdown files
        const categories = ['tried-and-tested', 'excited-to-try'];
        
        for (const category of categories) {
            const categoryDir = path.join(MARKDOWN_DIR, category);
            
            // Skip if category directory doesn't exist
            if (!await fs.pathExists(categoryDir)) continue;

            const files = await fs.readdir(categoryDir);
            
            for (const file of files) {
                if (path.extname(file) !== '.md') continue;

                const markdown = await fs.readFile(
                    path.join(categoryDir, file),
                    'utf-8'
                );

                // Parse front matter and markdown
                const { attributes, body } = frontMatter(markdown);
                const html = marked.parse(body);

                // Generate HTML file
                const recipeHtml = templateHtml
                    .replace('{{title}}', attributes.title)
                    .replace('{{content}}', html)
                    .replace('{{category}}', category)
                    .replace('{{prepTime}}', attributes.prepTime)
                    .replace('{{cookTime}}', attributes.cookTime)
                    .replace('{{totalTime}}', attributes.totalTime);

                // Save HTML file
                const outputPath = path.join(
                    PUBLIC_DIR,
                    'recipes',
                    category,
                    `${path.basename(file, '.md')}.html`
                );
                
                await fs.writeFile(outputPath, recipeHtml);
                console.log(`Built: ${outputPath}`);
            }
        }

        console.log('Recipe build complete!');
    } catch (error) {
        console.error('Build failed:', error);
    }
}

buildRecipes(); 