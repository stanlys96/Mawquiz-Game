import Array "mo:base/Array";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
actor {
  public type GameInterface = {
    question: Text;
    text1: Text;
    text2: Text;
    text3: Text;
    text4: Text;
    answer1Clicked: Bool;
    answer2Clicked: Bool;
    answer3Clicked: Bool;
    answer4Clicked: Bool;
    additionalAnswers: Int;
    trueOrFalseAnswer: Text;
    timeLimit: Int;
    answerOptions: Text;
    imageUrl: Text;
  };

  public type Game = {
    title: Text;
    description: Text;
    gamePin: Text;
    games: [GameInterface];
  };

  public type User = {
    owner: Text;
    nickname: Text;
    games: [Game];
  };

  var userHashMap: HashMap.HashMap<Principal, User> = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);

  public func addNewUser(user: Principal, nickname: Text) {
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
      nickname = nickname;
      games = [];
    };

    userHashMap.put(user, newUser);
  };

  public func updateNickname(user: Text, newNickname: Text) {
    for ((key, value) in userHashMap.entries()) {
      if (value.owner == user) {
        var updatedUser: User = {
          owner = value.owner;
          nickname = newNickname;
          games = value.games;
        };
        
        userHashMap.put(key, updatedUser);
        return;
      };
    };
  };

  public shared func getUser(user: Principal): async ?User {
    return userHashMap.get(user);
  };
};
