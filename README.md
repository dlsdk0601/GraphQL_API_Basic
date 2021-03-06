# GraphQL API

## new version review

> API 란?

<br />

API은 Application Programming Interface의 줄인 말이다.
즉, 브라우저를 통해서 클라이언트단과 서버단의 상호 작용을 의미한다.

<br />

> Rest API란?
> Rest API는 url을 통해서 통신하게 된다.
> 예를 들어 localhost:8080/api/movies 라는 url을 통해서 클라이언트단에서 fetch, axios 등을 사용하면 JSON Object을 넘겨준다. 클라이언트단에서는 이 데이터를 가공하여 UI에 뿌려주거나 저장하게 된다.

많은 서비스에서 Rest API를 사용는데, 조직화 되어있고, 이해하기 쉽기때문이다.
저 또한 회사에서 프로젝트를 하게되면 100% Rest API만을 사용합니다.

<br />

> Rest + HTTP

localhost:8080/api/movies라는 url을 통해서 특정 정보를 얻어 올 수 있었다면,
특정 정보를 수정하거나, 추가하거나, 삭제하고 싶다면 어떻게 해야할까.

그냥 단순하게 localhost:8080/api/create라는 API 주소로 통신을 하면 되지 않을까 라는 생각을 할 수도있지만, 추가하고 싶은 데이터의 정보가 많다면, 예를 들어 영화 정보를 추가하기 위해, 제목, 평점, 요약, 개봉년도, 출연배우 기타등등의 정보를 넘겨주기 위해서는 url 주소만으로는 감당하기 힘들다.

그리고 이해하기 쉽게 디자인 되어진 url이 이제는 더 이상 이해하기 쉽지않도록 침범이 되어진다. 그래서 HTTP 요청을 추가해야한다.

즉 GET localhost:8080/api/movies을 사용하면, 정보를 조회해준다면
POST localhost:8080/api/movies는 데이터를 추가 시켜준다.
이렇게 HTTP 요청을 추가하게 되면 Rest API의 설계가 더 쉬워지게 된다.

<br />

OverFecthing과 UnderFecthing을 막아주고, 기존의 REST로 구성 된 서버에서 여러 개의 데이터를 내보낼 때에는 클라이언트에서 서버로 여러번 요청하여 데이터를 받아낼 수 있었지만 GraphQL은 한 개의 쿼리로 여러 개의 데이터를 내가 갖고 싶은 데이터만을 서버에 요청할 수 있다.

<br />

> GraphQL

<br />

페이스북에서 만든 쿼리 언어이다.
client단에서 GraphQL을 다루는 연습을 하기 위한 레파지토리가 있었는데, API를 만드는 부분을 먼저 학습하지 않은 실수를 범했다.
client단에서 GraphQL을 사용하기 위해 서버단에서도 GrapQl을 사용하여야한다.

> 이제 부터 GrapQl API를 사용하기 위한 방법을 적어보려한다.

<br />

> GraphQL install

<br />

```
    npm i apollo-server graphql
```

<br />

물론 서버를 수정해도 끈김없이 돌아가게 하기 위해 nodemon을 설치 했다

> GraphQl server

<br />

nodemon을 설치한 후, package.json에서 scripts에 dev 명령을 추가 하였다.
서버를 실행 시키기 위해

```
    npm run dev
```

를 터미널창에 명령 시킨다.

<br />

> ApolloServer setting

<br />

ApolloServer를 구축하기 위해 apollo-server를 npm으로 다운 받았고, 이를 통해 서버를 구축 하는 코드는

```
    import { ApolloServer } from "apollo-server";

    const server = new ApolloServer({});

    server.listen().then(({ url }) => {
    console.log(url);
    });

```

<br />

이렇게 됩니다. 그런데 왠걸 npm run dev로 실행 시키면 오류가 발생합니다.
해당 오류를 잘 살펴보면,

```
throw Error('Apollo Server requires either an existing schema, modules or typeDef
```

이러한 오류가 나옵니다.
즉, apollo-server는 schema, modules 또는 typeDef를 요구한다고 나옵니다.

<br />

이게 무슨 말이냐.
apollo-server를 구축하기 위해, type을 설정하라는 뜻입니다.
gql은 Rest API와는 달리 type들의 집합이기 때문에 server에 data의 type을 전달해줘야 합니다.
(ts와 비슷한 느낌이 스믈스믈 듭니다..)

<br />

> typeDefs

<br />

그러면, 서버를 돌리기 위해 typeDefs를 만들어 줍니다. type을 그냥 객체로 적어서 전달해주는게 아닌, apollo-server로 부터 gql이라는 함수를 받아와서 ``(백틱)안에 type을 적어주면 됩니다.
(일전에 styled-components를 공부하면서 함수의 파라미터를 백틱안에 적어서 실행 할 수 있다는걸 확인 했습니다.)

<br />

```
    import { ApolloServer, gql } from "apollo-server";

    const typeDefs = gql`
    type Query {
        allTweets: [Tweet]
        tweet(id: ID): Tweet
    }
    `;

    const server = new ApolloServer({ typeDefs });

    server.listen().then(({ url }) => {
    console.log(url);
    });

```

<br />

위 와 같이 작성 후, 다시 실행 시키면 오류 없이 서버가 돌아가고 포트 번호 4000번으로 돌아가고 있다. 해당 localhost로 이동하면 apollo-server자체가 서버 확인을 위한 사이트 제공합니다.
(마치 postman같은 사이트가 나오고, query문이 잘 넘어오는지 확인 가능합니다.)

<br />

> Scalar Type

<br />

TypeDefs을 이용하여 gql에 type을 넘겨주는데, gql에서 기본적으로 제공하는 type을 Scalar Type이라고 한다. 공식 문서에 적혀 있는 Scalar Type은

```
    Int: A Signed 32 bit integer (정수형)
    Float: A Signed double-precision floating-point value (유리수)
    String: A UTF-8 character sequence (문자열)
    Boolean: true or false (불리언)
    ID: The ID scalar type represents a unique identifier, often used to refetch an object or as the key for a cache. (고유 아이디)

```

입니다.

<br />

> resolver

<br />

resolver는 GraphQL의 여러가지 타입(Query, Mutation)이 실제로 작동하는 부분입니다. 즉 스키마를 정의하면 그 스키마 필드에서 사용되는 콜백을 정의해주는 곳을 resolver라고 합니다.

<br />

```
    const resolvers = {
        Query: {
            allTweets: () => tweets,
            tweet: (_, args) => {
                const { id } = args;
                return tweets.find((item) => item.id === id);
            },
            allUsers: () => users,
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
```

<br>

resolver안에는 꼭 type Query에 들어있는 이름과 키값을 똑같이 네이밍으로 해야합니다.
왜냐하면 GraphQL을 이용하여 Query안에 어떠한 필드를 호출할 때,
resolvers안에 있는 같은 필드 이름의 함수를 호출하게된다
그리고 Qeury에서 정의해준 파라미터를 받으려면 두번째 인자를 받아야한다.
첫번째 인자는 root입니다.

<br />

> Rest API를 GraphQL로 감싸기

<br />

먼저 RestAPI의 response의 type을 정의 해준다.

<br />

```
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
```

<br />

그리고 resolver에서 fetch를 이용하여 불러오면 끝입니다.
해당 작업은 로딩에 시간이 좀 걸리는데, RestAPI로 먼저 불러와야하기 때문에 오래 걸리는 것이고, 현업에서는 해당 방법을 굳이 선호하지는 않을꺼 같습니다.

<br />

```
    allMovies: () => {
        return fetch("https://yts.mx/api/v2/list_movies.json")
            .then((res) => res.json())
            .then((json) => json.data.movies);
    }
```

<br />

## old version

> GraphQL install

<br />

```
    npm i apollo-yoga
```

<br />

> index.js

<br />

기본적인 GraphQL서버 셋팅을 위해 GraphQLServer을 사용하였다.

<br />

```index.js

    import { GraphQLServer } from "graphql-yoga";
    import resolvers from "./graphql/resolvers";

    const server = new GraphQLServer({
        typeDefs: "./graphql/schema.graphql",
        resolvers
    })

    server.start({port: 3000}, () => console.log("localhost:3000")) ;
```

<br />

3000포트를 사용하였고, GraphQL 스키마를 정의하는 schema.graphql과 resolvers를 셋팅 해주었다.

<br />

> schema.graphql

<br />

GraphQL에서 schema.graphql은 타입을 정의하는 일을 한다.
GraphQL서버에 요청할 때(qeury, mutation, subscription), 값을 반환할때의 타입을 설정한다.

<br />

```schema.graphql

    type Movie{
    id: Int!
    title: String!
    rating: Float!
    summary: String!
    language: String!
    medium_cover_image: String!
    }

    type Query{
        movies(limit: Int, rating: Float): [Movie]!
    }

    type Mutation {
        addMovie(name: String!, score: Int!): Movie!
    }
```

<br />

> resolver

<br />

resolvers는 query, mutation, subscription과 같이 선언된 타입을 정의하는 부분이다. 즉 함수를 정의하는 곳이다.

<br />

```resolvers.js

    import { getMovies } from "../db";
    const resolvers = {
        Query: {
            movies: (_, {limit, rating}) => getMovies(limit, rating)
        },
        Mutation: {
         addMovie: (_, {name, score}) => addMovie(name, score),
        }
    }

    //movies라는 query에 limit, rating을 파라미터로 넣고 요청하면
    //getMovies라는 함수를 실행시켜 return값을 반환한다.

    export default resolvers;
```

<br />

db에 대한 함수는 db.js에 따로 정리 해두었다.

<br />

```db.js

    const API_URL = "https://yts.mx/api/v2/list_movies.json?";
    //영화 정보 오픈 API

    export const getMovies = (limit, rating) => {
        let REQUEST_URL = API_URL;
        if(limit > 0){
            REQUEST_URL += `limit=${limit}`
        }
        if(rating > 0){
            REQUEST_URL += `&minimum_rating=${rating}`
        }
        return fetch(`${REQUEST_URL}`)
                .then(res => res.json())
                .then(json => json.data.movies);
    };

    export const addMovie = (name, score) => {
        const newMovie = {
            id: Date.now(),
            name,
            score
        }

        movies.push(newMovie);
        return newMovie;
    }
```
