// Create and append the tooltip element immediately
let tooltip = document.createElement('div');
tooltip.style.cssText = 'position: absolute; z-index: 1000; padding: 8px; background: black; color: white; border-radius: 4px; display: none;';
tooltip.id = 'hn-user-tooltip';
document.body.appendChild(tooltip);

let hoverTimer; // Timer for the delay

document.addEventListener('mouseover', function (e) {
    if (e.target && e.target.className === 'hnuser') {
        // Clear any existing timer
        clearTimeout(hoverTimer);

        // Start a new timer
        hoverTimer = setTimeout(() => {
            let username = e.target.textContent.trim();
            let fetchURL = `https://news.ycombinator.com/user?id=${username}`;

            fetch(fetchURL)
                .then(response => response.text())
                .then(htmlString => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(htmlString, 'text/html');

                    let createdElement = doc.querySelector('a[href*="birth"]'); // Example selector
                    let karmaElement = doc.querySelector('span[id="karma"]'); // Example selector
                    let aboutElement = doc.querySelector('td[style*="overflow:hidden"]'); // Example selector

                    let content = `Username: ${username}`;
                    content += createdElement ? `<br>Created: ${createdElement.textContent.trim()}` : '<br>Created: Not Found';
                    content += karmaElement ? `<br>Karma: ${karmaElement.textContent.trim()}` : '<br>Karma: Not Found';
                    content += aboutElement ? `<br>About: ${aboutElement.textContent.trim()}` : '<br>About: Not Found';

                    // Set the tooltip content and position it right under the cursor
                    tooltip.innerHTML = content;
                    tooltip.style.left = e.pageX + 'px'; // Right under the cursor horizontally
                    tooltip.style.top = e.pageY + 20 + 'px'; // 20px below cursor vertically
                    tooltip.style.display = 'block';
                })
                .catch(err => {
                    console.error('Failed to fetch user info:', err);
                    tooltip.style.display = 'none';
                });
        }, 500); // Delay of 0.5 second
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target && e.target.className === 'hnuser') {
        clearTimeout(hoverTimer); // Clear the timer if mouse leaves before the delay
        tooltip.style.display = 'none';
    }
});
