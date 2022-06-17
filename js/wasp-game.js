const getCurrentPoints = (el) => {
    return parseInt(el.getAttribute('value'));
}

const getDamageValue = (el) => {
    return parseInt(el.parentElement.dataset.damage);
}

const getWaspType = (el) => {
    return el.dataset.type;
}

const isHitFatal = (el) => {
    return (
        (getCurrentPoints(el) - getDamageValue(el)) <= 0
    )
}

const calculateNewHitPoints = (el) => {
    return parseInt(getCurrentPoints(el) - getDamageValue(el));
}

const updateHitPoints = (el, setClass = 'splat') => {
    try {
        el.setAttribute('value', calculateNewHitPoints(el));
        el.parentElement.classList.add(setClass);
    } catch(e) {
        console.log('error updating hit points')
        return false;
    }
    return true;
};

const killWasp = (el, waspType) => {
    console.log(`here ${el}`);
    updateHitPoints(el, 'dead');
    if (waspType === 'queen') endGame();
    return;
}

function hitWasp(e) {
    try {
        document.querySelector('li.splat').classList.remove('splat');
    } catch(e) {}

    const waspsAlive = e.target.previousElementSibling.querySelectorAll('li:not(.dead)');
    if (waspsAlive.length === 0) endGame();

    const waspToHit = parseInt(Math.random() * waspsAlive.length);
    let selectedWasp = waspsAlive[waspToHit];
    let selectedWaspPoints = selectedWasp.getElementsByTagName('meter')[0];

    isHitFatal(selectedWaspPoints) === false ? updateHitPoints(selectedWaspPoints)
        : getWaspType(selectedWasp) === 'queen' ? killWasp(selectedWaspPoints, 'queen') 
        : killWasp(selectedWaspPoints, 'other');
    
    if (e.target.previousElementSibling.querySelectorAll('li:not(.dead)').length === 0) endGame();
}

function endGame() {
    let button = document.querySelector('#hitWasp');
    button.textContent = 'Game over';
    button.removeEventListener('click', hitWasp);
    let resetButton = document.createElement('button');
    resetButton.innerText = 'Play again';
    button.parentElement.appendChild(resetButton);
    resetButton.addEventListener('click', () => { loadWaspGame(button.parentElement, 'replace') }, true);
}

function renderWaspGame() {
    const waspTypes = [
        {
            'type': 'queen',
            'qty': 1,
            'hitPoints': 80,
            'damage': 7
        },
        {
            'type': 'worker',
            'qty': 5,
            'hitPoints': 68,
            'damage': 10
        },
        {
            'type': 'drone',
            'qty': 8,
            'hitPoints': 60,
            'damage': 12
        }
    ];

    return `
        <div id="wasp-game">
            <ul id="wasp-list">
            ${waspTypes.map((waspType) => {
                return (function() {
                  let output = '';
                  for (let i = 0; i < waspType.qty; i++) {
                    output = output + `<li data-type="${waspType.type}" data-damage="${waspType.damage}">
                            <meter min="0" max="${waspType.hitPoints}" value="${waspType.hitPoints}" 
                                low="${waspType.damage+1}" high="${waspType.hitPoints-waspType.damage}" optimum="${waspType.hitPoints}">
                            </meter>
                        </li>`;               
                  }
                  return output;
                })()
            }).join('')}
            </ul>
            <button id="hitWasp">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                    <path d="M374.7 1c-5.7 1.5-11.8 4.8-15.9 8.8-5.2 5-5.1 10 .3 12.7 3.8 2 3.8 2 10.6-2.5 6.9-4.7 13.2-5.9 20.3-4 4.1 1 9.1 5.7 53.8 50.3 27.1 27.1 50 50.5 50.8 52 2.2 4.1 2.8 11.5 1.4 16.7-1 4.1-6.2 9.5-57.3 60.8-43.8 43.8-57.1 56.6-60.2 57.7-2.6 1-16.2 2.4-37.9 4-35.4 2.6-46 3-45.4 1.7.2-.4 1.6-3.2 3.3-6.2 2.5-4.7 3-6.6 3-13 0-9.1-2.4-14.9-8.5-21s-11.9-8.5-21-8.5c-6.4 0-8.3.5-13 3-3 1.7-5.9 3.2-6.4 3.4-1.7.7 3.4-75.9 5.6-82.9.8-2.6 11.1-13.6 41.4-44C338 51.5 340 49.2 340 45.8c0-4.1-3.5-7.8-7.4-7.8-3 0-82.9 79.9-86.1 86.1-3.8 7.3-4.3 11.2-7 47.7-2.9 40-3 46.5-.9 52.7l1.5 4.6-4.1 4.5c-5.2 5.6-7.2 10.4-6.9 16.1l.3 4.4-113.6 113.7C22.7 461 2 482.2 1 485.4c-2.9 9 1.4 19.8 9.5 24 5.6 2.9 14.7 2.9 19.5-.1 1.9-1.2 12.2-10.9 22.8-21.6C66.4 474 72 467.7 72 466.1c0-2.9-5.2-8.1-8.1-8.1-1.6 0-8.1 5.8-21.9 19.5C29 490.4 21.6 497 20.2 497c-2.7 0-5.2-2.6-5.2-5.3 0-1.6 32.2-34.4 112-114.2l112-112 3.7 3.8 3.8 3.7-81.3 81.3c-88 88-84.2 83.7-78.7 89.2 5.4 5.5 1.1 9.3 89.7-79.2l81.7-81.7 4.4.3c5.7.3 10.5-1.7 16.1-6.9l4.5-4.1 4.6 1.5c2.5.9 7.9 1.6 11.9 1.6 10.8 0 74.4-4.8 79.5-6 10-2.4 12.1-4.4 70.7-63.2 64.9-65.2 61.8-61.3 61.9-77.3 0-8.1-.3-9.7-3.3-16-3.1-6.5-6.5-10.2-52.5-56.2C410.3 10.9 406 6.9 399.8 4c-7.4-3.5-18.1-4.7-25.1-3zm-96.1 225.6c6.7 3.2 9.8 10.8 7.4 18-1.5 4.3-19.3 23.4-21.9 23.4-1.7 0-20.1-17.8-20.1-19.5 0-1.6 20.2-21.3 23-22.4 3.8-1.5 7.8-1.3 11.6.5z"/><path d="M375.7 48.8c-2.4 2.6-2.2 8.5.3 10.7 4.7 4.2 12 .8 12-5.6 0-6-8.4-9.4-12.3-5.1zM352.3 73c-4.4 1.8-5.7 8.6-2.3 12 2.8 2.8 8.4 2.7 10.4-.2 4.5-6.3-1.2-14.5-8.1-11.8zM403.7 72.7c-.9.2-2.4 1.8-3.3 3.4-4.1 8 6.1 15.2 11.6 8.2 2.3-2.9 2.2-7.6-.3-10-1.5-1.4-5.6-2.3-8-1.6zM324.5 100.5c-6.1 6.1 1 15.5 8.6 11.4 2.9-1.5 4-5.2 2.8-8.9-1.9-5.4-7.4-6.6-11.4-2.5zM376 100c-1.2 1.2-2 3.3-2 5.5 0 7 7.7 10.2 11.9 4.9 2.8-3.5 2.6-6.9-.4-9.9-2.9-3-6.8-3.2-9.5-.5zM427.1 100.6c-2.8 3.5-2.6 6.9.4 9.9 4.7 4.8 11.5 1.9 11.5-5 0-7-7.7-10.2-11.9-4.9zM299.3 125.5c-2.9 2-3.7 5.9-1.9 9.4 2.5 4.8 7.3 5.5 11.1 1.6 6.4-6.3-1.8-16.2-9.2-11zM350 126c-3 3-2.7 8.3.6 10.9 1.5 1.2 3.4 2.1 4.4 2.1 1 0 2.9-.9 4.4-2.1 5.2-4.1 2.3-12.9-4.4-12.9-1.7 0-3.9.9-5 2zM401 126.7c-4 5.2-.9 11.7 5.6 11.7 9.3 0 9.5-13.4.2-14.2-2.9-.3-4 .2-5.8 2.5zM452.6 126.2c-3.8 5.4-.7 12.1 5.6 12.1 6 0 9.1-8 4.8-12.3-2.8-2.8-8.4-2.7-10.4.2zM429.3 150c-4.4 1.8-5.7 8.6-2.3 12 2.6 2.6 8.1 2.6 10.3.2 2.2-2.5 2.2-8.5 0-10.4-2.5-2.2-5.4-2.8-8-1.8zM324 152c-4.5 4.5-1.1 12 5.3 12 2 0 4.1-.8 5-1.8 2.3-2.5 2.2-8.5-.1-10.5-2.5-2.3-7.8-2.1-10.2.3zM375.7 151.8c-2.3 2.5-2.2 8.5.1 10.5 1 1 3.3 1.7 5 1.7 6.1 0 9.3-6.6 5.6-11.8-2-2.8-8.3-3.1-10.7-.4zM300.7 175.7c-.9.2-2.4 1.8-3.3 3.4-4.1 8 6.1 15.2 11.6 8.2 2.3-2.9 2.2-7.6-.3-10-1.5-1.4-5.6-2.3-8-1.6zM350.6 177.1c-5.2 4.1-2.3 12.9 4.4 12.9s9.6-8.8 4.4-12.9c-1.5-1.2-3.4-2.1-4.4-2.1-1 0-2.9.9-4.4 2.1zM401.5 177.5c-3 3-3.2 6.4-.4 9.9 4.2 5.3 12.3 2.1 12.3-4.9 0-6.9-7.1-9.9-11.9-5zM324.1 203.6c-2.8 3.5-2.6 6.9.4 9.9 4.7 4.8 11.5 1.9 11.5-5 0-7-7.7-10.2-11.9-4.9zM376.2 202.7c-4.9 4.2-1.9 13.3 4.3 13.3 3.3 0 7.5-4.2 7.5-7.3 0-6.2-7.3-9.8-11.8-6z"/>
                </svg> 
                Splat wasp
            </button>
        </div>
    `;
}

function loadWaspGame(targetElement = 'body', insertMethod = 'replace') {
    const el = (!!targetElement.children) ? targetElement : document.querySelector(targetElement);
    try {
        if (insertMethod === 'replace') el.innerHTML = renderWaspGame();
        if (insertMethod === 'append') {
            let newEl = document.createElement('div');
            newEl.innerHTML = renderWaspGame();
            el.appendChild(newEl);
        }
        document.querySelector('#hitWasp').addEventListener('click', hitWasp);
    } catch(e) {
        console.error(`Error rendering game: ${e}`);
    }

}