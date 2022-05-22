# GraphQL API

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
