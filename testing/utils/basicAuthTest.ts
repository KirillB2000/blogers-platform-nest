import { CoreConfig } from "../../src/core/core.config.js";

export class BasicAuthTest {

    constructor (
        private coreConfig: CoreConfig
    ) {}

    generateBasicAuthToken () {
        const credentials = `${this.coreConfig.adminUsername}:${this.coreConfig.adminPassword}`;

        const token = Buffer.from(credentials).toString("base64");

        return `Basic ${token}`;
    }
}