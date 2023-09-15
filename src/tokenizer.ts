enum TokenType {
  Number,
  Operator,
  Parenthesis,
}

interface Token {
  type: TokenType;
  value: string;
}

function tokenizer(input: string): Token[] {
  const tokens: Token[] = [];
  let currentToken = '';

  for (const char of input) {
    if (/\d/.test(char)) {
      currentToken += char;
    } else if (/[+\-*/]/.test(char)) {
      if (currentToken) {
        tokens.push({ type: TokenType.Number, value: currentToken });
        currentToken = '';
      }
      tokens.push({ type: TokenType.Operator, value: char });
    } else if (/[()]/.test(char)) {
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
