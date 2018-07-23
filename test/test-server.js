const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, runServer, closeServer} = require("../server");
const expect = chai.expect;

chai.use(chaiHttp);

describe("blog", function () {
    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });

    // test strategy:
    //   1. make request to `/shopping-list`
    //   2. inspect response object and prove has right code and have
    //   right keys in response object.
    it("should list blogs on GET", function () {
        // for Mocha tests, when we're dealing with asynchronous operations,
        // we must either return a Promise object or else call a `done` callback
        // at the end of the test. The `chai.request(server).get...` call is asynchronous
        // and returns a Promise, so we just return it.
        return chai.request(app)
        .get("/blog-posts")
        .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.be.at.least(1);
            const expectedKeys = ["id", "title", "content", "author"];
            res.body.forEach(function (item) {
                expect(item).to.be.a("object");
                expect(item).to.include.keys(expectedKeys);
            });
        });
    });

    // test strategy:
    //  1. make a POST request with data for a new item
    //  2. inspect response object and prove it has right
    //  status code and that the returned object has an `id`
    it("should add a blog on POST", function () {
        const newBlog = {
            title: 'A Fake Blog Post',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione facilis error dolores explicabo animi, porro aperiam vitae eveniet aspernatur nam sit consectetur doloremque non alias exercitationem quam est! Molestiae, ipsum!' +
            'Praesentium ad laudantium unde est quia saepe ea repudiandae! Dolorum pariatur temporibus nisi hic obcaecati eos! Hic ipsam, sapiente distinctio animi consequuntur autem.Consectetur architecto ea animi blanditiis, ex unde.' +
            'Eius, voluptatibus.Sequi tenetur aspernatur non, asperiores reprehenderit eius, quia dolore autem architecto explicabo similique doloremque ipsam ipsa aliquam distinctio dolorem error quos soluta cum quisquam sint perferendis.Laudantium, ullam?',
            author: 'Bryan Spearman'
        };
        return chai.request(app)
        .post("/blog-posts")
        .send(newBlog)
        .then(function (res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.include.keys("id", "title", "content", "author");
            expect(res.body.id).to.not.equal(null);
            // response should be deep equal to `newItem` from above if we assign
            // `id` to it from `res.body.id`
            expect(res.body).to.deep.equal(
                Object.assign(newBlog, {
                    id: res.body.id
                })
            );
        });
    });

    // test strategy:
    //  1. initialize some update data (we won't have an `id` yet)
    //  2. make a GET request so we can get an item to update
    //  3. add the `id` to `updateData`
    //  4. Make a PUT request with `updateData`
    //  5. Inspect the response object to ensure it
    //  has right status code and that we get back an updated
    //  item with the right data in it.
    it("should update a blog  on PUT", function () {
        // we initialize our updateData here and then after the initial
        // request to the app, we update it with an `id` property so
        // we can make a second, PUT call to the app.
        const updateData = {
            title: 'A Fake Blog Post',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione facilis error dolores explicabo animi, porro aperiam vitae eveniet aspernatur nam sit consectetur doloremque non alias exercitationem quam est! Molestiae, ipsum!' +
                'Praesentium ad laudantium unde est quia saepe ea repudiandae! Dolorum pariatur temporibus nisi hic obcaecati eos! Hic ipsam, sapiente distinctio animi consequuntur autem.Consectetur architecto ea animi blanditiis, ex unde.' +
                'Eius, voluptatibus.Sequi tenetur aspernatur non, asperiores reprehenderit eius, quia dolore autem architecto explicabo similique doloremque ipsam ipsa aliquam distinctio dolorem error quos soluta cum quisquam sint perferendis.Laudantium, ullam?',
            author: 'Bryan Spearman'
        };

        return (
            chai.request(app).get("/blog-posts").then(function (res) {
                updateData.id = res.body[0].id;
                return chai.request(app).put(`/blog-posts/${updateData.id}`).send(updateData);
            })
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.deep.equal(updateData);
            })
        );
    });

    // test strategy:
    //  1. GET shopping list items so we can get ID of one
    //  to delete.
    //  2. DELETE an item and ensure we get back a status 204
    it("should delete a blog on DELETE", function () {
        return (
            chai.request(app).get("/blog-posts").then(function (res) {
                return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
            })
            .then(function (res) {
                expect(res).to.have.status(204);
            })
        );
    });
});