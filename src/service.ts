import Hapi from "@hapi/hapi";
import { Identifiers, Server } from "@solar-network/core-api";
import { Container, Contracts, Providers } from "@solar-network/core-kernel";

import { DelegateRankingController } from "./controllers/delegate-ranking";

@Container.injectable()
export class Plugin {
    public static readonly ID = "@foly/core-api-extension";

    @Container.inject(Container.Identifiers.LogService)
    private readonly log!: Contracts.Kernel.Logger;

    @Container.tagged("plugin", Plugin.ID)
    @Container.inject(Container.Identifiers.Application)
    private readonly app!: Contracts.Kernel.Application;

    @Container.inject(Container.Identifiers.PluginConfiguration)
    @Container.tagged("plugin", "@solar-network/core-api")
    protected readonly apiConfiguration!: Providers.PluginConfiguration;

    public async register(): Promise<void> {
        this.log.info(`[${Plugin.ID}] Registering plugin...`);

        const servers: Server[] = [];

        if (this.apiConfiguration.get("server.http.enabled")) {
            servers.push(this.app.get<Server>(Identifiers.HTTP));
        }

        if (this.apiConfiguration.get("server.https.enabled")) {
            servers.push(this.app.get<Server>(Identifiers.HTTPS));
        }

        if (servers.length === 0) {
            this.log.error("Core API is disabled, aborting...");
            return;
        }

        const controller = this.app.get<DelegateRankingController>(DelegateRankingController.ID);

        for (const server of servers) {
            await server.route({
                method: "GET",
                path: this.apiConfiguration.get("options.basePath") + DelegateRankingController.PATH,
                handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => controller.index(request, h),
            });
        }

        this.log.info(`[${Plugin.ID}] Controllers registered, waiting for API to boot...`);
    }
}
