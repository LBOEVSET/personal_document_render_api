export class InmateDetailDto {
  age: string;
  nationality: string;
  religion: string;
  holdType: string;
  holdAgency: string;
}

export class InmateProfileDto {
  id: string;
  name: string;
  status: string;
  daysLeft: number;
  totalDays: number;
  cases: number;
  caseType: string;
  sentence: string;
  startDate: string;
  transferFrom: string;
  releaseDate: string;
  progressStep: number;

  detail: InmateDetailDto;
}
