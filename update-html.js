const fs = require('fs');
const path = require('path');

const root = 'c:/imane choco box/';
const files = ['index.html', 'collection.html', 'about.html', 'contact.html'];

const renames = {
    'Box c\u0153ur Ferrero premium.png': 'box-coeur-ferrero-premium.png',
    'choco box etage.png': 'choco-box-etage.png',
    'Box c\u0153ur rose Ferrero.png': 'box-coeur-rose-ferrero.png',
    'box coeur rouge.png': 'box-coeur-rouge.png',
    'Box c\u0153ur romantique.png': 'box-coeur-romantique.png',
    'Box c\u0153ur Ferrero rouge.png': 'box-coeur-ferrero-rouge.png',
    'Box anniversaire etaage.png': 'box-anniversaire-etage.png',
    'Box c\u0153ur love.png': 'box-coeur-love.png',
    'Box c\u0153ur violet.png': 'box-coeur-violet.png',
    'Box c\u0153ur chocolat mix.png': 'box-coeur-chocolat-mix.png',
    'box coeur marriage.png': 'box-coeur-mariage.png',
    'box ronde snickers.png': 'box-ronde-snickers.png',
    'box ronde ferroro.png': 'box-ronde-ferrero.png',
    'box coeaur ferrero.png': 'box-coeur-ferrero.png',
    'box couer red and white.png': 'box-coeur-rouge-blanc.png',
    "Bleu Blanc Minimaliste Simple Moderne Typographic Ciel Azur Galerie D'art Logo.png": 'logo.png',
    "Mini box c\u0153ur.png": 'mini-box-coeur.png'
};

const defaultNav = `    <!-- Navigation -->
    <nav class="navbar" role="navigation" aria-label="Navigation Principale">
        <div class="nav-container">
            <div class="nav-left">
                <button class="hamburger" aria-label="Ouvrir le menu" aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
                <ul class="nav-links desktop-nav">
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="collection.html">Collection</a></li>
                </ul>
            </div>
            <div class="nav-logo-wrap">
                <a href="index.html" class="logo-wrapper">
                    <img src="logo.png" alt="Choco Box Maroc - Accueil">
                </a>
            </div>
            <div class="nav-right">
                <ul class="nav-links desktop-nav">
                    <li><a href="about.html">Notre Histoire</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
                <a href="https://wa.me/212700773014" target="_blank" class="nav-wa" aria-label="Commander sur WhatsApp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                    </svg>
                </a>
            </div>
        </div>
    </nav>

    <!-- Mobile Menu -->
    <div class="mobile-menu">
        <a href="index.html">Accueil</a>
        <a href="collection.html">Collection</a>
        <a href="about.html">Histoire</a>
        <a href="contact.html">Contact</a>
    </div>`;

files.forEach(file => {
    const filePath = path.join(root, file);

    if (!fs.existsSync(filePath)) {
        console.log('SKIPPED (not found): ' + file);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix image filenames
    for (const [oldName, newName] of Object.entries(renames)) {
        const escaped = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        content = content.replace(new RegExp(escaped, 'g'), newName);
    }

    // 2. Add elevation.css if missing
    if (!content.includes('elevation.css')) {
        content = content.replace(
            '<link rel="stylesheet" href="animations.css">',
            '<link rel="stylesheet" href="animations.css">\n    <link rel="stylesheet" href="elevation.css">'
        );
    }

    // 3. Remove cursor: none everywhere
    content = content.replace(/\*\s*\{\s*cursor\s*:\s*none\s*;?\s*\}/g, '');
    content = content.replace(/cursor\s*:\s*none\s*;/g, '');

    // 4. Update nav — replace old nav block with clean centered logo nav
    const navRegex = /<!--\s*Navigation\s*-->[\s\S]*?<\/nav>[\s\S]*?<div class="mobile-(?:nav-overlay|menu)"[\s\S]*?<\/div>/;
    if (navRegex.test(content)) {
        let replacementNav = defaultNav;
        // Set active class on current page link
        const activeLink = `<a href="${file}"`;
        const activeReplacement = `<a href="${file}" class="active"`;
        replacementNav = replacementNav.replace(activeLink, activeReplacement);
        content = content.replace(navRegex, replacementNav);
    }

    // 5. Fix footer logo
    content = content.replace(
        /<img\s[^>]*class="footer-logo-img"[^>]*>/g,
        '<img src="logo.png" alt="Choco Box Maroc" class="footer-logo-img">'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Updated: ' + file);
});

console.log('\nAll done. Now run:');
console.log('git add .');
console.log('git commit -m "Fix images, cursor, nav"');
console.log('git push origin main');