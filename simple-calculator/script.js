let currentExpression = '';
let result = null;

function updateDisplay() {
    const display = document.getElementById('display');
    if (currentExpression === '') {
        display.textContent = '0';
    } else {
        display.textContent = currentExpression;
    }
}

function appendNumber(num) {
    if (result !== null) {
        currentExpression = '';
        result = null;
    }
    
    if (num === '.' && currentExpression.slice(-1) === '.') {
        return;
    }
    
    const lastChar = currentExpression.slice(-1);
    if (num === '.' && (lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/')) {
        currentExpression += '0.';
    } else {
        currentExpression += num;
    }
    
    updateDisplay();
}

function appendOperator(op) {
    if (result !== null) {
        currentExpression = result.toString();
        result = null;
    }
    
    if (currentExpression === '') {
        return;
    }
    
    const lastChar = currentExpression.slice(-1);
    
    if (lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/') {
        currentExpression = currentExpression.slice(0, -1) + op;
    } else {
        currentExpression += op;
    }
    
    updateDisplay();
}

function calculate() {
    if (currentExpression === '' || result !== null) {
        return;
    }
    
    const lastChar = currentExpression.slice(-1);
    if (lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/') {
        return;
    }
    
    try {
        let expression = currentExpression.replace(/×/g, '*').replace(/÷/g, '/');
        
        if (expression.includes('/0')) {
            const parts = expression.split('/');
            for (let i = 1; i < parts.length; i++) {
                const nextNum = parts[i].match(/^[\d.]+/);
                if (nextNum && parseFloat(nextNum[0]) === 0) {
                    currentExpression = 'Error';
                    updateDisplay();
                    result = null;
                    return;
                }
            }
        }
        
        result = eval(expression);
        currentExpression = result.toString();
        updateDisplay();
    } catch (error) {
        currentExpression = 'Error';
        updateDisplay();
        result = null;
    }
}

function clearDisplay() {
    currentExpression = '';
    result = null;
    updateDisplay();
}

function backspace() {
    if (currentExpression === 'Error' || result !== null) {
        clearDisplay();
        return;
    }
    
    if (currentExpression.length > 0) {
        currentExpression = currentExpression.slice(0, -1);
    }
    updateDisplay();
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendNumber('.');
    } else if (e.key === '+') {
        appendOperator('+');
    } else if (e.key === '-') {
        appendOperator('-');
    } else if (e.key === '*') {
        appendOperator('*');
    } else if (e.key === '/') {
        appendOperator('/');
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clearDisplay();
    } else if (e.key === 'Backspace') {
        backspace();
    }
});

updateDisplay();