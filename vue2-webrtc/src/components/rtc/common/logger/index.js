
import {LogLevelType, LogContext, getLogPrefix} from './logger-utils';

let currentLogLevel = LogLevelType.LOG_LEVEL_DEBUG;

const logger = {
  debug(...args) {
    if (currentLogLevel <= LogLevelType.LOG_LEVEL_DEBUG) {
      console.debug(`${getLogPrefix(LogContext.RTC)}`, ...args);
    }
  },
  log(...args) {
    if (currentLogLevel <= LogLevelType.LOG_LEVEL_LOG) {
      console.log(`${getLogPrefix(LogContext.RTC)}`, ...args);
    }
  },
  info(...args) {
    if (currentLogLevel <= LogLevelType.LOG_LEVEL_INFO) {
      console.info(`${getLogPrefix(LogContext.RTC)}`, ...args);
    }
  },
  warn(...args) {
    if (currentLogLevel <= LogLevelType.LOG_LEVEL_WARN) {
      console.warn(`${getLogPrefix(LogContext.RTC)}`, ...args);
    }
  },
  error(...args) {
    if (currentLogLevel <= LogLevelType.LOG_LEVEL_ERROR) {
      console.error(`${getLogPrefix(LogContext.RTC)}`, ...args);
    }
  },
  setLevel(newLevel) {
    if (
      newLevel >= LogLevelType.LOG_LEVEL_DEBUG &&
      newLevel <= LogLevelType.LOG_LEVEL_NON_LOGGING
    ) {
      console.log(
        `${getLogPrefix(
          LogContext.RTC,
        )} set log level from ${currentLogLevel} to ${newLevel}`,
      );
      currentLogLevel = newLevel;
    } else {
      console.error(
        `${getLogPrefix(
          LogContext.RTC,
        )} logger.setLevel() invalid params:${newLevel}`,
      );
    }
  },
  getLevel() {
    return currentLogLevel;
  },
};

export default logger;
