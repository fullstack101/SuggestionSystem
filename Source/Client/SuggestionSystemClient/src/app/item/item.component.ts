import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { SuggestionboxaubgApiService } from '../services/suggestionboxaubg-api.service.ts';
import { Suggestion } from "../models/suggestion";
import { Comment } from '../models/comment';

@Component({
  selector: 'item',
  templateUrl: './item.component.html'
})

export class ItemComponent implements OnInit {
  @Input() item: Suggestion;
  @Output() onDeleted = new EventEmitter();
  panelColor: string;
  comments: Comment[];
  numberOfCommentsToGet: number;
  commentContent: string;
  colors: string[];
  statuses: string[];

  constructor(private _suggestionBoxAubgApiService:SuggestionboxaubgApiService) {}

  ngOnInit() {
    this.colors = ["warning", "primary", "default", "success", "danger"];
    this.statuses = ["WaitingForApproval", "Approved", "NotApproved", "Accepted", "Rejected"];
    this.panelColor = this.colors[this.item.Status];
    this.numberOfCommentsToGet = 5;
    this.comments = [];
  }

  getComments() {
    this._suggestionBoxAubgApiService.fetchComments(this.item.Id, this.comments.length, this.numberOfCommentsToGet)
    .subscribe(
      items => {
        for(var i=0; i < items.length; i++)
          this.comments.push(items[i])
      },
      error => console.log("Error fetching comments!")
    );
  }

  hideComments() {
    this.comments = [];
  }

  postComment() {
    this._suggestionBoxAubgApiService.postComment(this.item.Id, this.commentContent)
    .subscribe(
      item => {
        this.comments.splice(0, 0, item);
        this.item.CommentsCount += 1;
        this.commentContent = "";
      },
      error => console.log("Error posting a comment!")
    )
  }

  vote(voteType){
    this._suggestionBoxAubgApiService.vote(this.item.Id, voteType)
      .subscribe(
        items => {
          this.item.UpVotesCount = items.UpVotesCount;
          this.item.DownVotesCount = items.DownVotesCount;
        },
        error => console.log("Error voting for a suggestion")
      )
  }

  ChangeStatus(status) {
    this._suggestionBoxAubgApiService.ChangeStatus(this.item.Id, status)
        .subscribe(
            items => {
              this.item.Status = items.Status;
              this.panelColor = this.colors[this.item.Status];
            },
            error => console.log("Error changing status for a suggestion")
        )
  }

  delete() {
    this._suggestionBoxAubgApiService.deleteSuggestion(this.item.Id)
      .subscribe(
        items => {
          console.log(items);
          this.onDeleted.emit();
        },
        error => console.log(error))
  }
}
