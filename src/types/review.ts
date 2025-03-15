export interface Review {
  id?: number;
  barberId: number;
  ertekeles: number;
  velemeny: string;
  letrehozasIdopontja: string;
  ertekelo_neve: string;
  szolgaltatas_neve: string;
}

export interface ReviewSubmission {
  token: string;
  rating: number;
  comment?: string;
}
