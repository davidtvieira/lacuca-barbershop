export class ApplicationError {
  errorMessage: string;
  errorHttpCode: number;

  constructor(errorMessage: string, errorHttpCode: number) {
    (this.errorMessage = errorMessage), (this.errorHttpCode = errorHttpCode);
  }
}
