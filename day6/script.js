let allCoins = [];
let favorites = JSON.parse(localStorage.getItem('favor')) || [];
let currentView = 'all';

async function fetchData() {
    const res = await fetch('https://api4.binance.com/api/v3/ticker/24hr');
    const data = await res.json();

    allCoins = data.filter(coin => coin.symbol.endsWith('USDT'));
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('crypto-list');
    tbody.innerHTML = ''; // 기존 내용을 다 지우고 새로 그리기

    const searchVal = document.getElementById('search').value.toUpperCase();
    let displayData = currentView === 'all' ? allCoins : allCoins.filter(c => favorites.includes(c.symbol));
    displayData = displayData.filter(c => c.symbol.includes(searchVal));

    for (let i = 0; i < displayData.length; i++) {
        const coin = displayData[i];
        
        // 데이터 포맷팅
        const lastPrice = parseFloat(coin.lastPrice).toLocaleString(undefined, {minimumFractionDigits: 2});
        const highPrice = parseFloat(coin.highPrice).toLocaleString();
        const lowPrice = parseFloat(coin.lowPrice).toLocaleString();
        const percent = parseFloat(coin.priceChangePercent);
        const isPositive = percent >= 0;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="star ${favorites.includes(coin.symbol) ? 'active' : ''}" onclick="toggleFav('${coin.symbol}')">★</td>
            <td><strong>${coin.symbol}</strong></td>
            <td>${lastPrice}</td>
            <td class="${isPositive ? 'positive' : 'negative'}">
                ${isPositive ? '+' : ''}${percent.toFixed(2)}%
            </td>
            <td>${highPrice}</td>
            <td>${lowPrice}</td>
        `;
        tbody.appendChild(tr);
    }
}

function toggleFav(symbol) {
    if (favorites.includes(symbol)) {
        favorites = favorites.filter(s => s !== symbol);
    } else {
        favorites.push(symbol);
    }
    localStorage.setItem('favor', JSON.stringify(favorites));
    renderTable();
}

document.getElementById('btn-all').onclick = () => { currentView = 'all'; renderTable(); };
document.getElementById('btn-favor').onclick = () => { currentView = 'favor'; renderTable(); };

// onclick이 아니라 oninput (글자를 입력할 때마다 실행)
document.getElementById('search').oninput = renderTable;

setInterval(fetchData, 1000);
fetchData();