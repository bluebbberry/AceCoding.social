import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {StatusComponent} from "../status/status.component";
import {MicroblogService} from "../../services/microblog.service";
import {AceParserService} from "../../services/ace-parser.service";

@Component({
  selector: 'app-semantic-feed',
  standalone: true,
    imports: [
        NgForOf,
        StatusComponent
    ],
  templateUrl: './semantic-feed.component.html',
  styleUrl: './semantic-feed.component.scss'
})
export class SemanticFeedComponent {
  code: string = "The app has two tabs.\n" +
    "With the first tab the user is able to post to Mastodon.\n" +
    "With the second tab the user is able to code with ACE.";
  constructor(protected microblogService: MicroblogService, protected aceParser: AceParserService) {}

  clickedOnReload() {
    this.microblogService.semanticStatuses = undefined;
    // this.microblogService.fetchSemanticStatuses();
  }

  clickedRun() {
    console.log("Clicked on run with code '" + this.code + "'");
    if (this.code) {
      this.aceParser.parse(this.code);
    } else {
      alert("No code to run.");
    }
  }

  changedCode($event: any) {
    this.code = $event.target.value;
  }
}
