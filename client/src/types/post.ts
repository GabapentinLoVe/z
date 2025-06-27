export type Post = {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    nickname: string;
    role: string;
  };
  type: 'Контент' | 'Событие' | 'Вакансия';
  direction: string;
  likes: number;
  isLikedByUser: boolean;
  previewImage?: string;
  createdAt: string;
  updatedAt: string;
}; 