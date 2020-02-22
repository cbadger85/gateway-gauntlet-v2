export interface Organizer {
  id: string;
  name: string;
  email: string;
}

export interface Player {
  id: string;
  name: string;
  itsName: string;
  itsPin: string;
  email: string;
  city: string;
  state: string;
  paid: boolean;
  attending: boolean;
  shortCode: string;
}

export interface Game {
  id: string;
  name: string;
  date: string;
  length: number;
  organizers: Organizer[];
  players: Player[];
  missions: string[];
}
