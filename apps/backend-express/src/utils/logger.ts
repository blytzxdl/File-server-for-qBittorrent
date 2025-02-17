import { join } from 'path'
import paths from './envPath'
import logForjs from 'log4js'
const { configure, getLogger, shutdown } = logForjs
const config = {
    appenders: {
        console: {
            type: 'console',
        },
        trace: {
            type: 'file',
            filename: join(paths.log, 'access.log'),
            'maxLogSize ': 31457280,
        },
        http: {
            type: 'logLevelFilter',
            appender: 'trace',
            level: 'trace',
            maxLevel: 'trace',
        },
        info: {
            type: 'dateFile',
            filename: join(paths.log, 'app-info.log'),
            pattern: '.yyyy-MM-dd',
            layout: {
                type: 'pattern',
                pattern: '[%d{ISO8601}][%5p %z %c] %m',
            },
            compress: true,
        },
        maxInfo: {
            type: 'logLevelFilter',
            appender: 'info',
            level: 'debug',
            maxLevel: 'info',
        },
        error: {
            type: 'dateFile',
            filename: join(paths.log, 'app-error.log'),
            pattern: '.yyyy-MM-dd',
            layout: {
                type: 'pattern',
                pattern: '[%d{ISO8601}][%5p %z %c] %m',
            },
            compress: true,
        },
        minError: {
            type: 'logLevelFilter',
            appender: 'error',
            level: 'error',
        },
        transcode: {
            type: 'dateFile',
            filename: join(paths.log, 'transcode.log'),
            pattern: '.yyyy-MM-dd',
            layout: {
                type: 'pattern',
                pattern: '[%d{ISO8601}][%5p %z %c] %m',
            },
            compress: true,
        },
        scrape: {
            type: 'dateFile',
            filename: join(paths.log, 'scrape.log'),
            pattern: '.yyyy-MM-dd',
            layout: {
                type: 'pattern',
                pattern: '[%d{ISO8601}][%5p %z %c] %m',
            },
            compress: true,
        },
        client: {
            type: 'dateFile',
            filename: join(paths.log, 'client.log'),
            pattern: '.yyyy-MM-dd',
            layout: {
                type: 'pattern',
                pattern: '[%d{ISO8601}][%5p %z %c] %m',
            },
            compress: true,
        },
    },
    categories: {
        default: {
            appenders: ['console', 'maxInfo', 'minError'],
            level: 'info',
        },
        http: {
            appenders: ['http'],
            level: 'all',
        },
        transcode: {
            appenders: ['transcode'],
            level: 'info',
        },
        scrape: {
            appenders: ['scrape', 'console'],
            level: 'info',
        },
        client: {
            appenders: ['client', 'console'],
            level: 'info',
        },
    },
}
export const log4js = configure(config)

export const logger = getLogger('default')
export const transcodeLogger = getLogger('transcode')
export const scrapeLogger = getLogger('scrape')
export const httpLogger = getLogger('http')
export const clientLogger = getLogger('client')
export const changeLevel = async (debug = false) => {
    const cat = config.categories
    for (const key in cat) {
        if (['default', 'transcode', 'scrape'].includes(key)) {
            if (debug === false) {
                cat[key].level = 'info'
            } else if (debug === true) {
                cat[key].level = 'debug'
            }
        }
    }
    configure(config)
    logger.info('changeLevel~~~~~~~~~~~~~~~~~~~~~~~~~~debug=' + debug)
}
export const syncLogger = {
    socket: undefined,
    init(socket) {
        this.socket = socket
    },
    info(...args) {
        if (this.socket) {
            this.socket.emit('log', args.join(' '))
        }
        return logger.info(args)
    },
    debug(...args) {
        if (this.socket) {
            this.socket.emit('log', args.join(' '))
        }
        return logger.debug(args)
    },
}
