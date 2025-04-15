import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AceParserService {

  constructor() {}

  parse(aceCode: string): void {
    try {
      const lines = aceCode.split('\n').map(line => line.trim()).filter(Boolean);

      for (let line of lines) {
        this.applyAceCommand(line);
      }
    } catch (error) {
      alert("Syntax error (commands must be valid attempto controlled english - ace)");
    }
  }

  private applyAceCommand(command: string): void {
    // Example ACE-style commands and their effects:
    // "The background color is blue."
    // "The text color of the buttons is yellow."
    // "The font size of the headers is 24 pixels."

    const regex = /The (\w+(?: \w+)*) is (.+)\./i;
    const match = command.match(regex);

    if (match) {
      const property = match[1].toLowerCase().replace(/ /g, '-');
      const value = match[2];

      console.log(`Parsed: ${property} -> ${value}`);

      this.applyStyle(property, value);
    } else {
      throw new Error(`Unknown command ${command}`);
    }
  }

  private applyStyle(property: string, value: string): void {
    // For simplicity, apply styles to body or global elements.
    const body = document.body;

    // Mapping examples
    if (property === 'background-color') {
      body.style.backgroundColor = value;
    } else if (property === 'text-color-of-the-buttons') {
      document.querySelectorAll('button').forEach(btn => {
        (btn as HTMLElement).style.color = value;
      });
    } else if (property === 'font-size-of-the-headers') {
      document.querySelectorAll('h1, h2, h3').forEach(header => {
        (header as HTMLElement).style.fontSize = value;
      });
    } else {
      console.warn(`Unknown ACE command: ${property}`);
    }
  }
}
