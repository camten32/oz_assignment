function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0){
        return "0으로 나눌 수 없어 애러입니다."
    }
    return a / b;
}
function tokenize(expression) {
    expression = expression.replace(/\s+/g, '');

    const regex = /(\d+\.?\d*|[\+\-\*\/\(\)])/g;
    return expression.match(regex);
}

function processHighPriority(tokens) {
    let i = 0;
    while (i < tokens.length) {
        if (tokens[i] === '*' || tokens[i] === '/') {
            const a = parseFloat(tokens[i - 1]); // 연산자 앞의 숫자
            const b = parseFloat(tokens[i + 1]); // 연산자 뒤의 숫자
            let result;

            if (tokens[i] === '*') {
                result = multiply(a, b);
            } else {
                result = divide(a, b);
            }

            // 계산한 결과를 배열의 해당 위치에 넣고, 앞뒤 숫자와 연산자는 제거
            tokens.splice(i - 1, 3, result.toString());
            
            // i를 조정하여 다음 인덱스를 체크하도록 함
            i--; 
        }
        i++;
    }
    return tokens;
}

function processLowPriority(tokens) {
    // 첫 번째 숫자를 결과값으로 초기화
    let result = parseFloat(tokens[0]);

    // 연산자와 숫자를 하나씩 확인하며 계산
    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextNumber = parseFloat(tokens[i + 1]);

        if (operator === '+') {
            result = add(result, nextNumber);
        } else if (operator === '-') {
            result = subtract(result, nextNumber);
        }
    }
    return result;
}

function calculate(expression) {
    const tokens = tokenize(expression);
    
    // 1. 곱셈/나눗셈 먼저 처리
    const afterHigh = processHighPriority(tokens);
    
    // 2. 덧셈/뺄셈 처리 후 최종 결과 반환
    return processLowPriority(afterHigh);
}
function start() {
    const input = prompt("계산할 수식을 입력하세요 (예: 10 + 5 * 2)");
    if (input) {
        const result = calculate(input);
        console.log("계산 결과: " + result);
    } else {
        console.log("입력이 취소되었습니다.");
    }
}