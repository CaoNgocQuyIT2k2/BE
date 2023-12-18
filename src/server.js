import express from 'express';
import cors from 'cors';
import rootRoute from './routes/rootRoute.js';

const app = express();

//midle ware định vị thư mục tài nguyên
app.use(express.static("."));


// graphql 
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

let schemaGrapql = buildSchema(`
    type User{
        id: ID 
        username: String 
        age: Int
        email: String
        product: [Product]    
    }

    type Product {
        productId: ID 
        productName: String

    }

    type RootQuery {
        getUser: String
    }

    type RootMutation {
        createUser: String
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);

let resolve={
    getUser: () => {
        return "node 37"
    },
    createUser: () => {},
};


app.use("/api",graphqlHTTP({
    rootValue: schemaGrapql, //nơi khai báo đối tượng, (tên model, tên hàm)
    schema: resolve, //gắn dữ liệu vào các hàm ở schema
    graphiql:true,
}))

// Use CORS middleware
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Mount your routes
app.use( rootRoute);

// Start the server on port 8080
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});


import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const options = {
    definition: {
        info: {
            title: "api node 37",
            version: "1.0.0.0.0.0.0.0.0.0"
        }
    },
    apis: ["src/swagger/"]
}

const specs = swaggerJsDoc(options);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));


/**
 * @swagger
 * /api/v1/user/getUser:
 *  get:
 *      description: responses
 *      tags: [User]
 *      responses:
 *          200: 
 *              description: success   
 */

/**
 * @swagger
 * /api/v1/user/updateUser/{id}:
 *  put:
 *      description: responses
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *      - in: body
 *        name: user
 *        schema:
 *           type: object
 *           properties:
 *             userName:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *      responses:
 *          200: 
 *              description: res   
 */


//prisma

// 1.yarn add prisma @prisma/client
// 2.  yarn prisma init
// 3. cập nhật lại chuỗi kết nối db trong .env và tên hệ csdl
// 4. Yarn prisma db pull để kéo dữ liệu tạo model trong db
// 5. Yarn prisma generate - để cập nhật model 