import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Practitioner, PractitionerService, ROLES } from 'front-end-common';
import { environment } from '../../../../environments/environment';
import { Subject } from 'rxjs/Rx';

const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_ENTER = 13;
const KEY_ESC = 27;

const HIGHLIGHT = 'highlight';

@Component({
  selector: 'app-practitioner-chooser',
  templateUrl: './practitioner-chooser.component.html',
  styleUrls: ['./practitioner-chooser.component.css']
})
export class PractitionerChooserComponent implements OnInit {

  @ViewChild('suggestionBox') sb: ElementRef;
  @ViewChild('suggestionList') sl: ElementRef;
  @ViewChild('inputText') inputElement: ElementRef;

  @Output() remove = new EventEmitter<Practitioner>();

  private _practitioner: Practitioner;

  @Input() set practitioner(value: any) {
    this._practitioner = value as Practitioner;
    this.selectedPractitioner = null;
  }

  get practitioner() {
    return this._practitioner;
  }

  @Input() fieldTitle: string;

  @Input() editable: boolean;

  @Output() setPractitioner = new EventEmitter<Practitioner>();

  @Input() role = ROLES.MEDIC;

  listening: boolean;

  loading: boolean;

  selectedSuggestion: number;

  selectedPractitioner: Practitioner;

  suggestions: Array<Practitioner>;

  searchDebouncer = new Subject<string>();

  private typeTimeout = 1000;

  constructor(private pService: PractitionerService, private eRef: ElementRef) {
    this.searchDebouncer
      .debounceTime(this.typeTimeout)
      .switchMap(term => this.keyPress(term))
      .subscribe(
        response => {
          this.loading = false;
          const suggestions = response['dtoList'];
          if (suggestions != null) {
            this.suggestions = suggestions.length > 5 ? suggestions.slice(0, 5) : suggestions;
          } else {
            this.suggestions = null;
          }
        },
        () => {
          this.loading = false;
        }
      );
  }

  ngOnInit() {
    this.listening = false;
    this.loading = false;
  }

  futureKeyPress(value: string) {
    this.selectedPractitioner = null;
    this.loading = true;
    this.searchDebouncer.next(value);
  }

  keyPress(value: string) {
    return this.pService.searchPractitioners(value.replace(/\s/g, ','), environment.his, true, this.role, 5);
  }

  inputFocus(): void {

    if (this.listening) {
      return;
    } else {
      this.listening = true;
    }

    this.selectedSuggestion = -1;

    const suggestionElement = (this.sb.nativeElement as HTMLDivElement);

    suggestionElement.style.display = 'block';

    const unregisterEventsNClose = () => {
      suggestionElement.style.display = 'none';
      window.removeEventListener('click', closeSuggestionBox);
      window.removeEventListener('keydown', verifyKey);
      if (this.selectedSuggestion !== -1) {
        const highlighted = (this.sl.nativeElement as HTMLUListElement).querySelector('li.highlight');
        if (highlighted != null) {
          highlighted.classList.remove('highlight');
        }
      }
      this.listening = false;
      (this.inputElement.nativeElement as HTMLInputElement).blur();
    };

    const closeSuggestionBox = (event: Event) => {
      const elem = event.target as HTMLElement;
      if (elem.tagName.toLowerCase() !== 'input' || this.checkToClose(elem)) {
        unregisterEventsNClose();
      }
    };

    const verifyKey = (event: KeyboardEvent) => {

      switch (event.keyCode) {
        case KEY_DOWN: this.highlightElement(this.selectedSuggestion + 1); break;
        case KEY_UP: this.highlightElement(this.selectedSuggestion - 1); break;
        case KEY_ENTER: this.selectElement(); unregisterEventsNClose(); break;
        case KEY_ESC: unregisterEventsNClose(); break;
        default: if (this.selectedSuggestion !== -1) {
          const listItem = (this.sl.nativeElement as HTMLUListElement).querySelector('li.highlight').classList.remove('highlight');
          this.selectedSuggestion = - 1;
        }
      }
    };

    window.addEventListener('click', closeSuggestionBox);
    window.addEventListener('keydown', verifyKey);
  }

  selectElement(): void {
    const input = this.inputElement.nativeElement as HTMLInputElement;
    const listItems = (this.sl.nativeElement as HTMLUListElement).querySelectorAll('li');
    if (listItems.length !== 0 && this.selectedSuggestion !== -1) {
      input.value = listItems[this.selectedSuggestion].innerHTML.trim();
      this.selectedPractitioner = this.suggestions[this.selectedSuggestion];
    }
  }

  highlightElement(index: number): void {
    const listItem = (this.sl.nativeElement as HTMLUListElement).querySelectorAll('li');
    if (listItem.length !== 0) {
      if (this.selectedSuggestion !== -1) {
        listItem[this.selectedSuggestion].classList.remove(HIGHLIGHT);
      }
      if (index !== -1 && index <= (listItem.length - 1) && index >= 0) {
        listItem[index].classList.add(HIGHLIGHT);
        this.selectedSuggestion = index;
      } else {
        listItem[this.selectedSuggestion].classList.add(HIGHLIGHT);
      }
    }
  }

  checkToClose(target: HTMLElement): boolean {
    return !this.eRef.nativeElement.contains(target);
  }

  selectLi(index: number) {
    this.selectedSuggestion = index;
    this.selectElement();
  }

  onSetPractitioner() {
    this.setPractitioner.emit(this.selectedPractitioner);
  }

  onRemove() {
    this.remove.emit(this._practitioner);
  }

}
