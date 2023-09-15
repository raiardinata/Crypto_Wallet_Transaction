"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Number"] = 0] = "Number";
    TokenType[TokenType["Operator"] = 1] = "Operator";
    TokenType[TokenType["Parenthesis"] = 2] = "Parenthesis";
})(TokenType || (TokenType = {}));
function tokenizer(input) {
    const tokens = [];
    let currentToken = '';
    for (const char of input) {
        if (/\d/.test(char)) {
            currentToken += char;
        }
        else if (/[+\-*/]/.test(char)) {
            if (currentToken) {
                tokens.push({ type: TokenType.Number, value: currentToken });
                currentToken = '';
            }
            tokens.push({ type: TokenType.Operator, value: char });
        }
        else if (/[()]/.test(char)) {
            if (currentToken) {
                tokens.push({ type: TokenType.Number, value: currentToken });
                currentToken = '';
            }
            tokens.push({ type: TokenType.Parenthesis, value: char });
        }
    }
    if (currentToken) {
        tokens.push({ type: TokenType.Number, value: currentToken });
    }
    return tokens;
}
// Example usage:
const inputExpression = '3 + 4 * (2 - 1)';
const tokens = tokenizer(inputExpression);
console.log(tokens);
