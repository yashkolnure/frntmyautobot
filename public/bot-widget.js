(function () {
    /**
     * 1. DATA RETRIEVAL
     * We pull the theme along with the botId and origin.
     */
    const botId = window.petobaBotId || document.currentScript?.getAttribute('data-bot-id');
    const origin = window.petobaOrigin || new URL(document.currentScript?.src).origin;
    const theme = window.petobaTheme || 'cyberpunk'; // Default to cyberpunk

    if (!botId) {
        return console.error("Petoba: Initialization failed. Missing Bot ID.");
    }

    // Map theme keys to actual brand colors for the bubble
    const themeColors = {
        cyberpunk: '#9333ea', // Neural Purple
        minimal: '#64748b',   // Spectral Mono
        emerald: '#10b981',   // Toxic Chrome
        dark: '#18181b'       // Absolute Dark
    };
    const activeColor = themeColors[theme] || themeColors.cyberpunk;

    // 2. STYLES INJECTION
    const style = document.createElement('style');
    style.innerHTML = `
      #petoba-bubble {
        position: fixed; bottom: 24px; right: 24px;
        width: 60px; height: 60px; 
        background: ${activeColor}; /* Dynamic Color */
        color: white; border-radius: 50%; display: flex;
        align-items: center; justify-content: center;
        cursor: pointer; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 2147483647; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      #petoba-bubble:hover { transform: scale(1.05); opacity: 0.9; }
      #petoba-bubble:active { transform: scale(0.95); }
      
      #petoba-container {
        position: fixed; bottom: 100px; right: 24px;
        width: 400px; height: 600px; max-height: 80vh;
        background: white; border-radius: 24px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        z-index: 2147483647; border: 1px solid rgba(0,0,0,0.05);
        overflow: hidden; display: none;
        transform-origin: bottom right;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0; transform: translateY(20px) scale(0.95);
      }
      #petoba-container.active {
        display: block; opacity: 1; transform: translateY(0) scale(1);
      }
      
      @media (max-width: 480px) {
        #petoba-container { 
            width: 100%; height: 100%; 
            right: 0; bottom: 0; 
            border-radius: 0; max-height: 100vh; 
        }
      }
    `;
    document.head.appendChild(style);

    // 3. CREATE ELEMENTS
    const bubble = document.createElement('div');
    bubble.id = 'petoba-bubble';
    const chatIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`;
    const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    
    bubble.innerHTML = chatIcon;

    const container = document.createElement('div');
    container.id = 'petoba-container';
    
    /**
     * UPDATED URL CONSTRUCTION:
     * We now append &theme=${theme} so the React PublicChat component 
     * knows which visual style to render.
     */
    container.innerHTML = `
      <iframe 
        src="${origin}/chat/${botId}?embed=true&theme=${theme}" 
        style="width: 100%; height: 100%; border: none;"
        allow="clipboard-read; clipboard-write"
      ></iframe>
    `;

    // 4. TOGGLE LOGIC
    let isOpen = false;
    bubble.onclick = () => {
        isOpen = !isOpen;
        if (isOpen) {
            container.style.display = 'block';
            setTimeout(() => container.classList.add('active'), 10);
            bubble.innerHTML = closeIcon;
        } else {
            container.classList.remove('active');
            bubble.innerHTML = chatIcon;
            setTimeout(() => { if(!isOpen) container.style.display = 'none' }, 300);
        }
    };

    document.body.appendChild(bubble);
    document.body.appendChild(container);
})();