import { Controller } from "@arkecosystem/core-api";
import { DatabaseService, Repositories } from "@arkecosystem/core-database";
import { Container, Contracts, Utils } from "@arkecosystem/core-kernel";
import Boom from "@hapi/boom";
import Hapi from "@hapi/hapi";

import { defaults } from "../defaults";
import { IDelegateRanking } from "../interfaces";
import { DelegateRankingResource } from "../resources/delegate-ranking";

@Container.injectable()
export class DelegateRankingController extends Controller {
    public static readonly ID: string = "@foly/core-api-extension/delegate-ranking-controller";
    public static readonly PATH: string = "/delegates/ranking";

    @Container.inject(Container.Identifiers.DatabaseService)
    private readonly databaseService!: DatabaseService;

    @Container.inject(Container.Identifiers.DatabaseRoundRepository)
    private readonly roundRepository!: Repositories.RoundRepository;

    private maxAmountOfRounds: number = defaults.maxAmountOfRounds;

    public async index(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<object | Boom.Boom> {
        const lastBlock = await this.databaseService.findLatestBlock();

        if (!lastBlock) {
            return Boom.notFound("Round not found");
        }

        const lastRound: Contracts.Shared.RoundInfo = Utils.roundCalculator.calculateRound(lastBlock.height);
        const lastRoundHistory = await this.getRoundHistory(lastRound.round.toString());

        if (lastRound.round === 1) {
            return Boom.serverUnavailable("Round 1 is currently not yet completed, try again later");
        }

        if (!lastRoundHistory) {
            return Boom.serverUnavailable("Could not determine history for last round " + lastRound.roundHeight);
        }

        const histories = [lastRoundHistory];
        let index = 1;

        while (histories.length < this.maxAmountOfRounds) {
            const nextRound = lastRound.round - index;

            if (nextRound <= 0) {
                break;
            }

            const history = await this.getRoundHistory(nextRound.toString());

            if (history !== null) {
                histories.push(history);
            }

            index++;
        }

        return this.respondWithCollection(histories, DelegateRankingResource);
    }

    public setMaxAmountOfRounds(amount: number): DelegateRankingController {
        if (amount <= 0) {
            throw new Error("The max amount of rounds must be greater than 0");
        }

        this.maxAmountOfRounds = amount;

        return this;
    }

    private async getRoundHistory(roundId: string): Promise<IDelegateRanking | null> {
        const rounds = await this.roundRepository.findById(roundId);

        if (rounds.length === 0) {
            return null;
        }

        const roundHistory: IDelegateRanking = {
            round: rounds[0].round.toFixed(),
            delegates: [],
        };

        const delegates = await this.roundRepository.findById(roundId);

        delegates.sort((a, b) => {
            const voteBalanceA: Utils.BigNumber = a.balance;
            const voteBalanceB: Utils.BigNumber = b.balance;

            const diff = voteBalanceB.comparedTo(voteBalanceA);

            if (diff === 0) {
                if (a.publicKey === b.publicKey) {
                    throw new Error(
                        `The balance and public key of both delegates are identical! ` +
                            `Delegate "${a.publicKey}" appears twice in the list.`,
                    );
                }

                return a.publicKey!.localeCompare(b.publicKey!, "en");
            }

            return diff;
        });

        for (let i = 0; i < delegates.length; i++) {
            roundHistory.delegates.push({
                publicKey: delegates[i].publicKey,
                rank: i + 1,
                votes: delegates[i].balance.toFixed(),
            });
        }

        return roundHistory;
    }
}
