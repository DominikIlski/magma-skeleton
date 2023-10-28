export class NoResultError extends Error {
  constructor(message: string = 'No result found') {
    super(message);
    this.name = 'NoResultError';
  }
}
