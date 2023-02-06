export default class Logger {
    private constructor() { };

    private static logout(...args: any[]) {
        const nowTime = new Date();
        console.log(`[ ${nowTime.getFullYear()}-${nowTime.getMonth() + 1}-${nowTime.getDate()} ${nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()} ]`, ...args);
    }

    static error(...args: any[]) {
        this.logout("[ error ]", ...args);
    }

    static warning(...args: any[]) {
        this.logout("[ warning ]", ...args);
    }

    static info(...args: any[]) {
        this.logout("[ info ]", ...args);
    }

    static dev(...args: any[]) {
        this.logout("[ dev ]", ...args);
    }
}