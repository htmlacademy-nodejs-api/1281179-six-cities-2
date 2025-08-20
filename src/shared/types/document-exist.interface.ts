export interface DocumentExist {
  exists(documentId: string): Promise<boolean>;
}
