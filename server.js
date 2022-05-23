import { ApolloServer, gql } from "apollo-server";

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

  type Query {
    allTweets: [Tweet]
    tweet(id: ID): Tweet
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(url);
});
