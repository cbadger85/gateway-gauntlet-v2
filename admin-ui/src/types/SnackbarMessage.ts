export interface SnackbarMessage {
  id: string;
  message: string;
  severity: SnackbarMessageSeverity;
}

export type SnackbarMessageSeverity = 'error' | 'warning' | 'info' | 'success';
