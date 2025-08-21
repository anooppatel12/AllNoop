
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function BasicCalculator() {
  const [input, setInput] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);

  const handleDigitClick = (digit: string) => {
    if (waitingForOperand) {
      setInput(digit);
      setWaitingForOperand(false);
    } else {
      setInput(input === '0' ? digit : input + digit);
    }
  };

  const handleDecimalClick = () => {
    if (waitingForOperand) {
      setInput('0.');
      setWaitingForOperand(false);
    } else if (!input.includes('.')) {
      setInput(input + '.');
    }
  };

  const handleOperatorClick = (nextOperator: string) => {
    const inputValue = parseFloat(input);

    if (operator && !waitingForOperand) {
      const result = calculate(prevValue!, inputValue, operator);
      setInput(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(inputValue);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };
  
  const calculate = (firstOperand: number, secondOperand: number, op: string) => {
    switch (op) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleEqualsClick = () => {
    const inputValue = parseFloat(input);
    if (operator && prevValue !== null) {
      const result = calculate(prevValue, inputValue, operator);
      setInput(String(result));
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const handleClearClick = () => {
    setInput('0');
    setOperator(null);
    setPrevValue(null);
    setWaitingForOperand(true);
  };

  const handleToggleSign = () => {
    setInput(String(parseFloat(input) * -1));
  }

  const handlePercent = () => {
    setInput(String(parseFloat(input) / 100));
  }

  return (
    <Card className="mt-8 max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Calculator</CardTitle>
        <CardDescription>A simple calculator for basic arithmetic.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          className="text-right text-3xl h-16"
          value={input}
          readOnly
        />
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" className="text-xl" onClick={handleClearClick}>AC</Button>
          <Button variant="outline" className="text-xl" onClick={handleToggleSign}>+/-</Button>
          <Button variant="outline" className="text-xl" onClick={handlePercent}>%</Button>
          <Button variant="default" className="text-xl bg-accent hover:bg-accent/90" onClick={() => handleOperatorClick('/')}>÷</Button>

          <Button variant="secondary" className="text-xl" onClick={() => handleDigitClick('7')}>7</Button>
          <Button variant="secondary" className="text-xl" onClick={() => handleDigitClick('8')}>8</Button>
          <Button variant="secondary" className="text-xl" onClick={() => handleDigitClick('9')}>9</Button>
          <Button variant="default" className="text-xl bg-accent hover:bg-accent/90" onClick={() => handleOperatorClick('*')}>×</Button>

          <Button variant="secondary" className="text-xl" onClick={() => handleDigitClick('4')}>4</Button>
          <Button variant="secondary" className="text-xl" onClick={() => handleDigitClick('5')}>5</Button>
          <Button variant="secondary" className="text-xl" onClick={() => handleDigitClick('6')}>6</Button>
          <Button variant="default" className="text-xl bg-accent hover:bg-accent/90" onClick={() => handleOperatorClick('-')}>−</Button>

          <Button variant="secondary" className="text-xl" onClick={() => handleDigitClick('1')}>1</Button>
          <Button variant="secondary" className="text-xl" onClick={() => handleDigitClick('2')}>2</Button>
          <Button variant="secondary" className="text-xl" onClick={() => handleDigitClick('3')}>3</Button>
          <Button variant="default" className="text-xl bg-accent hover:bg-accent/90" onClick={() => handleOperatorClick('+')}>+</Button>
          
          <Button variant="secondary" className="col-span-2 text-xl" onClick={() => handleDigitClick('0')}>0</Button>
          <Button variant="secondary" className="text-xl" onClick={handleDecimalClick}>.</Button>
          <Button variant="default" className="text-xl" onClick={handleEqualsClick}>=</Button>
        </div>
      </CardContent>
    </Card>
  );
}
