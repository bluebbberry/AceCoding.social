import { Injectable } from '@angular/core';
import { AceParserService } from './ace-parser.service';

@Injectable({
  providedIn: 'root'
})
export class AceRuntimeService {
  private variables: { [key: string]: number } = {};
  private eventHandlers: { [key: string]: (() => void)[] } = {};
  private elementRefs: { [label: string]: HTMLElement } = {};

  constructor() {
    this.startWatchLoop();
  }

  public execute(command: string, aceParser: AceParserService): void {
    console.log("Execute logical command: " + command);

    // Set variable
    const setMatch = command.match(/^Set (\w+) to (\d+)\.$/i);
    if (setMatch) {
      const [, name, value] = setMatch;
      this.variables[name] = parseInt(value, 10);
      return;
    }

    // Increment variable
    const incMatch = command.match(/^increment (\w+)\.?$/i);
    if (incMatch) {
      const [, name] = incMatch;
      if (!(name in this.variables)) this.variables[name] = 0;
      this.variables[name]++;
      return;
    }

    // Every X seconds do something
    const everyMatch = command.match(/^Every (\d+) seconds?, (.+)$/i);
    if (everyMatch) {
      const [, seconds, innerCmd] = everyMatch;
      setInterval(() => aceParser.parse(innerCmd), parseInt(seconds, 10) * 1000);
      return;
    }

    // Add button
    const btnMatch = command.match(/^A button labeled \"(.+?)\" is added\.?$/i);
    if (btnMatch) {
      const [, label] = btnMatch;
      this.addButton(label);
      return;
    }

    // On click
    const clickMatch = command.match(/^If the \"(.+?)\" button is clicked, (.+)$/i);
    if (clickMatch) {
      const [, label, action] = clickMatch;
      this.registerClickHandler(label, () => aceParser.parse(action));
      return;
    }

    // If condition
    const condMatch = command.match(/^If (\w+) (equals|is greater than|is less than) (\d+), (.+)$/i);
    if (condMatch) {
      const [, variable, operator, value, action] = condMatch;
      this.watchCondition(variable, operator, parseInt(value, 10), () => aceParser.parse(action));
      return;
    }

    // Repeat loop
    const repeatMatch = command.match(/^Repeat (\d+) times, (.+)$/i);
    if (repeatMatch) {
      const [, times, action] = repeatMatch;
      for (let i = 0; i < parseInt(times, 10); i++) {
        aceParser.parse(action);
      }
      return;
    }

    // Add text block fallback
    const textMatch = command.match(/^A text block saying \"(.+?)\" is added\.?$/i);
    if (textMatch) {
      const [, text] = textMatch;
      this.addTextBlock(text);
      return;
    }
  }

  private addButton(label: string): void {
    const button = document.createElement('button');
    button.innerText = label;
    button.style.margin = '10px';
    button.classList.add('retro-button');
    document.body.appendChild(button);
    this.elementRefs[label] = button;

    button.addEventListener('click', () => {
      const handlers = this.eventHandlers[label];
      if (handlers) handlers.forEach(fn => fn());
    });
  }

  private addTextBlock(text: string): void {
    const p = document.createElement('p');
    p.innerText = text;
    p.classList.add('retro-text');
    document.body.appendChild(p);
  }

  private registerClickHandler(label: string, callback: () => void): void {
    if (!this.eventHandlers[label]) this.eventHandlers[label] = [];
    this.eventHandlers[label].push(callback);
  }

  private watchCondition(
    variable: string,
    operator: string,
    value: number,
    callback: () => void
  ): void {
    const op = operator.toLowerCase();
    const condition = () => {
      const current = this.variables[variable] || 0;
      switch (op) {
        case 'equals': return current === value;
        case 'is greater than': return current > value;
        case 'is less than': return current < value;
      }
      return false;
    };
    const checker = () => {
      if (condition()) callback();
    };
    setInterval(checker, 500);
  }

  private startWatchLoop(): void {
    // Placeholder for more advanced reactivity
  }
}
