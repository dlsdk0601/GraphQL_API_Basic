# GraphQL API

<br />

OverFecthing과 UnderFecthing을 막아주고, 기존의 REST로 구성 된 서버에서 여러 개의 데이터를 내보낼 때에는 클라이언트에서 서버로 여러번 요청하여 데이터를 받아낼 수 있었지만 GraphQL은 한 개의 쿼리로 여러 개의 데이터를 내가 갖고 싶은 데이터만을 서버에 요청할 수 있다.

<br />

> GraphQL Yoga install

<br />

```
    npm i graphql-yoga
```

<br />

물론 서버를 수정해도 끈김없이 돌아가게 하기 위해 nodemon을 설치 했다

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

