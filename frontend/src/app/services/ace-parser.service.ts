import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AceParserService {
  private renderer: Renderer2;
  private imageSize: string = '150px';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  parse(aceCode: string): void {
    const lines = aceCode.split('\n').map(line => line.trim()).filter(Boolean);
    for (let line of lines) {
      this.handleCommand(line);
    }
  }

  private handleCommand(command: string): void {
    const imageMatch = command.match(/^An image with the URL "(.+?)" is added(?: to the (.+))?\.$/i);
    if (imageMatch) {
      const [, url, location] = imageMatch;
      this.addImage(url, location);
      return;
    }

    const textMatch = command.match(/^A text block saying "(.+?)" is added(?: to the (.+))?\.$/i);
    if (textMatch) {
      const [, text, location] = textMatch;
      this.addTextBlock(text, location);
      return;
    }

    const imageSizeMatch = command.match(/^The size of the images is (.+)\.$/i);
    if (imageSizeMatch) {
      this.imageSize = imageSizeMatch[1];
      return;
    }

    const textColorMatch = command.match(/^The text color of the text blocks is (.+)\.$/i);
    if (textColorMatch) {
      this.setTextColor(textColorMatch[1]);
      return;
    }

    const textBgMatch = command.match(/^The background of the text blocks is (.+)\.$/i);
    if (textBgMatch) {
      this.setTextBackground(textBgMatch[1]);
      return;
    }

    const bgColorMatch = command.match(/^The background color is (.+)\.$/i);
    if (bgColorMatch) {
      document.body.style.backgroundColor = bgColorMatch[1];
      return;
    }

    const botMatch = command.match(/^There is a bot that posts "(.+?)" every (\d+) seconds\.$/i);
    if (botMatch) {
      const [, message, seconds] = botMatch;
      this.createBot(message, parseInt(seconds, 10));
      return;
    }

    console.warn(`Unrecognized ACE command: "${command}"`);
    alert("Syntax error - You are only able to code in valid ace (attempto controlled english)");
  }

  private getTargetElement(location?: string): HTMLElement {
    if (!location) return document.querySelector('.content-area') || document.body;

    const selectorMap: { [key: string]: string } = {
      'footer': 'footer',
      'header': '.feed-header',
      'main': 'main',
      'sidebar': '.sidebar-container',
      'left panel': '.sidebar-left',
      'right panel': '.sidebar-right',
      'content': '.content-area',
      'feed': '#main-feed',
    };

    const selector = selectorMap[location.toLowerCase()];
    const element = selector ? document.querySelector(selector) : null;

    return element as HTMLElement || document.body;
  }

  private addImage(url: string, location?: string): void {
    const img = this.renderer.createElement('img');
    this.renderer.setAttribute(img, 'src', url);
    this.renderer.setStyle(img, 'width', this.imageSize);
    this.renderer.setStyle(img, 'height', 'auto');
    this.renderer.setStyle(img, 'margin', '10px');
    this.renderer.setStyle(img, 'border', '4px groove cyan');
    this.renderer.setStyle(img, 'box-shadow', '4px 4px 0 magenta');

    const container = this.getTargetElement(location);
    this.renderer.appendChild(container, img);
  }

  private addTextBlock(text: string, location?: string): void {
    const p = this.renderer.createElement('p');
    this.renderer.setProperty(p, 'innerText', text);
    this.renderer.addClass(p, 'retro-text');

    const container = this.getTargetElement(location);
    this.renderer.appendChild(container, p);
  }

  private setTextColor(color: string): void {
    const elements = document.querySelectorAll('.retro-text');
    elements.forEach(el => (el as HTMLElement).style.color = color);
  }

  private setTextBackground(color: string): void {
    const elements = document.querySelectorAll('.retro-text');
    elements.forEach(el => (el as HTMLElement).style.backgroundColor = color);
  }

  private createBot(message: string, intervalSec: number): void {
    const post = () => {
      const p = this.renderer.createElement('p');
      this.renderer.setProperty(p, 'innerText', `[🤖 Bot] ${message}`);
      this.renderer.addClass(p, 'retro-text');
      this.renderer.setStyle(p, 'font-weight', 'bold');
      this.renderer.setStyle(p, 'color', 'purple');
      this.renderer.setStyle(p, 'text-shadow', '1px 1px #fff');
  
      const container = document.querySelector('.content-area') || document.body;
      this.renderer.appendChild(container, p);
    };
  
    post(); // Initial post
    setInterval(post, intervalSec * 1000);
  }
}
