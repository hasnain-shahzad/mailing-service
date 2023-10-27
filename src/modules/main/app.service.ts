import { Injectable } from "@nestjs/common";
import { NodeEnv } from "../../utils/enums";
@Injectable()
export class AppService {
    constructor() { }

    /**
     * Configures The App Environment
     * @returns
     */
    static envConfiguration(): string {
        switch (process.env.NODE_ENV) {
            case NodeEnv.TEST:
                return `_${NodeEnv.TEST}.env`;

            default:
                return `.env`;
        }
    }
}
