import { v4 as uuid4 } from 'uuid';
import { IMessage, IUser, RGB } from './interfaces';
import { rgbArrToHex } from './utils';


export const WHATSAPP_COLORS: RGB[] = [
  [37, 195, 97], // green
  [53, 152, 229], // blue
  [226, 106, 182], // pink
  [203, 144, 106], // sand
  [219, 163, 55], // beige
  [106, 129, 242] // purple
]

export const initialUser: IUser = {
  id: uuid4(),
  cellphone: '+5500123456789',
  color: '#000000',
}



export const initialMessage: IMessage = {
  id: uuid4(),
  contents: '',
  reactions: [],
  timestamp: new Date().toISOString(),
  userIndex: -1
}


const User1: IUser = {
  id: uuid4(),
  cellphone: '+5521987654321',
  savedName: 'Assessor de gabinete',
  picture: 'https://br.web.img3.acsta.net/pictures/18/07/25/22/08/5179819.jpg',
  color: rgbArrToHex(WHATSAPP_COLORS[0])
}

const User2: IUser = {
  id: uuid4(),
  cellphone: '+5521912345678',
  originalName: 'Político aleatório',
  picture: 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/95/02/75/20372972.jpg',
  color: rgbArrToHex(WHATSAPP_COLORS[1])
}

const Message1: IMessage = {
  id: uuid4(),
  contents: 'Chefe, perdi a cópia do projeto de lei que será votado semana que vem.',
  reactions: [],
  timestamp: new Date().toISOString(),
  userIndex: 0
}

const Message2: IMessage = {
  id: uuid4(),
  contents: 'Sabe o que significa né?',
  reactions: [],
  timestamp: new Date().toISOString(),
  userIndex: 1,
  mentionIndex: 0
}

const Message3: IMessage = {
  id: uuid4(),
  contents: 'Não, o quê?',
  reactions: [],
  timestamp: new Date().toISOString(),
  userIndex: 0,
  mentionIndex: 1
}

const Message4: IMessage = {
  id: uuid4(),
  contents: 'Que você tem uma semana pra achar isso kkk',
  reactions: [],
  timestamp: new Date().toISOString(),
  userIndex: 1,
  mentionIndex: 2
}

export const USERS = [
  User1,
  User2
]

export const MESSAGES = [
  Message1,
  Message2,
  Message3,
  Message4
]