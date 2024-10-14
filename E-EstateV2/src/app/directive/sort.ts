export class Sort {
  private sortOrder = 1

  constructor() { }

  public startSort(property: any, order: any) {
    this.sortOrder = order === 'desc' ? -1 : 1
    return (a: any, b: any) => {
      return a[property] < b[property] ? -1 * this.sortOrder : 1 * this.sortOrder
    };
  }
}