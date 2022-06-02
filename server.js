import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

// fake Dummy Data
let tweets = [
  { id: "1", text: "hello first", userId: "2" },
  { id: "2", text: "hello second", userId: "1" },
];

let users = [
  { id: "1", firstName: "ina", lastName: "jung" },
  { id: "2", firstName: "Elon", lastName: "Musk" },
];

// schema query language
// gql에게 쿼리의 형태를 알려주는 역할
const typeDefs = gql`
  # ts처럼 설정해주기
  type User {
    id: ID
    firstName: String!
    lastName: String!
    fullName: String!
  }

  type Tweet {
    id: ID
    text: String
    author: User
  }

  # restAPI를 GraphQL로 감싸기 위해 하나 만들어옴 오픈 API로
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }

  # GET을 위한 타입 설정
  # 가장 기본적인 Type이므로 이게 없으면 서버가 실행되지않음
  type Query {
    # !를 쓰게되면 nullunabled field가 된다. 즉, null이 반환되게 되면 error를 일으킴
    allTweets: [Tweet!]!
    allUsers: [User!]!
    # id 파라미터에 ! 적으면 필수값이 된다
    tweet(id: ID!): Tweet
    ping: String
    allMovies: [Movie!]!
    movie(id: String!): Movie
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
    allUsers: () => {
      return users;
    },
    allMovies: () => {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((res) => res.json())
        .then((json) => json.data.movies);
    },
    movie: (_, { id }) => {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((res) => res.json())
        .then((json) => json.data.movie);
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
  User: {
    // fakeDB에 fullName이 없어서 오류가 나야하는데, fullname이 넘어오게됨.
    // ApolloServer가 fullname이 없다는걸 감지하고 resolver를 뒤지기 시작함. 그리고 이름이 같은 fullName을 실행시킴
    fullName: ({ firstName, lastName }) => {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author: ({ userId }) => {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(url);
});
