import { Providers } from "@arkecosystem/core-kernel";

import { DelegateRankingController } from "./controllers/delegate-ranking";
import { IOptions } from "./interfaces";
import { Plugin } from "./service";

export class ServiceProvider extends Providers.ServiceProvider {
    public async register(): Promise<void> {
        const symbol = Symbol.for(Plugin.ID);

        this.app.bind<Plugin>(symbol).to(Plugin).inSingletonScope();
        this.app
            .bind<DelegateRankingController>(DelegateRankingController.ID)
            .to(DelegateRankingController)
            .inSingletonScope();

        const options = this.config().all() as unknown as IOptions;

        this.app.get<Plugin>(symbol).register(options);
    }

    public async bootWhen(): Promise<boolean> {
        return !!this.config().get("enabled");
    }
}
