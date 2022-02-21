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
