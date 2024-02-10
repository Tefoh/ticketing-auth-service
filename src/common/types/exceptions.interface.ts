export interface HttpExceptionResponseType {
  message: string;
  status: number;
  errors?: {
    [key: string]: string[];
  };
}
