export interface AuthSession {
  authenticated: number;
  character: number;
  corporation: number;

  // From session plugin
  isChanged?: boolean;
  isNew?: boolean;
  isPopulated?: boolean;
}
