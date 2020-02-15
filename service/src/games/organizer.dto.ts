class Organizer {
  constructor({ id, name, email }: Organizer) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  id: string;
  name: string;
  email: string;
}

export default Organizer;
