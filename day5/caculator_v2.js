// --- 1. [계산 엔진] 핵심 로직 (수학 계산 일꾼들) ---
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
    if (b === 0) return "0으로 나눌 수 없어 애러입니다.";
    return a / b;
}

// --- 2. [계산 엔진] 배열 처리 로직 ---
function tokenize(expression) {
    expression = expression.replace(/\s+/g, '');
    const regex = /(\d+\.?\d*|[\+\-\*\/\(\)])/g;
    return expression.match(regex);
}

function processHighPriority(tokens) {
    let i = 0;
    while (i < tokens.length) {
        if (tokens[i] === '*' || tokens[i] === '/') {
            const a = parseFloat(tokens[i - 1]);
            const b = parseFloat(tokens[i + 1]);
            let result = (tokens[i] === '*') ? multiply(a, b) : divide(a, b);
            tokens.splice(i - 1, 3, result.toString());
            i--;
        }
        i++;
    }
    return tokens;
}

function processLowPriority(tokens) {
    let result = parseFloat(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextNumber = parseFloat(tokens[i + 1]);
        if (operator === '+') result = add(result, nextNumber);
        else if (operator === '-') result = subtract(result, nextNumber);
    }
    return result;
}

function calculate(expression) {
    const tokens = tokenize(expression);
    const afterHigh = processHighPriority(tokens);
    return processLowPriority(afterHigh);
}

let isPowerOn = true;

function appendNumber(num) {
    if (!isPowerOn) return;
    const display = document.getElementById('display');
    if (display.value === '0') display.value = num;
    else display.value += num;
}

function appendOperator(op) {
    if (!isPowerOn) return;
    document.getElementById('display').value += op;
}

function clearDisplay() {
    if (!isPowerOn) return;
    document.getElementById('display').value = '0';
}

function performCalculate() {
    if (!isPowerOn) return;
    const display = document.getElementById('display');
    const result = calculate(display.value);
    display.value = result;
}

function togglePower() {
    isPowerOn = !isPowerOn;
    const display = document.getElementById('display');
    if (isPowerOn) {
        display.value = '0';
    } else {
        display.value = '';
    }
}

function start() {
    const input = prompt("계산할 수식을 입력하세요 (예: 10 + 5 * 2)");
    if (input) {
        const result = calculate(input);
        console.log("계산 결과: " + result);
        alert("결과: " + result); 
    }
}