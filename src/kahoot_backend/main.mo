import Array "mo:base/Array";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Text "mo:base/Text";

actor {
  public type Question = {
    id: Nat32;
    questionType: Text;
    question: Text;
    text1: Text;
    text2: Text;
    text3: Text;
    text4: Text;
    answer1Clicked: Bool;
    answer2Clicked: Bool;
    answer3Clicked: Bool;
    answer4Clicked: Bool;
    additionalAnswers: Nat32;
    trueOrFalseAnswer: Text;
    timeLimit: Nat32;
    answerOptions: Text;
    imageUrl: Text;
  };

  public type Game = {
    owner: Text;
    title: Text;
    timestamp: Text;
    description: Text;
    played: Nat32;
    isLive: Bool;
    questions: [Question];
    gamePin: Text;
    imageCoverUrl: Text;
  };

  public type User = {
    owner: Text;
    nickname: Text;
  };

  var userHashMap: HashMap.HashMap<Principal, User> = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);
  var nicknameMap: HashMap.HashMap<Text, Text> = HashMap.HashMap<Text, Text>(10, Text.equal, Text.hash);
  var gameHashMap: HashMap.HashMap<Text, Game> = HashMap.HashMap<Text, Game>(10, Text.equal, Text.hash);

  public func addNewUser(user: Principal) {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("Anonymous principal not allowed");
    };

    for ((key, value) in userHashMap.entries()) {
      if (value.owner == Principal.toText(user)) {
        return;
      };
    };

    var newUser: User = {
      owner = Principal.toText(user);
      nickname = Principal.toText(user);
      games = [];
    };

    userHashMap.put(user, newUser);
  };

  public func updateNickname(user: Text, newNickname: Text): async Bool {
    for (nickname in nicknameMap.keys()) {
      if (nickname == newNickname) {
        return false;
      };
    };

    for ((key, value) in userHashMap.entries()) {
      if (value.owner == user) {
        var updatedUser: User = {
          owner = value.owner;
          nickname = newNickname;
        };
        ignore nicknameMap.remove(value.nickname);
        userHashMap.put(key, updatedUser);
        nicknameMap.put(newNickname, user);
        return true;
      };
    };

    return false;
  };

  public shared func getUser(user: Principal): async ?User {
    return userHashMap.get(user);
  };

  public func addGame(gamePin: Text, owner: Text, title: Text, description: Text, questions: [Question], timestamp: Text, imageCoverUrl: Text): async Bool {
    switch (gameHashMap.get(gamePin)) {
      case (?_exists) {
        return false;
      };
      case null {
        var result: Game = {
          owner = owner;
          title = title;
          description = description;
          played = 0;
          questions = questions;
          timestamp = timestamp;
          isLive = false;
          gamePin = gamePin;
          imageCoverUrl = imageCoverUrl;
        };
        gameHashMap.put(gamePin, result);
        return true;
      };
    }
  };

  public func updateGame(gamePin: Text, title: Text, description: Text, questions: [Question], imageCoverUrl: Text): async Bool {
    switch (gameHashMap.get(gamePin)) {
      case (?existingGame) {
        var result: Game = {
          owner = existingGame.owner;
          title = title;
          description = description;
          played = existingGame.played;
          questions = questions;
          timestamp = existingGame.timestamp;
          isLive = existingGame.isLive;
          gamePin = gamePin;
          imageCoverUrl = imageCoverUrl;
        };
        gameHashMap.put(gamePin, result);
        return true;
      };
      case null {
        return false;
      };
    }
  };

  public func getGame(gamePin: Text): async ?Game {
    gameHashMap.get(gamePin);
  };

  public func getGamesByPrincipal(owner: Text): async [Game] {
    var result: [Game] = [];
    for ((key, value) in gameHashMap.entries()) {
      if (value.owner == owner) {
        result := Array.append(result, [value]);
      }
    };
    return result;
  };

  public func getUserNickname(user: Text): async Text {
    let currentUser = userHashMap.get(Principal.fromText(user));
    switch (currentUser) {
      case (?value) { return value.nickname; };
      case null { return user; };
    };
  };
};
