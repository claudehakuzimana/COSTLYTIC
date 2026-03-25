import morgan from 'morgan';
import logger from '../utils/logger.js';

const stream = {
  write: (message) => logger.info(message.trim())
};

export const requestLogger = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  { stream }
);

export default requestLogger;
