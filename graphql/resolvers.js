const nico = {
    name: "nico",
    age: 18,
    gender: "female"
}

const resolvers = {
    Query: {
        person: () => nico
    }
}

export default resolvers;