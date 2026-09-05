/**
 * Global Frontend Types Entrypoint.
 */

export * from './backend';

export type EngineLifecycleState =
  | 'IDLE'
  | 'PLAYING'
  | 'EVALUATING'
  | 'WON'
  | 'FAILED';

export interface StandardPuzzleProps<TInitialState = unknown, TTelemetry = unknown> {
  puzzleId: string;
  initialState?: TInitialState;
  onGuessSubmit: (guess: string) => Promise<TTelemetry>;
  onStateChange?: (state: EngineLifecycleState) => void;
  disabled?: boolean;
}
