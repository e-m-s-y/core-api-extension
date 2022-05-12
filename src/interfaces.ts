export interface IOptions {
    enabled: boolean;
}

export interface IDelegate {
    publicKey: string;
    votes: string;
    rank: number;
}

export interface IDelegateRanking {
    round: string;
    delegates: IDelegate[];
}
