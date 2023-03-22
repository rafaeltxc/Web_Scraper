import { objPattern } from '../scrap';

export function isInTheList(element: objPattern, compareList: string[]): boolean {
  for (let i = 0; i < compareList.length; i++) {
    if (element.shop?.toLowerCase().includes(compareList[i])) {
      return true;
    }
  }
  return false;
}
