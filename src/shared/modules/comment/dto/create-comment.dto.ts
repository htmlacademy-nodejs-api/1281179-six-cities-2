export class CreateCommentDto {
  public text: string;
  public offerId: string;
  // TODO: убрать после добавления авторизации
  public userId: string;
  // Используется сущностью и сервисом
  public authorId: string;
}
