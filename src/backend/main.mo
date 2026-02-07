import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Order "mo:core/Order";

import Runtime "mo:core/Runtime";


actor {
  type FeedbackEntry = {
    name : Text;
    age : Nat;
    country : Text;
    team : Text;
    thoughts : Text;
    feelings : Text;
    timestamp : Time.Time;
  };

  var entryCount = 0;
  let feedbackMap = Map.empty<Nat, FeedbackEntry>();

  public shared ({ caller }) func submitFeedback(
    name : Text,
    age : Nat,
    country : Text,
    team : Text,
    thoughts : Text,
    feelings : Text,
  ) : async () {
    let newEntry : FeedbackEntry = {
      name;
      age;
      country;
      team;
      thoughts;
      feelings;
      timestamp = Time.now();
    };

    feedbackMap.add(entryCount, newEntry);
    entryCount += 1;
  };

  type QueryFeedbackRequest = {
    limit : Nat;
    reverseOrder : Bool;
    sortBy : ?SortBy;
    filter : ?{
      minAge : ?Nat;
      maxAge : ?Nat;
      dateRange : ?{
        startTime : ?Time.Time;
        endTime : ?Time.Time;
      };
    };
  };

  type SortBy = {
    #name;
    #age;
    #timestamp;
  };

  public query ({ caller }) func getAllFeedback() : async [FeedbackEntry] {
    feedbackMap.values().toArray();
  };

  public shared ({ caller }) func queryFeedback(request : QueryFeedbackRequest) : async [FeedbackEntry] {
    func passFilter(entry : FeedbackEntry) : Bool {
      switch (request.filter) {
        case (?filter) {
          func checkAgeRange() : Bool {
            switch (filter.minAge) {
              case (?minAge) { if (entry.age < minAge) { return false } };
              case (_) {};
            };
            switch (filter.maxAge) {
              case (?maxAge) { if (entry.age > maxAge) { return false } };
              case (_) {};
            };
            true;
          };

          func checkDateRange() : Bool {
            switch (filter.dateRange) {
              case (?range) {
                switch (range.startTime) {
                  case (?startTime) {
                    if (entry.timestamp < startTime) { return false };
                  };
                  case (null) {};
                };
                switch (range.endTime) {
                  case (?endTime) {
                    if (entry.timestamp > endTime) { return false };
                  };
                  case (null) {};
                };
              };
              case (null) {};
            };
            true;
          };
          checkAgeRange() and checkDateRange();
        };
        case (null) { true };
      };
    };

    func compareEntries(entry1 : FeedbackEntry, entry2 : FeedbackEntry) : Order.Order {
      switch (request.sortBy) {
        case (?sortBy) {
          switch (sortBy) {
            case (#name) { Text.compare(entry1.name, entry2.name) };
            case (#age) { Nat.compare(entry1.age, entry2.age) };
            case (#timestamp) {
              Int.compare(entry1.timestamp, entry2.timestamp);
            };
          };
        };
        case (null) { Int.compare(entry1.timestamp, entry2.timestamp) };
      };
    };

    let filteredArray = feedbackMap.values().toArray().filter(passFilter);

    let sortedArray = filteredArray.sort(compareEntries);

    if (request.reverseOrder) {
      let reversedArray = Array.tabulate(
        sortedArray.size(),
        func(i) {
          sortedArray[sortedArray.size() - 1 - i];
        },
      );
      let minSize = if (reversedArray.size() < request.limit) { reversedArray.size() } else { request.limit };
      return reversedArray.sliceToArray(0, minSize);
    } else {
      let minSize = if (sortedArray.size() < request.limit) { sortedArray.size() } else { request.limit };
      return sortedArray.sliceToArray(0, minSize);
    };
  };

  public query ({ caller }) func getFeedbackStats() : async {
    totalEntries : Nat;
    uniqueUsers : Nat;
    averageAge : ?Nat;
  } {
    let totalEntries = feedbackMap.size();

    if (totalEntries == 0) {
      return {
        totalEntries;
        uniqueUsers = 0;
        averageAge = null;
      };
    };

    let entries = feedbackMap.values().toArray();
    let sumAges = entries.foldLeft(0, func(acc, entry) { acc + entry.age });
    let avgAge = sumAges / totalEntries;

    func countUniqueNames(entries : [FeedbackEntry]) : Nat {
      if (entries.size() <= 1) { return 1 };

      var uniqueCount = 1;
      var lastName = entries[0].name;

      for (i in Nat.range(1, entries.size())) {
        if (i < entries.size()) {
          let currentName = entries[i].name;
          if (not Text.equal(currentName, lastName)) {
            uniqueCount += 1;
            lastName := currentName;
          };
        };
      };
      uniqueCount;
    };

    {
      totalEntries;
      uniqueUsers = countUniqueNames(entries);
      averageAge = ?avgAge;
    };
  };

  public shared ({ caller }) func updateFeedbackWithPassword(index : Nat, newEntry : FeedbackEntry, password : Text) : async () {
    if (password != "vUWW5BaL") {
      Runtime.trap("Invalid password. Update not authorized.");
    };

    if (not feedbackMap.containsKey(index)) {
      Runtime.trap("Feedback entry not found. Update failed.");
    };

    feedbackMap.add(index, newEntry);
  };

  public shared ({ caller }) func deleteFeedbackWithPassword(index : Nat, password : Text) : async () {
    if (password != "vUWW5BaL") {
      Runtime.trap("Invalid password. Delete not authorized.");
    };

    if (not feedbackMap.containsKey(index)) {
      Runtime.trap("Feedback entry not found. Delete failed.");
    };

    feedbackMap.remove(index);
  };

  public query ({ caller }) func searchFeedback(searchTerm : Text, limit : Nat) : async [FeedbackEntry] {
    func matchesSearchTerm(entry : FeedbackEntry) : Bool {
      entry.name.contains(#text searchTerm) or
      entry.thoughts.contains(#text searchTerm) or
      entry.feelings.contains(#text searchTerm);
    };

    let searchResults = feedbackMap.values().toArray().filter(matchesSearchTerm);

    let minSize = if (searchResults.size() < limit) { searchResults.size() } else { limit };
    searchResults.sliceToArray(0, minSize);
  };

  public query ({ caller }) func isConnected() : async Bool {
    true;
  };

  public query ({ caller }) func getFeedbackSummary(limit : Nat) : async [FeedbackEntry] {
    func toSummary(entry : FeedbackEntry) : FeedbackEntry {
      entry;
    };

    let entriesArray = feedbackMap.values().toArray();
    let minSize = if (entriesArray.size() < limit) { entriesArray.size() } else { limit };
    entriesArray.sliceToArray(0, minSize).map(toSummary);
  };

  public query ({ caller }) func getCurrentTime() : async Time.Time {
    Time.now();
  };
};
