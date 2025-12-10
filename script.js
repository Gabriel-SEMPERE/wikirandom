async function genererArticles() {
    const listElement = document.getElementById('result-list');
    const loader = document.getElementById('loader');
    const countInput = document.getElementById('articleCount');

    // Nettoyage
    listElement.innerHTML = ''; 
    loader.style.display = 'block';

    // On récupère le nombre (max 10 pour la vitesse)
    let limit = parseInt(countInput.value) || 5;
    if (limit > 10) limit = 10;

    const url = `https://fr.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&grnlimit=${limit}&prop=extracts|pageimages&pithumbsize=100&exsentences=3&exintro&explaintext&format=json&origin=*`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        loader.style.display = 'none';

        if (!data.query || !data.query.pages) {
            listElement.innerHTML = '<p style="color:red">Erreur : Wikipédia ne répond pas.</p>';
            return;
        }

        const pages = Object.values(data.query.pages);

        pages.forEach(page => {
            const title = page.title;
            const linkUrl = `https://fr.wikipedia.org/wiki/${encodeURIComponent(title)}`;
            // Si pas de résumé,texte par défaut
            const summary = page.extract || "Pas de résumé disponible pour cet article.";
            
            // Gestion de l'image
            let imgHtml = '';
            if (page.thumbnail) {
                imgHtml = `<img src="${page.thumbnail.source}" class="wiki-thumb" alt="img">`;
            } else {
                // Image vide carrée si pas de photo
                imgHtml = `<div class="wiki-thumb" style="background:#eee; display:flex; align-items:center; justify-content:center; color:#ccc;">?</div>`;
            }

            const li = document.createElement('li');
            li.innerHTML = `
                <div class="wiki-card">
                    ${imgHtml}
                    <div class="card-content">
                        <a href="${linkUrl}" target="_blank" class="wiki-title">${title}</a>
                        <p class="wiki-summary">${summary}</p>
                    </div>
                </div>
            `;
            listElement.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        loader.textContent = "Erreur de connexion.";
    }
}

// Lancer au démarrage
window.onload = genererArticles;