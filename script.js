const XML_URL = "https://radio.armblog.net/channels.txt";
const audio = document.getElementById('web-audio');
const playBtn = document.getElementById('play-pause-btn');
const volSlider = document.getElementById('volume-slider');
const vizContainer = document.getElementById('visualizer-container');

let allStations = [];
let currentPlayingUrl = "";

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    document.getElementById('theme-btn').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('armradio_theme', isDark ? 'dark' : 'light');
}

const translations = {
    'en': {
        'page-title': 'ArmRadio - Armenian Online Radio', 
        'nav-live': 'Start Listening', 'nav-features': 'Features', 'nav-contact': 'Contact',
        'hero-title': 'All Armenian Radio Stations in', 'hero-title-span': 'One Free App',
        'hero-description': 'Available for <strong>Android</strong> and as an extension for <strong>Chrome</strong> and <strong>Edge</strong>. On <strong>iOS</strong> and other platforms, you can use the <strong>web version</strong>',
        'live-title': 'Start Listening', 'live-subtitle': 'Choose a station and enjoy music directly in your browser',
        'section-title': 'Designed for the Best Experience', 'section-subtitle': 'Simple, reliable, and always up-to-date',
        'contact-title': 'Get in Touch', 'contact-subtitle': 'Have a suggestion or found a bug?',
        'lbl-name': 'Name', 'lbl-email': 'Email', 'lbl-message': 'Message',
        'ph-name': 'Your Name', 'ph-msg': 'How can we help?',
        'btn-send': 'Send Message', 'badge-new': 'New', 'badge-soon': 'Soon', 'text-listen-online': 'Start Listening',
        'player-status': 'Live Stream',
        'features': [
            {icon: '✨', title: 'Completely free and ad-free', desc: 'Completely free and contains no ads'},
            {icon: '⚙️', title: 'Auto-Updated Stations', desc: 'Stations are added dynamically'},
            {icon: '🔊', title: 'True Background Play', desc: 'Plays when screen is locked'},
            {icon: '🎧', title: 'Remote Control Support', desc: 'Supports Bluetooth and steering wheel buttons'},
            {icon: '🌗', title: 'Light & Dark Themes', desc: 'Switch between white and black themes'},
            {icon: '↔️', title: 'Adaptive interface', desc: 'Adaptive interface for devices with different screen sizes'},
            {icon: '♥', title: 'Quick Favorites', desc: 'One-tap access to your top stations'},
            {icon: '📲', title: 'Multi-store & multi-platform', desc: 'Play Store, AppGallery, RuStore, APK direct download, web version, Chrome/Edge extension'},
            {icon: '▦', title: 'Grid or List View', desc: 'Choose your preferred viewing mode'},
            {icon: '⚡', title: 'For electric vehicles', desc: "An essential radio app for Chinese electric vehicles such as BYD, DEEPAL, LI, Mazda, and others that do not have a built-in radio receiver"},
            {icon: '➕', title: 'Custom Stations', desc: 'Add your own streaming URLs soon', isSoon: true},
            {icon: '🚗', title: 'Android Auto', desc: 'Display ArmRadio app from your Android phone on an Android Auto-supported car head-unit', isSoon: true}
        ]
    },
    'am': {
        'page-title': 'ArmRadio - Հայկական առցանց ռադիո', 
        'nav-live': 'Լսել հիմա', 'nav-features': 'Հատկանիշներ', 'nav-contact': 'Հետադարձ կապ',
        'hero-title': 'Բոլոր Հայկական ռադիոկայանները', 'hero-title-span': 'Մեկ անվճար հավելվածում',
        'hero-description': 'Հասանելի է <strong>Android</strong> համակարգի համար և որպես ընդլայնում՝ <strong>Chrome</strong> և <strong>Edge</strong> դիտարկիչներում։ <strong>iOS</strong> և այլ համակարգերում կարող եք օգտվել <strong>վեբ տարբերակից</strong>',
        'live-title': 'Լսել հիմա', 'live-subtitle': 'Ընտրեք ռադիոկայան և լսեք անմիջապես դիտարկիչում',
        'section-title': 'Նախագծված է լավագույն փորախի համար', 'section-subtitle': 'Պարզ, հուսալի և միշտ թարմացված',
        'contact-title': 'Հետադարձ Կապ', 'contact-subtitle': 'Ունե՞ք առաջարկություն կամ գտե՞լ եք սխալ',
        'lbl-name': 'Անուն', 'lbl-email': 'Էլ. փոստ', 'lbl-message': 'Հաղորդագրություն',
        'ph-name': 'Ձեր անունը', 'ph-msg': 'Ինչպե՞ս կարող ենք օգնել:',
        'btn-send': 'Ուղարկել', 'badge-new': 'ՆՈՐ', 'badge-soon': 'Շուտով', 'text-listen-online': 'Լսել հիմա',
        'player-status': 'Ուղիղ եթեր',
        'features': [
            {icon: '✨', title: 'Անվճար և առանց գովազդի', desc: 'Հավելվածն ամբողջովին անվճար է և չի պարունակում թաքնված կամ բացահայտ գովազդ'},
            {icon: '⚙️', title: 'Ավտոմատ թարմացում', desc: 'Կայանների ցանկը թարմացվում է ավտոմատ կերպով'},
            {icon: '🔊', title: 'Ֆոնային նվագարկում', desc: 'Անխափան աշխատում է ֆոնային ռեժիմում'},
            {icon: '🎧', title: 'Հեռակառավարում', desc: 'Կառավարեք Bluetooth ականջակալների կոճակներից կամ մեքենայի ղեկից'},
            {icon: '🌗', title: 'Բաց և մուգ թեմաներ', desc: 'Ընտրեք ձեր նախընտրած գունային գամման'},
            {icon: '↔️', title: 'Ադապտիվ ինտերֆեյս', desc: 'Ադապտիվ ինտերֆեյս տարբեր չափսերով սարքերի վրա'},
            {icon: '♥', title: 'Ընտրյալներ', desc: 'Պահպանեք հավանած կայաններն առանձին ցուցակում'},
            {icon: '📲', title: 'Լայն հասանելիություն', desc: 'Play Store, AppGallery, RuStore, APK ներբեռնում, վեբ տարբերակ, Chrome/Edge հավելված'},
            {icon: '▦', title: 'Ցանց կամ Ցուցակ', desc: 'Ընտրեք կայանների տեսքը'},
            {icon: '⚡', title: 'Էլեկտրոմոբիլների համար', desc: "Անփոխարինելի ռադիո հավելված չինական BYD, DEEPAL, LI, Mazda և այլ էլեկտրական մեքենաների համար, որոնք չունեն ռադիոընդունիչ"},
            {icon: '➕', title: 'Սեփական կայաններ', desc: 'Ավելացրեք ձեր սեփական կայանների հղումները', isSoon: true},
            {icon: '🚗', title: 'Android Auto', desc: 'Ցուցադրեք ArmRadio հավելվածը Android հեռախոսից՝ Android Auto ունեցող մեքենայի էկրանին', isSoon: true}
        ]
    },
    'ru': {
        'page-title': 'ArmRadio - Армянское Радио Онлайн',
        'nav-live': 'Слушать сейчас', 'nav-features': 'Особенности', 'nav-contact': 'Контакт',
        'hero-title': 'Все Армянские Радиостанции в', 'hero-title-span': 'Одном Бесплатном Приложении',
        'hero-description': 'Доступно для <strong>Android</strong> и в виде расширения для <strong>Chrome</strong> и <strong>Edge</strong>. На <strong>iOS</strong> и других системах можно пользоваться <strong>веб-версией</strong>',
        'live-title': 'Слушать сейчас', 'live-subtitle': 'Выберите радиостанцию и слушайте музыку прямо в браузере',
        'section-title': 'Создано для лучшего опыта', 'section-subtitle': 'Просто, надежно и всегда актуально',
        'contact-title': 'Связаться с нами', 'contact-subtitle': 'Есть предложение или нашли ошибку?',
        'lbl-name': 'Имя', 'lbl-email': 'Эл. почта', 'lbl-message': 'Сообщение',
        'ph-name': 'Ваше имя', 'ph-msg': 'Чем мы можем помочь?',
        'btn-send': 'Отправить', 'badge-new': 'НОВОЕ', 'badge-soon': 'Скоро', 'text-listen-online': 'Слушать сейчас',
        'player-status': 'Прямой эфир',
        'features': [
            {icon: '✨', title: 'Бесплатно и без рекламы', desc: 'Полностью бесплатное и не содержит скрытой или явной рекламы'},
            {icon: '⚙️', title: 'Автообновление', desc: 'Список станций обновляется автоматически'},
            {icon: '🔊', title: 'Фоновый режим', desc: 'Работает при заблокированном экране'},
            {icon: '🎧', title: 'Управление кнопками', desc: 'Поддержка Bluetooth-наушников и кнопок на руле'},
            {icon: '🌗', title: 'Темная тема', desc: 'Переключайтесь между светлой и темной темами'},
            {icon: '↔️', title: 'Адаптивный интерфейс', desc: 'Адаптивный интерфейс для устройств с разными размерами экрана'},
            {icon: '♥', title: 'Избранное', desc: 'Быстрый доступ к любимым станциям'},
            {icon: '📲', title: 'Все магазины', desc: 'Play Store, AppGallery, RuStore, прямая загрузка APK, веб-версия, расширение для Chrome/Edge'},
            {icon: '▦', title: 'Сетка или Список', desc: 'Выберите удобный вид отображения'},
            {icon: '⚡', title: 'Для электромобилей', desc: "Незаменимое радио-приложение для китайских электромобилей BYD, DEEPAL, LI, Mazda и других, которые не оснащены радиоприёмником"},
            {icon: '➕', title: 'Свои станции', desc: 'Добавление своих ссылок (скоро)', isSoon: true},
            {icon: '🚗', title: 'Android Auto', desc: '«Отображайте приложение ArmRadio с Android-телефона на головном устройстве автомобиля с поддержкой Android Auto', isSoon: true}
        ]
    }
};

function setLanguage(lang) {
    const data = translations[lang] || translations['am'];
    document.getElementById('page-title').textContent = data['page-title'];
    document.getElementById('nav-live').textContent = data['nav-live'];
    document.getElementById('nav-features').textContent = data['nav-features'];
    document.getElementById('nav-contact').textContent = data['nav-contact'];
    document.getElementById('hero-title').innerHTML = data['hero-title'] + '<br><span>' + data['hero-title-span'] + '</span>';
    document.getElementById('hero-description').innerHTML = data['hero-description'];
    document.getElementById('live-title').textContent = data['live-title'];
    document.getElementById('live-subtitle').textContent = data['live-subtitle'];
    document.getElementById('section-title').textContent = data['section-title'];
    document.getElementById('section-subtitle').textContent = data['section-subtitle'];
    document.getElementById('contact-title').textContent = data['contact-title'];
    document.getElementById('contact-subtitle').textContent = data['contact-subtitle'];
    document.getElementById('lbl-name').textContent = data['lbl-name'];
    document.getElementById('lbl-email').textContent = data['lbl-email'];
    document.getElementById('lbl-message').textContent = data['lbl-message'];
    document.getElementById('input-name').placeholder = data['ph-name'];
    document.getElementById('input-message').placeholder = data['ph-msg'];
    document.getElementById('btn-send').textContent = data['btn-send'];
    document.getElementById('text-listen-online').textContent = data['text-listen-online'];
    document.getElementById('badge-new').textContent = data['badge-new'];
    
    document.getElementById('player-status-text').textContent = data['player-status'];

    const container = document.getElementById('feature-container');
    container.innerHTML = data.features.map(f => `
        <div class="feature-card">
            ${f.isSoon ? `<span class="badge">${data['badge-soon']}</span>` : ''}
            <span style="font-size:2.5rem; display:block; margin-bottom:15px;">${f.icon}</span>
            <h3>${f.title}</h3>
            <p>${f.desc}</p>
        </div>
    `).join('');

    document.querySelectorAll('.lang-switcher a').forEach(link => link.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
    localStorage.setItem('armradio_lang', lang);
    
    renderRadioGrid();
}

async function loadWebStations() {
    try {
        const response = await fetch(XML_URL);
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");
        
        allStations = Array.from(items).map(item => ({
            name: item.getAttribute('name'),
            name_ru: item.getAttribute('name_ru'),
            name_eng: item.getAttribute('name_eng'),
            url: item.getAttribute('url'),
            thumb: item.getAttribute('thumbnail')
        }));

        renderRadioGrid();
    } catch (e) { console.error(e); }
}

function renderRadioGrid() {
    const grid = document.getElementById('radio-grid');
    if (!grid) return;
    
    const lang = localStorage.getItem('armradio_lang') || 'am';
    grid.innerHTML = "";

    allStations.forEach(station => {
        let displayName = station.name;
        if(lang === 'en' && station.name_eng) displayName = station.name_eng;
        if(lang === 'ru' && station.name_ru) displayName = station.name_ru;

        const card = document.createElement('div');
        card.className = (currentPlayingUrl === station.url) ? 'radio-card selected' : 'radio-card';
        card.innerHTML = `<img src="${station.thumb}"><h4>${displayName}</h4>`;
        
        card.onclick = () => {
            document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            document.getElementById('player-bar').style.display = "block";
            document.body.classList.add('player-active');
            document.getElementById('now-playing-name').textContent = displayName;
            document.getElementById('player-img').src = station.thumb;
            
            if (audio.src !== station.url) {
                audio.src = station.url;
                currentPlayingUrl = station.url;
                audio.play();
            }
        };
        grid.appendChild(card);
        
        if(currentPlayingUrl === station.url) {
            document.getElementById('now-playing-name').textContent = displayName;
        }
    });
}

// Audio Events
audio.onplay = () => { playBtn.textContent = '⏹'; vizContainer.classList.add('playing'); };
audio.onpause = () => { playBtn.textContent = '▶'; vizContainer.classList.remove('playing'); };
playBtn.onclick = () => audio.paused ? audio.play() : audio.pause();
volSlider.oninput = (e) => audio.volume = e.target.value;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(localStorage.getItem('armradio_lang') || 'am');
    if(localStorage.getItem('armradio_theme') === 'dark') toggleTheme();
    loadWebStations();
    
    // Screenshot Slider
    setInterval(() => {
        const active = document.querySelector('.screenshot.active');
        const next = active.nextElementSibling || document.getElementById('img1');
        if(active && next) {
            active.className = 'screenshot inactive'; 
            next.className = 'screenshot active';
        }
    }, 4000);
});
