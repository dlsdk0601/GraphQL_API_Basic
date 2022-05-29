import { ApolloServer, gql } from "apollo-server";

// fake Dummy Data
let tweets = [
  { id: "1", text: "hello first" },
  { id: "2", text: "hello second" },
];

// schema query language
// gql에게 쿼리의 형태를 알려주는 역할
const typeDefs = gql`
  # ts처럼 설정해주기
  type User {
    id: ID
    username: String
  }

  type Tweet {
    id: ID
    text: String
    author: User
  }

  # GET을 위한 타입 설정
  # 가장 기본적인 Type이므로 이게 없으면 서버가 실행되지않음
  type Query {
    # !를 쓰게되면 nullunabled field가 된다. 즉, null이 반환되게 되면 error를 일으킴
    allTweets: [Tweet!]!

    # id 파라미터에 ! 적으면 필수값이 된다
    tweet(id: ID!): Tweet
    ping: String
  }

  # Mutaion 을 위한 타입 설정
  type Mutation {
    postTweet(text: String, userId: ID): Tweet
    deleteTweet(id: ID): Boolean
  }
`;

const resolvers = {
  Query: {
    // 이름이 꼭 type Query에 들어있는 키값과 똑같은 네이밍으로 해야함
    // GPQ을 이용하여 type Query안에 어떠한 필드를 허출하게 되면
    // resolvers안에 있는 같은 필드 이름의 함수를 호출하게된다
    allTweets: () => {
      return tweets;
    },
    tweet: (_, args) => {
      // Qeury에서 정의해준 파라미터를 받으려면 두번째 인자를 받아야한다.
      const { id } = args;
      return tweets.find((item) => item.id === id);
    },
  },
  Mutation: {
    postTweet: (_, { text, userId }) => {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet: (_, { id }) => {
      const tweet = tweets.find((item) => item.id === id);
      if (!tweet) {
        return false;
      }

      tweets = tweets.filter((item) => item !== id);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(url);
});
