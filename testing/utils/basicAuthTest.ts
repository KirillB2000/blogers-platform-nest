export class BasicAuthTest {
    private ADMIN_USERNAME = process.env.ADMIN_USERNAME
    private ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

    constructor () {}

    generateBasicAuthToken () {
        const credentials = `${this.ADMIN_USERNAME}:${this.ADMIN_PASSWORD}`;

        const token = Buffer.from(credentials).toString("base64");

        return `Basic ${token}`;
    }
}