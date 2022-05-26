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

  # GET을 위한 타입 설정
  # 가장 기본적인 Type이므로 이게 없으면 서버가 실행되지않음
  type Query {
    # !를 쓰게되면 nullunabled field가 된다. 즉, null이 반환되게 되면 error를 일으킴
    allTweets: [Tweet!]!

    # id 파라미터에 ! 적으면 필수값이 된다
    tweet(id: ID!): Tweet
  }

  # Mutaion 을 위한 타입 설정
  type Mutation {
    postTweet(text: String, userId: ID): Tweet
    deleteTweet(id: ID): Boolean
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(url);
});
