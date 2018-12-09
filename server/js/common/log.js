module.exports = {
    info(message) {
		console.log(`[${new Date()}] [INFO] [${message}]`);
	},

    warn(message) {
		console.log(`[${new Date()}] [WARN] [${message}]`);
	},

    error(message) {
		console.log(`[${new Date()}] [ERROR] [${message}]`);
	}
}