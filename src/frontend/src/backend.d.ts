import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QueryFeedbackRequest {
    sortBy?: SortBy;
    reverseOrder: boolean;
    limit: bigint;
    filter?: {
        minAge?: bigint;
        maxAge?: bigint;
        dateRange?: {
            startTime?: Time;
            endTime?: Time;
        };
    };
}
export type Time = bigint;
export interface FeedbackEntry {
    age: bigint;
    feelings: string;
    country: string;
    name: string;
    team: string;
    timestamp: Time;
    thoughts: string;
}
export enum SortBy {
    age = "age",
    name = "name",
    timestamp = "timestamp"
}
export interface backendInterface {
    deleteFeedbackWithPassword(index: bigint, password: string): Promise<void>;
    getAllFeedback(): Promise<Array<FeedbackEntry>>;
    getCurrentTime(): Promise<Time>;
    getFeedbackStats(): Promise<{
        totalEntries: bigint;
        averageAge?: bigint;
        uniqueUsers: bigint;
    }>;
    getFeedbackSummary(limit: bigint): Promise<Array<FeedbackEntry>>;
    isConnected(): Promise<boolean>;
    queryFeedback(request: QueryFeedbackRequest): Promise<Array<FeedbackEntry>>;
    searchFeedback(searchTerm: string, limit: bigint): Promise<Array<FeedbackEntry>>;
    submitFeedback(name: string, age: bigint, country: string, team: string, thoughts: string, feelings: string): Promise<void>;
    updateFeedbackWithPassword(index: bigint, newEntry: FeedbackEntry, password: string): Promise<void>;
}
