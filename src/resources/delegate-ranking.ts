import { Contracts as ApiContracts } from "@arkecosystem/core-api";
import { Container, Contracts as KernelContracts } from "@arkecosystem/core-kernel";

import { IDelegateRanking } from "../interfaces";

@Container.injectable()
export class DelegateRankingResource implements ApiContracts.Resource {
    @Container.inject(Container.Identifiers.WalletRepository)
    @Container.tagged("state", "blockchain")
    private readonly walletRepository!: KernelContracts.State.WalletRepository;

    public raw(resource: object): object {
        return resource;
    }

    public transform(resource: IDelegateRanking): object {
        const data: any = resource;

        for (const delegate of data.delegates) {
            delegate.username = this.walletRepository
                .findByPublicKey(delegate.publicKey)
                .getAttribute("delegate.username");
        }

        return resource;
    }
}
