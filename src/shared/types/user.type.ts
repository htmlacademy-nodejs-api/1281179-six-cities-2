export enum UserType {
  DEFAULT = 'default',
  PRO = 'pro'
}

export type User = {
  name: string; // Имя. Обязательное. Мин. длина 1 символ, макс. длина 15 символов;
  email: string; // Электронная почта. Обязательное. Валидный адрес электронной почты;  В приложении не может быть двух пользователей с одинаковым email.
  photo?: string; // Аватар пользователя. Необязательное. Изображение пользователя в формате .jpg или .png;
  userType: UserType; // Тип пользователя. Обязательное. Возможные варианты: обычный, pro.
}

export type UserRequest = User & {
  password: string;
}

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  photo: string;
}
