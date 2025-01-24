export interface Review {
  barberId: number;
  id: number;
  foglalasId: number;
  ertekeles: number;
  velemeny?: string;
  letrehozasIdopontja: string;
  ertekelo_neve?: string;
}

export interface ReviewSubmission {
  foglalasId: number;
  ertekeles: number;
  velemeny?: string;
}
