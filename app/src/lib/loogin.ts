type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function emit(level: LogLevel, message: string, payload?: unknown) {
  // eslint-disable-next-line no-console
  console[level](`[loogin:${level}] ${message}`, payload ?? '');
}

export const loog = {
  info(message: string, payload?: unknown) {
    emit('info', message, payload);
  },
  warn(message: string, payload?: unknown) {
    emit('warn', message, payload);
  },
  error(message: string, payload?: unknown) {
    emit('error', message, payload);
  },
  debug(message: string, payload?: unknown) {
    emit('debug', message, payload);
  },
};


