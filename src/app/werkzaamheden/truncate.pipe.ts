import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, words: number): string {
    if (!value) return '';

    const wordsArray = value.split(' ');
    const truncatedWords = wordsArray.slice(0, words);

    return truncatedWords.join(' ') + (wordsArray.length > words ? '...' : '');
  }
}
